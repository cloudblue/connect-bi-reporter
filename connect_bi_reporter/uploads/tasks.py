import io
from datetime import datetime
import time
from zipfile import ZipFile

from connect.client import ClientError
from connect.eaas.core.decorators import schedulable
from connect.eaas.core.responses import (
    ScheduledExecutionResponse,
)
from connect_extension_utils.db.models import get_db_ctx_manager
from connect_extension_utils.connect_services.base import get_extension_owner_client
from sqlalchemy.exc import DBAPIError

from connect_bi_reporter.connect_services.reports import download_report
from connect_bi_reporter.feeds.enums import FeedStatusChoices
from connect_bi_reporter.feeds.models import Feed
from connect_bi_reporter.uploads.enums import Errors, Info
from connect_bi_reporter.uploads.models import Upload
from connect_bi_reporter.uploads.services import create_process_upload_tasks, create_uploads
from connect_bi_reporter.uploads.storage_utils import upload_file
from connect_bi_reporter.scheduler import ResponseTypeEnum, Scheduler


class UploadTaskApplicationMixin:
    @schedulable(
        'Create Uploads',
        'Create Upload objects base on Connect Report files',
    )
    def create_uploads(self, schedule):
        missing_params = [
            param for param in ['installation_id', 'account_id']
            if param not in schedule['parameter']
        ]
        if missing_params:
            params = ', '.join(missing_params)
            return ScheduledExecutionResponse.fail(
                output=f'The following required schedule parameters are missing: `{params}`.',
            )

        installation_id = schedule['parameter']['installation_id']
        account_id = schedule['parameter']['account_id']

        extension_owner_client = get_extension_owner_client(self.logger)
        installation_client = self.get_installation_admin_client(installation_id)
        try:

            with get_db_ctx_manager(self.config) as db:
                feeds = db.query(Feed).filter(
                    Feed.account_id == account_id,
                    Feed.status == FeedStatusChoices.enabled,
                ).all()
                if not feeds:
                    self.logger.info(Info.no_feeds_to_process)
                    return ScheduledExecutionResponse.done()
                uploads = create_uploads(db, installation_client, self.logger, feeds)
                scheduler = Scheduler(extension_owner_client, self.context, self.logger)
                create_process_upload_tasks(
                    uploads,
                    scheduler,
                    installation_id=installation_id,
                    account_id=account_id,
                )
        except (ClientError, DBAPIError) as exc:
            output = Errors.connect_client_error
            if isinstance(exc, DBAPIError):
                output = Errors.db_error
            self.logger.error(msg=output, exc_info=True)
            return ScheduledExecutionResponse.fail(output=output)
        return ScheduledExecutionResponse.done()

    @schedulable(
        'Process Uploads',
        'This task will download the report from connect and published it in the respective'
        ' storage (only Azure at the moment).'
        'It expects as parameter an upload_id.',
    )
    def process_upload(self, schedule):
        if 'installation_id' not in schedule['parameter']:
            return ScheduledExecutionResponse.fail(output='Parameter installation_id is missing.')

        begin_time = time.monotonic()
        instalation_client = self.get_installation_admin_client(
            schedule['parameter']['installation_id'],
        )

        upload_id = schedule['parameter'].get('upload_id')

        with get_db_ctx_manager(self.config) as db:
            upload = db.query(Upload).filter_by(id=upload_id).with_for_update().first()

            if not upload:
                return ScheduledExecutionResponse.fail(output=f'Invalid upload `{upload_id}`.')

            if upload.status != Upload.STATUSES.pending:
                return ScheduledExecutionResponse.fail(
                    output=f'Cannot process upload in status `{upload.status}`.',
                )

            upload.status = Upload.STATUSES.processing
            db.add(upload)
            db.commit()

            execution_method_result = ResponseTypeEnum.SUCCESS
            try:
                report_data = download_report(instalation_client, upload.report_id)

                feed = upload.feed
                file_name = f'{feed.file_name}_{datetime.now().strftime("%Y%m%d %H:%M:%S")}.csv'

                with ZipFile(io.BytesIO(report_data), 'r') as myzip:
                    with myzip.open('report.csv') as myfile:
                        uploaded_file_props = upload_file(
                            myfile.read(), file_name, feed.credential, self.logger, self.config,
                        )
                        upload.size = uploaded_file_props.get('size', 0)

                upload.status = Upload.STATUSES.uploaded
                upload.name = file_name
                db.add(upload)
                db.commit()
            except Exception:
                self.logger.exception(msg='Error processing upload')
                upload.status = Upload.STATUSES.failed
                db.add(upload)
                db.commit()
                execution_method_result = ResponseTypeEnum.FAIL

            took = time.monotonic() - begin_time
            self.logger.info(
                'Execution of `process_upload` task for Upload {0} finished (took "{1}"): '
                'Upload status: `{2}`, Taks result: `{3}`.'.format(
                    upload.id,
                    took,
                    upload.status,
                    execution_method_result,
                ),
            )
            return getattr(ScheduledExecutionResponse, execution_method_result)()
