import pytest


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
