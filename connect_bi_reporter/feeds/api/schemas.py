from typing import Optional

from connect_bi_reporter.schemas import Events, NonNullSchema, ReferenceSchema


class FeedCreateSchema(NonNullSchema):
    schedule: ReferenceSchema
    credential: ReferenceSchema
    file_name: str
    description: Optional[str]


class FeedSchema(FeedCreateSchema):
    id: str
    owner: ReferenceSchema
    status: str
    events: Events
