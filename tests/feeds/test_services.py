import pytest
from connect.client import ClientError
from connect_extension_utils.api.views import get_user_data_from_auth_token
from sqlalchemy.exc import StatementError

from connect_bi_reporter.feeds.services import (
    change_feed_status,
    create_feed,
    delete_feed,
    get_feed_or_404,
    get_feeds,
    update_feed,
)
from connect_bi_reporter.feeds.api.schemas import FeedCreateSchema, FeedUpdateSchema


def test_create_feed(dbsession, installation, credential_factory, feed_factory):
    account_id = installation['owner']['id']
    cred = credential_factory(account_id=account_id)
    data = FeedCreateSchema(
        schedule={'id': 'RS-123'},
        credential={'id': cred.id},
        file_name='My file',
    )
    assert not dbsession.query(feed_factory._meta.model).all()
    feed = create_feed(dbsession, data, account_id, {'id': 'SU-123'})
    assert dbsession.query(feed_factory._meta.model).count() == 1
    assert feed.file_name == data.file_name
    assert feed.schedule_id == data.schedule.id
    assert feed.credential_id == data.credential.id


def test_get_feed_or_404_error(dbsession, installation):
    with pytest.raises(ClientError) as ex:
        get_feed_or_404(dbsession, installation, 'NOT_FOUND')
    assert ex.value.message == 'Object `NOT_FOUND` not found.'


def test_get_feed_or_404_ok(dbsession, installation, feed_factory):
    feed = feed_factory(account_id=installation['owner']['id'])
    get_feed = get_feed_or_404(dbsession, installation, feed.id)
    assert feed == get_feed


@pytest.mark.parametrize(
    'account_id,expected_count',
    (
        ('PA-000-000', 3),
        ('OTHER', 0),
    ),
)
def test_get_feeds(dbsession, installation, feed_factory, account_id, expected_count):
    feed_factory(account_id=account_id)
    feed_factory(account_id=account_id)
    feed_factory(account_id=account_id)

    assert len(get_feeds(dbsession, installation)) == expected_count


def test_update_feed_ok(
    dbsession,
    installation,
    logger,
    credential_factory,
    connect_auth_header,
    feed_factory,
):
    feed = feed_factory(account_id=installation['owner']['id'], file_name='test')
    new_cred = credential_factory(account_id=installation['owner']['id'])
    previous_updated_at = feed.updated_at
    data = FeedUpdateSchema(
        credential={'id': new_cred.id},
        file_name='New file name',
    )
    user = get_user_data_from_auth_token(connect_auth_header)

    assert feed.file_name == 'test'
    assert feed.credential_id != new_cred.id

    updated_feed = update_feed(dbsession, data, installation, feed.id, user, logger)
    assert updated_feed.updated_by == user['id']
    assert updated_feed.file_name == data.file_name
    assert updated_feed.credential_id == new_cred.id
    assert updated_feed.updated_at > previous_updated_at


def test_update_feed_fail(
    dbsession,
    installation,
    logger,
    credential_factory,
    connect_auth_header,
    feed_factory,
):
    feed = feed_factory(account_id=installation['owner']['id'], file_name='test')
    new_cred = credential_factory()
    data = FeedUpdateSchema(
        credential={'id': new_cred.id},
        file_name='New file name',
    )
    user = get_user_data_from_auth_token(connect_auth_header)

    with pytest.raises(ClientError) as ex:
        update_feed(dbsession, data, installation, feed.id, user, logger)
    assert ex.value.message == (
        f'Can not update Feed, the Credential `{new_cred.id}` is not valid.'
    )


def test_update_nothing_to_update(
    dbsession,
    installation,
    logger,
    credential_factory,
    connect_auth_header,
    feed_factory,
):
    feed = feed_factory(account_id=installation['owner']['id'], file_name='test')
    new_cred = credential_factory(account_id=installation['owner']['id'])
    previous_updated_at = feed.updated_at
    data = FeedUpdateSchema()
    user = get_user_data_from_auth_token(connect_auth_header)

    assert feed.file_name == 'test'
    assert feed.credential_id != new_cred.id
    assert feed.updated_by != user['id']

    updated_feed = update_feed(dbsession, data, installation, feed.id, user, logger)
    assert updated_feed.updated_by == feed.updated_by
    assert updated_feed.file_name == feed.file_name
    assert updated_feed.credential_id == feed.credential_id
    assert updated_feed.updated_at == previous_updated_at


def test_delete_feed(
    dbsession,
    installation,
    feed_factory,
):
    feed = feed_factory(account_id=installation['owner']['id'])

    assert dbsession.query(feed_factory._meta.model).all()

    delete_feed(dbsession, installation, feed.id)
    assert not dbsession.query(feed_factory._meta.model).all()


def test_delete_feed_in_use_fail(
    dbsession,
    installation,
    feed_factory,
    upload_factory,
):
    feed = feed_factory(account_id=installation['owner']['id'])
    upload = upload_factory(feed_id=feed.id)

    existing_feeds = dbsession.query(feed_factory._meta.model).all()
    assert existing_feeds

    with pytest.raises(ClientError) as ex:
        delete_feed(dbsession, installation, feed.id)
    assert ex.value.message == (
        f'Can not delete Feed `{feed.id}`, '
        f'is already related to Uploads `{upload.id}`.'
    )
    assert existing_feeds


@pytest.mark.parametrize(
    'current_status,target_status',
    (
        ('enabled', 'disabled'),
        ('disabled', 'enabled'),
    ),
)
def test_change_feed_status_ok(
    dbsession,
    installation,
    feed_factory,
    connect_auth_header,
    current_status,
    target_status,
):
    feed = feed_factory(account_id=installation['owner']['id'], status=current_status)
    user = get_user_data_from_auth_token(connect_auth_header)
    assert feed.status == current_status

    change_feed_status(dbsession, installation, feed.id, user, target_status)
    assert feed.status == target_status


@pytest.mark.parametrize(
    'current_status,target_status',
    (
        ('disabled', 'disabled'),
        ('enabled', 'enabled'),
    ),
)
def test_change_feed_status_fail(
    dbsession,
    installation,
    feed_factory,
    connect_auth_header,
    current_status,
    target_status,
):
    feed = feed_factory(account_id=installation['owner']['id'], status=current_status)
    user = get_user_data_from_auth_token(connect_auth_header)
    assert feed.status == current_status

    with pytest.raises(ClientError) as ex:
        change_feed_status(dbsession, installation, feed.id, user, target_status)

    assert ex.value.message == f'Feed `{feed.id}` is already in status `{current_status}`.'
    assert feed.status == current_status


@pytest.mark.parametrize(
    'target_status',
    (
        'some',
        'test',
    ),
)
def test_change_feed_status_not_valid_fail(
    dbsession,
    installation,
    feed_factory,
    connect_auth_header,
    target_status,
):
    feed = feed_factory(account_id=installation['owner']['id'])
    user = get_user_data_from_auth_token(connect_auth_header)

    with pytest.raises(StatementError) as ex:
        change_feed_status(dbsession, installation, feed.id, user, target_status)

    assert ex.value.args[0] == (
        f"(builtins.LookupError) '{target_status}' is not among the defined enum values"
        f". Enum name: feedstatuschoices. Possible values: enabled, disabled"
    )
