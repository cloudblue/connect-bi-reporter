from logging import Logger
from typing import Any, Dict

from connect_extension_utils.api.views import get_object_or_404

from connect_bi_reporter.feeds.api.schemas import FeedCreateSchema, FeedUpdateSchema
from connect_bi_reporter.feeds.errors import FeedError
from connect_bi_reporter.feeds.models import Feed
from connect_bi_reporter.feeds.validator import FeedValidator


def create_feed(db, data: FeedCreateSchema, account_id: str, user: Dict[str, Any]):
    data = data.dict()
    schedule_id = data.pop('schedule')['id']
    credential_id = data.pop('credential')['id']
    feed = Feed(
        account_id=account_id,
        credential_id=credential_id,
        schedule_id=schedule_id,
        created_by=user['id'],
        updated_by=user['id'],
        **data,
    )
    db.add_with_verbose(feed)
    db.commit()
    db.refresh(feed)
    return feed


def get_feed_or_404(db, installation: Dict[str, Any], feed_id: str):
    filters = (
        Feed.account_id == installation['owner']['id'],
        Feed.id == feed_id,
    )
    return get_object_or_404(db, Feed, filters, feed_id)


def get_feeds(db, installation: Dict[str, Any]):
    return db.query(Feed).filter_by(account_id=installation['owner']['id']).all()


def update_feed(
    db,
    data: FeedUpdateSchema,
    installation: Dict[str, Any],
    feed_id: str,
    user: Dict[str, str],
    logger: Logger,
):
    feed = get_feed_or_404(db, installation, feed_id)
    update_dict = data.dict()
    if update_dict:
        if data.credential:
            FeedValidator.validate_credential(db, None, installation, data, logger, action='update')
        for k, v in update_dict.items():
            setattr(feed, k, v)
        feed.updated_by = user['id']
        db.commit()
        db.refresh(feed)
    return feed


def delete_feed(
    db,
    installation: Dict[str, Any],
    feed_id: str,
):
    feed = get_feed_or_404(db, installation, feed_id)
    related_uploads = feed.upload.all()
    if related_uploads:
        raise FeedError.RF_002(
            format_kwargs={
                'feed_id': feed.id,
                'uploads': ', '.join(upload.id for upload in related_uploads),
            },
        )
    db.delete(feed)
    db.commit()


def change_feed_status(
    db,
    installation: Dict[str, Any],
    feed_id: str,
    user: Dict[str, str],
    status: str,
):
    feed = get_feed_or_404(db, installation, feed_id)
    if feed.status == status:
        raise FeedError.RF_003(
            format_kwargs={
                'feed_id': feed.id,
                'status': feed.status,
            },
        )
    feed.status = status
    feed.updated_by = user['id']
    db.commit()
    return feed
