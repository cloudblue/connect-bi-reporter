from connect_bi_reporter.uploads.api.schemas import UploadSchema


def test_upload_get_and_list_schema_full(upload_factory):
    upload = upload_factory(size=600, name='My upload')
    serializer = UploadSchema(
        id=upload.id,
        name=upload.name,
        feed={'id': upload.feed_id},
        report={'id': 'RR-123'},
        size=upload.size,
        events={
            'created': {'at': upload.created_at},
            'updated': {'at': upload.updated_at},
        },
        status=upload.status,
    )

    assert serializer.dict() == {
        'id': upload.id,
        'name': upload.name,
        'feed': {'id': upload.feed_id},
        'report': {'id': 'RR-123'},
        'size': upload.size,
        'events': {
            'created': {'at': upload.created_at},
            'updated': {'at': upload.updated_at},
        },
        'status': upload.status,
    }


def test_upload_get_and_list_schema_wo_optional_fields(upload_factory):
    upload = upload_factory()
    serializer = UploadSchema(
        id=upload.id,
        name=upload.name,
        feed={'id': upload.feed_id},
        report={'id': 'RR-123'},
        size=upload.size,
        events={
            'created': {'at': upload.created_at},
            'updated': {'at': upload.updated_at},
        },
        status=upload.status,
    )

    assert serializer.dict() == {
        'id': upload.id,
        'feed': {'id': upload.feed_id},
        'report': {'id': 'RR-123'},
        'events': {
            'created': {'at': upload.created_at},
            'updated': {'at': upload.updated_at},
        },
        'status': upload.status,
    }
