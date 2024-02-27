import pytest
from connect_extension_utils.api.views import get_user_data_from_auth_token


def test_create_credential(installation, api_client, connect_auth_header):
    body = {'name': 'My credentials', 'connection_string': 'core.windows.net'}
    response = api_client.post(
        '/api/credentials',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )

    assert response.status_code == 201

    response_data = response.json()
    assert response_data['id'] is not None
    assert response_data['name'] == body['name']
    assert response_data['connection_string'] == body['connection_string']
    assert response_data['owner']['id'] == installation['owner']['id']
    events = response_data['events']
    assert events['created']['at'] is not None
    assert events['created']['by'] is not None
    assert events['updated']['at'] is not None
    assert events['updated']['by'] is not None


@pytest.mark.parametrize('remove_field', ('name', 'connection_string'))
def test_create_credential_mandatory_fields(
    remove_field, installation, api_client, connect_auth_header,
):
    body = {'name': 'My credentials', 'connection_string': 'core.windows.net'}
    del body[remove_field]

    response = api_client.post(
        '/api/credentials',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )

    assert response.status_code == 422
    assert (
        response.json() == {
            'detail': [
                {
                    'loc': ['body', remove_field],
                    'msg': 'field required', 'type': 'value_error.missing',
                },
            ],
        }
    )


def test_get_credentials(installation, api_client, connect_auth_header, credential_factory):
    credentials = []
    credential_factory(account_id='other-account')
    for _ in range(5):
        credentials.append(credential_factory(account_id=installation['owner']['id']))

    response = api_client.get(
        '/api/credentials',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200

    response_data = response.json()

    assert len(response_data) == len(credentials)

    for credential, response_cred in zip(credentials, response_data):

        assert response_cred['name'] == credential.name
        assert response_cred['owner']['id'] == installation['owner']['id']
        response_cred_events = response_cred['events']

        assert response_cred_events['created']['at'] is not None
        assert response_cred_events['created']['by']['id'] == credential.created_by
        assert response_cred_events['updated']['at'] is not None
        assert response_cred_events['updated']['by']['id'] == credential.updated_by


def test_get_credentials_empty_list(
    installation, api_client, connect_auth_header, credential_factory,
):
    for _ in range(5):
        credential_factory(account_id='other-account')

    response = api_client.get(
        '/api/credentials',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200
    assert response.json() == []


def test_get_credential(installation, api_client, connect_auth_header, credential_factory):
    credential = credential_factory(account_id=installation['owner']['id'])

    response = api_client.get(
        f'/api/credentials/{credential.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200

    response_data = response.json()
    assert response_data['id'] == credential.id
    assert response_data['name'] == credential.name
    assert response_data['connection_string'] == credential.connection_string
    assert response_data['owner']['id'] == installation['owner']['id']
    events = response_data['events']
    assert events['created']['at'] is not None
    assert events['created']['by'] is not None
    assert events['updated']['at'] is not None
    assert events['updated']['by'] is not None


def test_get_credential_404(installation, api_client, connect_auth_header, credential_factory):
    credential_factory(account_id='other-account')
    credential_factory(account_id=installation['owner']['id'])

    response = api_client.get(
        '/api/credentials/NOT-FOUND',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 404
    response_data = response.json()
    assert response_data['error_code'] == 'NFND_000'
    assert response_data['errors'][0] == 'Object `NOT-FOUND` not found.'


def test_update_credential(
    dbsession,
    installation,
    api_client,
    connect_auth_header,
    credential_factory,
):
    cred = credential_factory(account_id=installation['owner']['id'])
    updated_at = cred.updated_at
    body = {'name': 'My credentials', 'connection_string': 'core.windows.net'}
    response = api_client.put(
        f'/api/credentials/{cred.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )
    user = get_user_data_from_auth_token(connect_auth_header)
    assert response.status_code == 200

    response_data = response.json()
    assert response_data['id'] is not None
    assert response_data['name'] == body['name']
    assert response_data['connection_string'] == body['connection_string']
    assert response_data['owner']['id'] == installation['owner']['id']
    events = response_data['events']
    assert events['created']['at'] == cred.created_at.isoformat()
    assert events['created']['by'] == {'id': cred.created_by}
    dbsession.refresh(cred)
    assert events['updated']['at'] == cred.updated_at.isoformat()
    assert cred.updated_at > updated_at
    assert events['updated']['by'] == {'id': user['id']}


def test_update_credential_404(installation, api_client, connect_auth_header):
    body = {'name': 'My credentials', 'connection_string': 'core.windows.net'}
    response = api_client.put(
        '/api/credentials/NOT-FOUND',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )

    assert response.status_code == 404
    response_data = response.json()
    assert response_data['error_code'] == 'NFND_000'
    assert response_data['errors'][0] == 'Object `NOT-FOUND` not found.'


def test_update_credential_nothing_to_update(
    installation,
    api_client,
    connect_auth_header,
    credential_factory,
):
    cred = credential_factory(account_id=installation['owner']['id'])
    updated_at = cred.updated_at
    body = {}
    response = api_client.put(
        f'/api/credentials/{cred.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
        json=body,
    )

    assert response.status_code == 200

    response_data = response.json()
    assert response_data['id'] is not None
    assert response_data['name'] == cred.name
    assert response_data['connection_string'] == cred.connection_string
    assert response_data['owner']['id'] == installation['owner']['id']
    events = response_data['events']
    assert events['created']['at'] is not None
    assert events['created']['by'] is not None
    assert events['updated']['at'] == cred.updated_at.isoformat()
    assert cred.updated_at == updated_at
    assert events['updated']['by'] == {'id': cred.updated_by}


def test_delete_credential(
    dbsession,
    installation,
    api_client,
    connect_auth_header,
    credential_factory,
):
    cred = credential_factory(account_id=installation['owner']['id'])
    response = api_client.delete(
        f'/api/credentials/{cred.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )
    assert response.status_code == 204
    assert not dbsession.query(credential_factory._meta.model).all()


def test_delete_credential_404(
    installation,
    api_client,
    connect_auth_header,
):
    response = api_client.delete(
        '/api/credentials/NOT-FOUND',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 404
    response_data = response.json()
    assert response_data['error_code'] == 'NFND_000'
    assert response_data['errors'][0] == 'Object `NOT-FOUND` not found.'


def test_delete_credential_already_in_use(
    dbsession,
    installation,
    api_client,
    connect_auth_header,
    credential_factory,
    feed_factory,
):
    cred = credential_factory(account_id=installation['owner']['id'])
    feed_factory(credential_id=cred.id)
    response = api_client.delete(
        f'/api/credentials/{cred.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )
    assert response.status_code == 400
    response_data = response.json()
    assert response_data['error_code'] == 'CRED_000'
    assert response_data['errors'][0] == (
        f'Can not delete Credential `{cred.id}`, '
        f'is already related to Feeds `{", ".join(feed.id for feed in cred.feed.all())}`.'
    )
    assert dbsession.query(credential_factory._meta.model).count() == 1


@pytest.mark.parametrize(
    ('limit', 'offset', 'expected_length', 'expected_header'),
    (
        (10, 0, 10, 'items 0-9/20'),
        (10, 20, 0, 'items 20-20/20'),
        (9, 18, 2, 'items 18-19/20'),
    ),
)
def test_get_credentials_paginated(
    installation,
    api_client,
    connect_auth_header,
    credential_factory,
    limit,
    offset,
    expected_length,
    expected_header,

):
    credentials = []
    credential_factory(account_id='other-account')
    for _ in range(20):
        credentials.append(credential_factory(account_id=installation['owner']['id']))

    response = api_client.get(
        f'/api/credentials?offset={offset}&limit={limit}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200

    paginated_response_data = response.json()

    assert len(paginated_response_data) == expected_length
    assert response.headers['Content-Range'] == expected_header
