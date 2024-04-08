from typing import Optional

from connect_extension_utils.api.schemas import Events, NonNullSchema, ReferenceSchema


class CredentialCreateSchema(NonNullSchema):
    name: str
    sas_token: str


class CredentialListSchema(ReferenceSchema):
    owner: ReferenceSchema
    events: Events


class CredentialUpdateSchema(NonNullSchema):
    name: Optional[str]
    sas_token: Optional[str]


class CredentialGetSchema(CredentialListSchema):
    sas_token: str


def map_to_credential_get_schema(credential):
    return CredentialGetSchema(
        id=credential.id,
        name=credential.name,
        sas_token=credential.sas_token,
        owner={'id': credential.account_id},
        events={
            'created': {'at': credential.created_at, 'by': {'id': credential.created_by}},
            'updated': {'at': credential.updated_at, 'by': {'id': credential.updated_by}},
        },
    )


def map_to_credential_list_schema(credential):
    return CredentialListSchema(
        id=credential.id,
        name=credential.name,
        owner={'id': credential.account_id},
        events={
            'created': {'at': credential.created_at, 'by': {'id': credential.created_by}},
            'updated': {'at': credential.updated_at, 'by': {'id': credential.updated_by}},
        },
    )
