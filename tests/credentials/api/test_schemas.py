from connect_bi_reporter.credentials.api.schemas import (
    CredentialCreateSchema, CredentialGetSchema, CredentialListSchema,
)


def test_credentials_create_schema():
    serializer = CredentialCreateSchema(
        name='Creating credentials',
        sas_token="D=https;AccountName=AN;AccountKey=AK;EndpointSuffix=core.windows.net",
    )
    assert serializer.dict() == {
        'name': 'Creating credentials',
        'sas_token': "D=https;AccountName=AN;AccountKey=AK;EndpointSuffix=core.windows.net",
    }


def test_credentials_list_schema(credential_factory):
    credential = credential_factory()
    serializer = CredentialListSchema(
        id=credential.id,
        name=credential.name,
        owner={'id': credential.account_id},
        events={
            'created': {'at': credential.created_at, 'by': {'id': credential.created_by}},
            'updated': {'at': credential.updated_at},
        },
    )
    assert serializer.dict() == {
        'id': credential.id,
        'name': credential.name,
        'owner': {'id': credential.account_id},
        'events': {
            'created': {'at': credential.created_at, 'by': {'id': credential.created_by}},
            'updated': {'at': credential.updated_at},
        },
    }


def test_credentials_get_schema(credential_factory):
    credential = credential_factory()
    serializer = CredentialGetSchema(
        id=credential.id,
        name=credential.name,
        sas_token=credential.sas_token,
        owner={'id': credential.account_id},
        events={
            'created': {'at': credential.created_at, 'by': {'id': credential.created_by}},
            'updated': {'at': credential.updated_at, 'by': {'id': credential.updated_by}},
        },
    )

    assert serializer.dict() == {
        'id': credential.id,
        'name': credential.name,
        'sas_token': credential.sas_token,
        'owner': {'id': credential.account_id},
        'events': {
            'created': {'at': credential.created_at, 'by': {'id': credential.created_by}},
            'updated': {'at': credential.updated_at, 'by': {'id': credential.updated_by}},
        },
    }
