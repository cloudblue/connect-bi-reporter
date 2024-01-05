from connect_bi_reporter.schemas import Events, NonNullSchema, ReferenceSchema


class CredentialCreateSchema(NonNullSchema):
    name: str
    connection_string: str


class CredentialListSchema(ReferenceSchema):
    owner: ReferenceSchema
    events: Events


class CredentialGetSchema(CredentialListSchema):
    connection_string: str


def map_to_credential_get_schema(credential):
    return CredentialGetSchema(
        id=credential.id,
        name=credential.name,
        connection_string=credential.connection_string,
        owner={'id': credential.account_id},
        events={
            'created': {'at': credential.created_at, 'by': {'id': credential.created_by}},
            'updated': {'at': credential.updated_at, 'by': {'id': credential.updated_by}},
        },
    )
