import re

import pytest
from connect.client import ClientError
from connect.eaas.core.inject.models import Context
from sqlalchemy.exc import DBAPIError

from connect_bi_reporter.events import ConnectBiReporterEventsApplication


def test_process_upload(dbsession, connect_client, installation, logger, mocker, upload_factory):
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
    )
    ext.get_installation_admin_client = lambda self: connect_client

    with open('./tests/uploads/test-zip.zip', 'rb') as zf:
        mocker.patch(
            'connect_bi_reporter.uploads.tasks.download_report',
            return_value=zf.read(),
        )
        mocker.patch(
            'connect_bi_reporter.uploads.tasks.upload_file',
            return_value={'size': 1024},
        )

    upload = upload_factory()
    feed = upload.feed

    result = ext.process_upload(schedule={
        'parameter': {'upload_id': upload.id, 'installation_id': installation['id']},
    })

    assert result.status == 'success'

    dbsession.refresh(upload)
    assert re.match(feed.file_name + '_\\d{8} \\d{2}:\\d{2}:\\d{2}.csv', upload.name)
    assert upload.size == 1024
    assert upload.status == upload.STATUSES.uploaded


def test_process_upload_report_download_failed(
    dbsession, connect_client, installation, logger, mocker, upload_factory,
):
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
    )
    ext.get_installation_admin_client = lambda self: connect_client

    mocker.patch(
        'connect_bi_reporter.uploads.tasks.download_report',
        side_effect=Exception,
    )

    upload = upload_factory()

    result = ext.process_upload(schedule={
        'parameter': {'upload_id': upload.id, 'installation_id': installation['id']},
    })

    assert result.status == 'fail'

    dbsession.refresh(upload)
    assert upload.name is None
    assert upload.size is None
    assert upload.status == upload.STATUSES.failed


def test_process_upload_report_upload_failed(
    dbsession, connect_client, installation, logger, mocker, upload_factory,
):
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
    )
    ext.get_installation_admin_client = lambda self: connect_client

    with open('./tests/uploads/test-zip.zip', 'rb') as zf:
        mocker.patch(
            'connect_bi_reporter.uploads.tasks.download_report',
            return_value=zf.read(),
        )
        mocker.patch(
            'connect_bi_reporter.uploads.tasks.upload_file',
            side_effect={},
        )

    upload = upload_factory()

    result = ext.process_upload(schedule={
        'parameter': {'upload_id': upload.id, 'installation_id': installation['id']},
    })

    assert result.status == 'fail'

    dbsession.refresh(upload)
    assert upload.name is None
    assert upload.size is None
    assert upload.status == upload.STATUSES.failed


@pytest.mark.parametrize('upload_status', ('processing', 'failed', 'uploaded'))
def test_process_upload_w_invalid_status(
    upload_status, dbsession, connect_client, installation, logger, mocker, upload_factory,
):
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
        installation_client=connect_client,
        installation=installation,
    )
    ext.get_installation_admin_client = lambda self: connect_client

    with open('./tests/uploads/test-zip.zip', 'rb') as zf:
        mocker.patch(
            'connect_bi_reporter.uploads.tasks.download_report',
            return_value=zf.read(),
        )
        mocker.patch(
            'connect_bi_reporter.uploads.tasks.upload_file',
            side_effect=Exception,
        )

    upload = upload_factory(status=upload_status)

    result = ext.process_upload(schedule={
        'parameter': {'upload_id': upload.id, 'installation_id': installation['id']},
    })

    assert result.status == 'fail'
    assert result.output == f'Cannot process upload in status `{upload_status}`.'

    dbsession.refresh(upload)
    assert upload.name is None
    assert upload.size is None
    assert upload.status == upload_status


def test_process_upload_no_installation_id(
    dbsession, connect_client, logger, mocker, upload_factory,
):
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
    )
    ext.get_installation_admin_client = lambda self: connect_client

    mocker.patch(
        'connect_bi_reporter.uploads.tasks.download_report',
        side_effect=Exception,
    )

    upload = upload_factory()

    result = ext.process_upload(schedule={'parameter': {'upload_id': upload.id}})

    assert result.status == 'fail'
    assert result.output == 'Parameter installation_id is missing.'

    dbsession.refresh(upload)
    assert upload.name is None
    assert upload.size is None
    assert upload.status == upload.STATUSES.pending


@pytest.mark.parametrize('upload_id', (None, 'Invalid-id'))
def test_process_upload_invalid_upload_id(
    dbsession, connect_client, installation, logger, mocker, upload_factory, upload_id,
):
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
    )
    ext.get_installation_admin_client = lambda self: connect_client

    mocker.patch(
        'connect_bi_reporter.uploads.tasks.download_report',
        side_effect=Exception,
    )

    upload_factory()

    result = ext.process_upload(schedule={
        'parameter': {'upload_id': upload_id, 'installation_id': installation['id']},
    })

    assert result.status == 'fail'
    assert result.output == f'Invalid upload `{upload_id}`.'


def test_create_upload_schedule_task(
    connect_client,
    client_mocker_factory,
    logger,
    installation,
    report_schedule,
    feed_factory,
    mocker,
    dbsession,
    upload_factory,
    eaas_schedule_task,
):
    schedule = {'parameter': {'installation_id': installation['id']}}
    report_file = {'id': 'RP-262-019-481', 'renderer': 'csv'}
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
        context=Context(
            extension_id='EXT-01',
            environment_id='test',
        ),
    )
    ext.get_installation_admin_client = lambda self: connect_client
    client_mocker = client_mocker_factory(base_url=connect_client.endpoint)
    client_mocker('devops').installations[installation['id']].get(
        return_value=installation,
    )
    mocker.patch(
        'connect_bi_reporter.uploads.services.get_report_schedule',
        return_value=report_schedule,
    )
    mocker.patch(
        'connect_bi_reporter.uploads.services.get_reporting_report',
        return_value=report_file,
    )
    (
        client_mocker.ns('devops')
        .services['EXT-01']
        .environments['test']
        .schedules.create(return_value=eaas_schedule_task)
    )
    feed = feed_factory(
        schedule_id=report_schedule['id'],
        account_id=installation['owner']['id'],
        status=feed_factory._meta.model.STATUSES.enabled,
    )

    result = ext.create_uploads(schedule)
    upload = dbsession.query(upload_factory._meta.model).first()
    assert result.status == 'success'
    assert upload.report_id == report_file['id']
    assert upload.status == upload_factory._meta.model.STATUSES.pending
    assert upload.feed_id == feed.id
    assert logger.method_calls[0].args[0] == (
        f'New Uploads were created: `Upload={upload.id}'
        f' for Feed={feed.id}`.'
    )
    assert logger.method_calls[1].args[0] == (
        f'Periodic Schedule Task created: `{eaas_schedule_task["id"]}`.'
    )
    assert logger.method_calls[2].args[0] == (
        f'New Scheduled Task `{eaas_schedule_task["id"]}`'
        f' created for Upload `{upload.id}`: '
        f'Will process Report File `{report_file["id"]}`'
    )


def test_create_upload_schedule_task_no_feeds(
    connect_client,
    client_mocker_factory,
    logger,
    installation,
):
    schedule = {'parameter': {'installation_id': installation['id']}}
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
        context=Context(
            extension_id='EXT-01',
            environment_id='test',
        ),
    )
    ext.get_installation_admin_client = lambda self: connect_client
    client_mocker = client_mocker_factory(base_url=connect_client.endpoint)
    client_mocker('devops').installations[installation['id']].get(
        return_value=installation,
    )

    result = ext.create_uploads(schedule)
    assert result.status == 'success'
    assert logger.method_calls[0].args[0] == 'No Feeds found to process.'


@pytest.mark.parametrize(
    'report_file,rs,message,report_id',
    (
        (
            {'id': 'RP-262-019-481', 'renderer': 'csv'},
            {'return_value': {'id': 'RS-001', 'status': 'disabled'}},
            (
                "Skipping Upload creation for Report Schedule `RS-2796-9021`: "
                "'Report Schedule `RS-2796-9021` invalid status `disabled`'."
            ),
            'foo',
        ),
        (
            {'id': 'RP-262-019-481', 'renderer': 'excel'},
            {'return_value': {'id': 'RS-001', 'status': 'enabled'}},
            (
                "Skipping Upload creation for Report Schedule `RS-2796-9021`: "
                "'Report File `RP-262-019-481` renderer `excel` not allowed'."
            ),
            'foo',
        ),
        (
            {'id': 'RP-262-019-481', 'renderer': 'excel'},
            {'side_effect': ClientError(status_code=500)},
            (
                "Skipping Upload creation for Report Schedule `RS-2796-9021`: "
                "'Report Schedule `RS-2796-9021` can not be found (500 Internal Server Error)'."
            ),
            'foo',
        ),
        (
            {'id': 'RP-262-019-481', 'renderer': 'csv'},
            {'return_value': {'id': 'RS-001', 'status': 'enabled'}},
            (
                "Skipping Upload creation for Report Schedule `RS-2796-9021`: "
                "'Report File `RP-262-019-481` is already related to an existing Upload'."
            ),
            'RP-262-019-481',
        ),
    ),
)
def test_create_upload_schedule_task_service_validation(
    connect_client,
    client_mocker_factory,
    logger,
    installation,
    report_schedule,
    feed_factory,
    upload_factory,
    mocker,
    report_file,
    rs,
    message,
    report_id,
):
    schedule = {'parameter': {'installation_id': installation['id']}}
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
        context=Context(
            extension_id='EXT-01',
            environment_id='test',
        ),
    )
    ext.get_installation_admin_client = lambda self: connect_client
    client_mocker = client_mocker_factory(base_url=connect_client.endpoint)
    client_mocker('devops').installations[installation['id']].get(
        return_value=installation,
    )
    mocker.patch(
        'connect_bi_reporter.uploads.services.get_report_schedule',
        **rs,
    )
    mocker.patch(
        'connect_bi_reporter.uploads.services.get_reporting_report',
        return_value=report_file,
    )
    feed = feed_factory(
        schedule_id=report_schedule['id'],
        account_id=installation['owner']['id'],
        status=feed_factory._meta.model.STATUSES.enabled,
    )
    upload_factory(
        feed_id=feed.id,
        report_id=report_id,
    )

    result = ext.create_uploads(schedule)
    assert result.status == 'success'
    assert logger.method_calls[0].args[0] == message


def test_create_upload_schedule_task_fail_no_installation_in_parameter(
    connect_client,
    logger,
):
    schedule = {'parameter': {}}
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
        context=Context(
            extension_id='EXT-01',
            environment_id='test',
        ),
    )

    result = ext.create_uploads(schedule)
    assert result.status == 'fail'
    assert result.output == 'Parameter installation_id is missing.'


def test_create_upload_schedule_task_fail_connect_client_error(
    connect_client,
    logger,
    client_mocker_factory,
    installation,
    feed_factory,
):
    schedule = {'parameter': {'installation_id': installation['id']}}
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
        context=Context(
            extension_id='EXT-01',
            environment_id='test',
        ),
    )
    ext.get_installation_admin_client = lambda self: connect_client

    client_mocker = client_mocker_factory(base_url=connect_client.endpoint)
    client_mocker('devops').installations[installation['id']].get(
        return_value=ClientError(status_code=500),
    )

    feed_factory(
        account_id=installation['owner']['id'],
        status=feed_factory._meta.model.STATUSES.enabled,
    )

    result = ext.create_uploads(schedule)
    assert result.status == 'fail'
    assert result.output == 'Connect client Error.'
    assert logger.method_calls[0].kwargs['msg'] == 'Connect client Error.'


def test_create_upload_schedule_task_fail_db_error(
    connect_client,
    logger,
    client_mocker_factory,
    installation,
    feed_factory,
    mocker,
):
    schedule = {'parameter': {'installation_id': installation['id']}}
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config={},
        context=Context(
            extension_id='EXT-01',
            environment_id='test',
        ),
    )
    ext.get_installation_admin_client = lambda self: connect_client

    client_mocker = client_mocker_factory(base_url=connect_client.endpoint)
    client_mocker('devops').installations[installation['id']].get(
        return_value=installation,
    )
    mocker.patch(
        'connect_bi_reporter.uploads.tasks.create_uploads',
        side_effect=DBAPIError(params='some', orig='test', statement='sds'),
    )

    feed_factory(
        account_id=installation['owner']['id'],
        status=feed_factory._meta.model.STATUSES.enabled,
    )

    result = ext.create_uploads(schedule)
    assert result.status == 'fail'
    assert result.output == 'DB Error.'
    assert logger.method_calls[0].kwargs['msg'] == 'DB Error.'