import pytest

import re

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
