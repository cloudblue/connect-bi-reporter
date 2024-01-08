from connect_bi_reporter.feeds.api.schemas import FeedCreateSchema, FeedSchema


def test_feed_create_schema(report_schedule, credential_factory):
    credential = credential_factory()
    serializer = FeedCreateSchema(
        schedule={'id': report_schedule['id']},
        credential={'id': credential.id},
        file_name='the file name',
        description=None,
    )
    assert serializer.dict() == {
        'schedule': {'id': report_schedule['id']},
        'credential': {'id': credential.id},
        'file_name': 'the file name',
    }


def test_feed_get_and_list_schema(report_schedule, credential_factory, feed_factory):
    credential = credential_factory()
    feed = feed_factory()
    serializer = FeedSchema(
        id=feed.id,
        file_name=feed.file_name,
        credential={'id': credential.id},
        schedule={'id': report_schedule['id']},
        owner={'id': credential.account_id},
        events={
            'created': {'at': feed.created_at, 'by': {'id': feed.created_by}},
            'updated': {'at': feed.updated_at, 'by': {'id': feed.updated_by}},
        },
        status=feed.status,
    )

    assert serializer.dict() == {
        'id': feed.id,
        'file_name': feed.file_name,
        'credential': {'id': credential.id},
        'schedule': {'id': report_schedule['id']},
        'owner': {'id': credential.account_id},
        'events': {
            'created': {'at': feed.created_at, 'by': {'id': feed.created_by}},
            'updated': {'at': feed.updated_at, 'by': {'id': feed.updated_by}},
        },
        'status': feed.status,
    }
