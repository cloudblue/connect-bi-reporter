from datetime import datetime


def test_create_feed(dbsession, feed_factory, credential_factory, report_schedule):
    feed_model = feed_factory._meta.model
    credential = credential_factory()
    assert not dbsession.query(feed_model).all()
    feed = feed_model(
        file_name='My file name',
        description='The feed long description',
        account_id='PA-000-000',
        schedule_id=report_schedule['id'],
        credential_id=credential.id,
    )
    dbsession.add_with_verbose(feed)
    dbsession.commit()
    dbsession.refresh(feed)
    assert feed.id.startswith(feed_model.PREFIX)
    assert feed.credential == credential
    assert feed.schedule_id == report_schedule['id']
    assert feed.status == feed_model.STATUSES.enabled
    assert isinstance(credential.created_at, datetime)


def test_update_feed(dbsession, feed_factory):
    feed_model = feed_factory._meta.model
    feed = feed_factory()
    assert feed.file_name.startswith('File name')
    assert feed.status == feed_model.STATUSES.enabled
    previous_update = feed.updated_at
    feed.status = feed_model.STATUSES.disabled
    dbsession.add(feed)
    dbsession.commit()
    assert feed.status == feed_model.STATUSES.disabled
    assert feed.updated_at != previous_update


def test_delete_feed(dbsession, feed_factory):
    feed = feed_factory()
    assert dbsession.query(feed_factory._meta.model).count() == 1
    dbsession.delete(feed)
    assert not dbsession.query(feed_factory._meta.model).all()
