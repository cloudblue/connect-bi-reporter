from connect.client import ClientError


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


def test_create_feed_fail_schedule_report_not_valid(
    installation,
    report_schedule,
    credential_factory,
    api_client,
    connect_auth_header,
    mocker,
    caplog,
):
    mocker.patch(
        'connect_bi_reporter.feeds.validator.get_report_schedule',
        side_effect=ClientError(status_code=500),
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
        'errors': [f'Report schedule `{report_schedule["id"]}` not valid for feed creation.'],
    }
    assert caplog.records[0].message == '500 Internal Server Error'


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
        side_effect={'id': 'some'},
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
