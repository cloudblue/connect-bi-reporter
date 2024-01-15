from connect.client import ClientError
import pytest


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
        'errors': ['Credential `CRED-001` not valid for feed creation.'],
    }
    assert caplog.records[0].message == 'Credential `CRED-001` not valid for feed creation.'


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
