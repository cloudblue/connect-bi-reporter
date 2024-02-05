from typing import Any, Dict

from connect_extension_utils.api.views import get_object_or_404

from connect_bi_reporter.feeds.models import Feed
from connect_bi_reporter.feeds.api.schemas import FeedCreateSchema


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
