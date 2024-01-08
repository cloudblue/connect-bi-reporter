from typing import Any, Dict

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
