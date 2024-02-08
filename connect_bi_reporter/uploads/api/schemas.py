from typing import Optional

from connect_extension_utils.api.schemas import Events, NonNullSchema, ReferenceSchema


class UploadSchema(NonNullSchema):
    id: str
    name: Optional[str]
    feed: ReferenceSchema
    report: ReferenceSchema
    size: Optional[int]
    status: str
    events: Events
