from connect_bi_reporter.schemas import Events, NonNullSchema, ReferenceSchema


class CredentialCreateSchema(NonNullSchema):
    name: str
    connection_string: str


class CredentialListSchema(ReferenceSchema):
    owner: ReferenceSchema
    events: Events


class CredentialGetSchema(CredentialListSchema):
    connection_string: str
