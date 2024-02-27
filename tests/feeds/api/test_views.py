from connect.client import ClientError
import pytest
from connect_extension_utils.api.views import get_user_data_from_auth_token


def test_create_feed(
    installation,
    report_schedule,
    credential_factory,
    feed_factory,
    api_client,
    connect_auth_header,
    mocker,
):
    mocker.patch(
        'connect_bi_reporter.feeds.validator.get_report_schedule',
        return_value=report_schedule,
    )
    credential = credential_factory(account_id=installation['owner']['id'])

    body = {
        'schedule': {'id': report_schedule['id']},
        'credential': {'id': credential.id},
        'file_name': 'The file name',
    }
    response = api_client.post(
        '/api/feeds',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )

    assert response.status_code == 201

    response_data = response.json()
    assert response_data['id'] is not None
    assert response_data['id'].startswith(feed_factory._meta.model.PREFIX)
    assert response_data['file_name'] == body['file_name']
    assert 'description' not in response_data
    assert response_data['owner']['id'] == installation['owner']['id']
    events = response_data['events']
    assert events['created']['at'] is not None
    assert events['created']['by'] is not None
    assert events['updated']['at'] is not None
    assert events['updated']['by'] is not None


@pytest.mark.parametrize(
    'response,reason',
    (
        ({'side_effect': ClientError(status_code=500)}, '500 Internal Server Error'),
        ({'return_value': {'renderer': 'test'}}, 'Renderer `test` not allowed.'),
    ),
)
def test_create_feed_fail_schedule_report_not_valid(
    installation,
    report_schedule,
    credential_factory,
    api_client,
    connect_auth_header,
    mocker,
    caplog,
    response,
    reason,
):
    mocker.patch(
        'connect_bi_reporter.feeds.validator.get_report_schedule',
        **response,
    )
    credential = credential_factory(account_id=installation['owner']['id'])

    body = {
        'schedule': {'id': report_schedule['id']},
        'credential': {'id': credential.id},
        'file_name': 'The file name',
    }
    response = api_client.post(
        '/api/feeds',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )
    assert response.status_code == 400

    response_data = response.json()
    assert response_data == {
        'error_code': 'RF_000',
        'errors': [
            f'Report schedule `{report_schedule["id"]}` not '
            f'valid for feed creation: {reason}'],
    }
    assert caplog.records[0].message == reason


def test_create_feed_fail_credential_not_found(
    installation,
    report_schedule,
    api_client,
    connect_auth_header,
    mocker,
    caplog,
):
    mocker.patch(
        'connect_bi_reporter.feeds.validator.get_report_schedule',
        return_value=report_schedule,
    )

    body = {
        'schedule': {'id': report_schedule['id']},
        'credential': {'id': 'CRED-001'},
        'file_name': 'The file name',
    }
    response = api_client.post(
        '/api/feeds',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )

    assert response.status_code == 400

    response_data = response.json()
    assert response_data == {
        'error_code': 'RF_001',
        'errors': ['Can not create Feed, the Credential `CRED-001` is not valid.'],
    }
    assert caplog.records[0].message == (
        'Can not create Feed, the Credential `CRED-001` is not valid.'
    )


def test_list_feeds(installation, feed_factory, api_client, connect_auth_header):
    feeds = []
    feed_factory(account_id='other-account')
    for _ in range(5):
        feeds.append(feed_factory(account_id=installation['owner']['id']))

    response = api_client.get(
        '/api/feeds',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200

    response_data = response.json()

    assert len(response_data) == len(feeds)

    for feed, response_feed in zip(feeds, response_data):
        assert response_feed['id'] == feed.id
        assert response_feed['file_name'] == feed.file_name
        assert response_feed['description'] == feed.description
        assert response_feed['status'] == feed.status
        assert response_feed['owner']['id'] == feed.account_id
        assert response_feed['schedule']['id'] == feed.schedule_id
        assert response_feed['credential']['id'] == feed.credential_id
        events = response_feed['events']
        assert events['created']['at'] is not None
        assert events['created']['by']['id'] == feed.created_by
        assert events['updated']['at'] is not None
        assert events['updated']['by']['id'] == feed.created_by


def test_list_feeds_empty(installation, api_client, connect_auth_header):
    response = api_client.get(
        '/api/feeds',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200
    assert response.json() == []


def test_get_feed(installation, feed_factory, api_client, connect_auth_header):
    feed_factory(account_id=installation['owner']['id'])
    feed = feed_factory(account_id=installation['owner']['id'])
    feed_factory(account_id='other-account')

    response = api_client.get(
        f'/api/feeds/{feed.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200

    response_feed = response.json()
    assert response_feed['id'] == feed.id
    assert response_feed['file_name'] == feed.file_name
    assert response_feed['description'] == feed.description
    assert response_feed['status'] == feed.status
    assert response_feed['owner']['id'] == feed.account_id
    assert response_feed['schedule']['id'] == feed.schedule_id
    assert response_feed['credential']['id'] == feed.credential_id
    events = response_feed['events']
    assert events['created']['at'] is not None
    assert events['created']['by']['id'] == feed.created_by
    assert events['updated']['at'] is not None
    assert events['updated']['by']['id'] == feed.created_by


def test_get_feed_404(installation, feed_factory, api_client, connect_auth_header):
    feed_factory(account_id=installation['owner']['id'])
    feed_factory(account_id=installation['owner']['id'])
    feed_factory(account_id='other-account')

    response = api_client.get(
        '/api/feeds/INVALID',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 404


def test_update_feed(
    installation,
    feed_factory,
    credential_factory,
    api_client,
    connect_auth_header,
):
    cred = credential_factory(account_id=installation['owner']['id'])
    feed = feed_factory(account_id=installation['owner']['id'], credential_id=cred.id)
    updated_at = feed.updated_at

    body = {
        'credential': {'id': feed.credential_id},
        'file_name': 'The file name',
    }
    response = api_client.put(
        f'/api/feeds/{feed.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )
    user = get_user_data_from_auth_token(connect_auth_header)

    assert response.status_code == 200

    response_data = response.json()
    assert response_data['id'] == feed.id
    assert response_data['id'].startswith(feed_factory._meta.model.PREFIX)
    assert response_data['file_name'] == body['file_name']
    assert response_data['description'] == feed.description
    assert response_data['owner']['id'] == installation['owner']['id']
    events = response_data['events']
    assert events['created']['at'] is not None
    assert events['created']['by'] is not None
    assert feed.updated_at > updated_at
    assert events['updated']['by']['id'] == user['id']


def test_update_feed_404(installation, api_client, connect_auth_header):
    body = {
        'credential': {'id': 'test'},
        'file_name': 'The file name',
    }
    response = api_client.put(
        '/api/feeds/NOT-FOUND',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )

    assert response.status_code == 404
    response_data = response.json()
    assert response_data['error_code'] == 'NFND_000'
    assert response_data['errors'][0] == 'Object `NOT-FOUND` not found.'


def test_update_feed_nothing_to_update(
    installation,
    api_client,
    connect_auth_header,
    credential_factory,
    feed_factory,
):
    cred = credential_factory(account_id=installation['owner']['id'])
    feed = feed_factory(account_id=installation['owner']['id'], credential_id=cred.id)
    updated_at = feed.updated_at
    body = {}
    response = api_client.put(
        f'/api/feeds/{feed.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )

    assert response.status_code == 200

    response_data = response.json()
    assert response_data['id'] is not None
    assert response_data['file_name'] == feed.file_name
    assert response_data['owner']['id'] == installation['owner']['id']
    events = response_data['events']
    assert events['created']['at'] is not None
    assert events['created']['by'] is not None
    assert events['updated']['at'] == feed.updated_at.isoformat()
    assert feed.updated_at == updated_at
    assert events['updated']['by'] == {'id': feed.updated_by}


def test_update_feed_invalid_credential(
    installation,
    api_client,
    connect_auth_header,
    credential_factory,
    feed_factory,
):
    cred = credential_factory()
    feed = feed_factory(account_id=installation['owner']['id'])
    body = {
        'credential': {'id': cred.id},
        'file_name': 'The file name',
    }
    response = api_client.put(
        f'/api/feeds/{feed.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )
    assert response.status_code == 400
    response_data = response.json()
    assert response_data['error_code'] == 'RF_001'
    assert response_data['errors'][0] == (
        f'Can not update Feed, the Credential `{cred.id}` is not valid.'
    )


def test_delete_feed(
    dbsession,
    installation,
    api_client,
    connect_auth_header,
    feed_factory,
):
    feed = feed_factory(account_id=installation['owner']['id'])
    response = api_client.delete(
        f'/api/feeds/{feed.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )
    assert response.status_code == 204
    assert not dbsession.query(feed_factory._meta.model).all()


def test_delete_feed_404(
    installation,
    api_client,
    connect_auth_header,
):
    response = api_client.delete(
        '/api/feeds/NOT-FOUND',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 404
    response_data = response.json()
    assert response_data['error_code'] == 'NFND_000'
    assert response_data['errors'][0] == 'Object `NOT-FOUND` not found.'


def test_delete_feed_already_in_use(
    dbsession,
    installation,
    api_client,
    connect_auth_header,
    feed_factory,
    upload_factory,
):
    feed = feed_factory(account_id=installation['owner']['id'])
    upload_factory(feed_id=feed.id)

    response = api_client.delete(
        f'/api/feeds/{feed.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )
    assert response.status_code == 400
    response_data = response.json()
    assert response_data['error_code'] == 'RF_002'
    assert response_data['errors'][0] == (
        f'Can not delete Feed `{feed.id}`, '
        f'is already related to Uploads `{", ".join(feed.id for feed in feed.upload.all())}`.'
    )
    assert dbsession.query(feed_factory._meta.model).count() == 1


def test_enable_feed(
    installation,
    feed_factory,
    api_client,
    connect_auth_header,
):
    feed = feed_factory(account_id=installation['owner']['id'], status='disabled')
    updated_at = feed.updated_at
    previous_status = feed.status

    response = api_client.post(
        f'/api/feeds/{feed.id}/enable',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )
    user = get_user_data_from_auth_token(connect_auth_header)

    assert response.status_code == 200

    response_data = response.json()
    assert response_data['id'] == feed.id
    assert response_data['id'].startswith(feed_factory._meta.model.PREFIX)
    assert response_data['file_name'] == feed.file_name
    assert response_data['description'] == feed.description
    assert response_data['owner']['id'] == installation['owner']['id']
    events = response_data['events']
    assert events['created']['at'] is not None
    assert events['created']['by'] is not None
    assert feed.updated_at > updated_at
    assert events['updated']['by']['id'] == user['id']
    assert response_data['status'] == 'enabled'
    assert feed.status != previous_status and feed.status == 'enabled'


def test_enable_feed_404(installation, api_client, connect_auth_header):
    response = api_client.post(
        '/api/feeds/NOT-FOUND/enable',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 404
    response_data = response.json()
    assert response_data['error_code'] == 'NFND_000'
    assert response_data['errors'][0] == 'Object `NOT-FOUND` not found.'


def test_already_enabled_feed(
    installation,
    feed_factory,
    api_client,
    connect_auth_header,
):
    feed = feed_factory(account_id=installation['owner']['id'])
    response = api_client.post(
        f'/api/feeds/{feed.id}/enable',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 400
    response_data = response.json()
    assert response_data['error_code'] == 'RF_003'
    assert response_data['errors'][0] == (
        f'Feed `{feed.id}` is already in status `{feed.status}`.'
    )


def test_disable_feed(
    installation,
    feed_factory,
    api_client,
    connect_auth_header,
):
    feed = feed_factory(account_id=installation['owner']['id'])
    updated_at = feed.updated_at
    previous_status = feed.status

    response = api_client.post(
        f'/api/feeds/{feed.id}/disable',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )
    user = get_user_data_from_auth_token(connect_auth_header)

    assert response.status_code == 200

    response_data = response.json()
    assert response_data['id'] == feed.id
    assert response_data['id'].startswith(feed_factory._meta.model.PREFIX)
    assert response_data['file_name'] == feed.file_name
    assert response_data['description'] == feed.description
    assert response_data['owner']['id'] == installation['owner']['id']
    events = response_data['events']
    assert events['created']['at'] is not None
    assert events['created']['by'] is not None
    assert feed.updated_at > updated_at
    assert events['updated']['by']['id'] == user['id']
    assert response_data['status'] == 'disabled'
    assert feed.status != previous_status and feed.status == 'disabled'


def test_disable_feed_404(installation, api_client, connect_auth_header):
    response = api_client.post(
        '/api/feeds/NOT-FOUND/disable',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 404
    response_data = response.json()
    assert response_data['error_code'] == 'NFND_000'
    assert response_data['errors'][0] == 'Object `NOT-FOUND` not found.'


def test_already_disabled_feed(
    installation,
    feed_factory,
    api_client,
    connect_auth_header,
):
    feed = feed_factory(account_id=installation['owner']['id'], status='disabled')
    response = api_client.post(
        f'/api/feeds/{feed.id}/disable',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 400
    response_data = response.json()
    assert response_data['error_code'] == 'RF_003'
    assert response_data['errors'][0] == (
        f'Feed `{feed.id}` is already in status `{feed.status}`.'
    )


@pytest.mark.parametrize(
    ('limit', 'offset', 'expected_length', 'expected_header'),
    (
        (10, 0, 10, 'items 0-9/20'),
        (10, 20, 0, 'items 20-20/20'),
        (9, 18, 2, 'items 18-19/20'),
    ),
)
def test_list_feeds_paginated(
    installation,
    api_client,
    connect_auth_header,
    feed_factory,
    limit,
    offset,
    expected_length,
    expected_header,

):
    for _ in range(20):
        feed_factory(account_id=installation['owner']['id'])

    response = api_client.get(
        f'/api/feeds?offset={offset}&limit={limit}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200

    paginated_response_data = response.json()

    assert len(paginated_response_data) == expected_length
    assert response.headers['Content-Range'] == expected_header
