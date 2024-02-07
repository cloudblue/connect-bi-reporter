from typing import Optional

from connect_extension_utils.api.schemas import Events, NonNullSchema, ReferenceSchema

from connect_bi_reporter.schemas import flatten


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


def map_to_feed_schema(feed):
    return FeedSchema(
        id=feed.id,
        file_name=feed.file_name,
        description=feed.description,
        schedule={'id': feed.schedule_id},
        credential={'id': feed.credential_id},
        owner={'id': feed.account_id},
        status=feed.status,
        events={
            'created': {'at': feed.created_at, 'by': {'id': feed.created_by}},
            'updated': {'at': feed.updated_at, 'by': {'id': feed.updated_by}},
        },
    )


class FeedUpdateSchema(NonNullSchema):
    credential: Optional[ReferenceSchema]
    file_name: Optional[str]
    description: Optional[str]

    def dict(self, *args, **kwargs):
        result = super().dict(*args, **kwargs)
        return flatten(result)
