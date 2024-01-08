from datetime import datetime


def test_create_upload(dbsession, feed_factory, upload_factory):
    upload_model = upload_factory._meta.model
    feed = feed_factory()
    report_id = 'RP-995-509-534'
    assert not dbsession.query(upload_model).all()
    uploads = []
    for _ in range(3):
        uploads.append(
            upload_model(
                name='My upload name',
                feed_id=feed.id,
                report_id=report_id,
                size=1024,
            ))
    dbsession.add_all_with_next_verbose(uploads, 'feed_id')
    dbsession.commit()
    for suffix, upload in enumerate(uploads):
        assert upload.id.startswith(upload_model.PREFIX)
        assert upload.id.endswith(f'00{suffix}')
        assert upload.feed == feed
        assert upload.report_id == report_id
        assert upload.status == upload_model.STATUSES.pending
        assert isinstance(upload.created_at, datetime)


def test_update_upload(dbsession, upload_factory):
    upload_model = upload_factory._meta.model
    uploads = []
    for _ in range(3):
        uploads.append(upload_factory())
    for suffix, upload in enumerate(uploads):
        assert not upload.name
        assert not upload.size
        base, id_suffix = upload.id.rsplit('-', 1)
        _, body = base.split('-', 1)
        assert upload.feed_id == f'{upload.feed.PREFIX}-{body}'
        assert id_suffix == f'00{suffix}'
        assert upload.status == upload_model.STATUSES.pending
        previous_update = upload.updated_at
        upload.status = upload_model.STATUSES.processing
        dbsession.add(upload)
        dbsession.commit()
        assert upload.status == upload_model.STATUSES.processing
        assert upload.updated_at != previous_update


def test_delete_upload(dbsession, upload_factory):
    upload = upload_factory()
    assert dbsession.query(upload_factory._meta.model).count() == 1
    assert upload.id.endswith('000')
    dbsession.delete(upload)
    assert not dbsession.query(upload_factory._meta.model).all()
