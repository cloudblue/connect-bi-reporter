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
