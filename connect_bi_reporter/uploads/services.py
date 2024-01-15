from datetime import datetime, timedelta

from sqlalchemy import util
from connect.client import ClientError
from connect.client.rql import R

from connect_bi_reporter.feeds.enums import FeedStatusChoices
from connect_bi_reporter.scheduler import TriggerTypeEnum
from connect_bi_reporter.uploads.models import Upload
from connect_bi_reporter.uploads.enums import Errors, Info
from connect_bi_reporter.connect_services.reports import get_report_schedule, get_reporting_report
from connect_bi_reporter.constants import (
    ALLOWED_RENDERERS,
    PROCESS_UPLOAD_TAKS_BASE_METHOD_PAYLOAD,
    SECONDS_BACKOFF_FACTOR,
    SECONDS_DELAY,
    UPLOAD_BASE_ERROR_LOG_MESSAGE as msg,
)


def _get_report_schedule_reason(client, report_schedule_id):
    report_schedule = None
    reason = None
    mark_as_disabled = False
    try:
        report_schedule = get_report_schedule(client, report_schedule_id)
    except ClientError as ex:
        reason = Errors.report_schedule_client_error.format(
            report_schedule_id=report_schedule_id,
            error=str(ex),
        )
    if report_schedule and report_schedule['status'] != FeedStatusChoices.enabled:
        reason = Errors.report_schedule_invalid_status.format(
            report_schedule_id=report_schedule_id,
            status=report_schedule['status'],
        )
        mark_as_disabled = True
    return reason, mark_as_disabled


def _check_report_not_exists(report_file, feed, logger, **kwagrs):
    is_not_valid = False
    reason = kwagrs.pop('reason')
    if not report_file:
        logger.info(
            msg.format(
                schedule_id=feed.schedule_id,
                reason=reason or Errors.report_file_not_found,
            ),
        )
        is_not_valid = True
    return is_not_valid


def _check_not_valid_renderer(report_file, feed, logger, **kwagrs):
    is_not_valid = False
    if report_file and report_file['renderer'] not in ALLOWED_RENDERERS:
        renderer = report_file['renderer']
        logger.info(
            msg.format(
                schedule_id=feed.schedule_id,
                reason=Errors.report_file_invalid_renderer.format(
                    report_file_id=report_file['id'],
                    renderer=renderer,
                ),
            ),
        )
        is_not_valid = True
    return is_not_valid


def _check_already_related(report_file, feed, logger, **kwargs):
    is_not_valid = False
    existing_reports_ids = kwargs.pop('existing_reports_ids')
    if report_file and report_file["id"] in existing_reports_ids:
        logger.info(
            msg.format(
                schedule_id=feed.schedule_id,
                reason=Errors.report_file_already_related.format(
                    report_file_id=report_file['id'],
                ),
            ),
        )
        is_not_valid = True
    return is_not_valid


validators = (
    _check_report_not_exists,
    _check_not_valid_renderer,
    _check_already_related,
)


def is_not_valid_for_creation(*args, **kwargs):
    is_not_valid_for_creation = False
    for validator in validators:
        if validator(*args, **kwargs):
            is_not_valid_for_creation = True
            break
    return is_not_valid_for_creation


def disable_feeds(db, feeds, logger):
    for feed in feeds:
        feed.status = FeedStatusChoices.disabled
        logger.info(
            f"Feed `{feed.id}` was disabled due to invalid"
            f" Report Schedule `{feed.schedule_id}` status.",
        )
    db.add_all(feeds)
    db.commit()
    return feeds


def create_uploads(db, client, logger, feeds):
    feeds_to_disable = []
    uploads = []
    rql = R().status.eq('succeeded')
    feed_ids = [f.id for f in feeds]
    existing_reports_ids = util.flatten_iterator(db.query(Upload.report_id).filter(
        Upload.feed_id.in_(feed_ids),
    ))
    for feed in feeds:
        report_file = None
        rql &= R().account.id.eq(feed.account_id) & R().schedule.id.eq(feed.schedule_id)
        reason, mark_as_disabled = _get_report_schedule_reason(client, feed.schedule_id)
        if mark_as_disabled:
            feeds_to_disable.append(feed)
        if not reason:
            report_file = get_reporting_report(client, rql)

        args = (report_file, feed, logger)
        extra_context = {
            'reason': reason,
            'existing_reports_ids': existing_reports_ids,
        }

        if is_not_valid_for_creation(*args, **extra_context):
            continue

        uploads.append(Upload(
            feed_id=feed.id,
            report_id=report_file['id'],
        ))
    if uploads:
        db.add_all_with_next_verbose(uploads, related_id_field=Upload.feed_id.name)
        db.flush()
        uploads_info = ', '.join('Upload={0} for Feed={1}'.format(u.id, u.feed_id) for u in uploads)
        logger.info(Info.new_upload_created.format(uploads_info=uploads_info))
    disable_feeds(db, feeds_to_disable, logger)
    return uploads


def get_process_upload_task_payload(installation_id, upload_id, account_id):
    payload = PROCESS_UPLOAD_TAKS_BASE_METHOD_PAYLOAD
    payload.update({'name': f'Process Uploads - {account_id}'})
    parameters = {
        'installation_id': installation_id,
        'upload_id': upload_id,
    }
    payload.update({'parameter': parameters})
    return payload


def create_process_upload_tasks(uploads, scheduler, **kwargs):
    installation_id = kwargs.get('installation_id')
    account_id = kwargs.get('account_id')
    delay = SECONDS_DELAY
    now = datetime.utcnow()
    for upload in uploads:
        method_payload = get_process_upload_task_payload(
            installation_id,
            upload.id,
            account_id,
        )
        task = scheduler.create_schedule_task(
            TriggerTypeEnum.onetime,
            {'date': (now + timedelta(seconds=delay)).isoformat()},
            method_payload,
        )
        delay += SECONDS_BACKOFF_FACTOR
        scheduler.logger.info(
            Info.new_upload_schedule_task_created.format(
                task_id=task['id'],
                upload_id=upload.id,
                report_id=upload.report_id,
            ),
        )
