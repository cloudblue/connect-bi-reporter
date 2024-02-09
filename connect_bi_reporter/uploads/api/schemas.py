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


def map_to_upload_schema(upload):
    return UploadSchema(
        id=upload.id,
        name=upload.name,
        feed={'id': upload.feed_id},
        report={'id': upload.report_id},
        size=upload.size,
        status=upload.status,
        events={
            'created': {
                'at': upload.created_at,
            },
            'updated': {
                'at': upload.updated_at,
            },
        },
    )
