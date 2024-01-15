from logging import Logger
from typing import List

from connect.client import ConnectClient
from fastapi import Depends, Request, status
from connect.eaas.core.decorators import router
from connect.eaas.core.inject.common import get_logger
from connect.eaas.core.inject.synchronous import get_installation, get_installation_client

from connect_bi_reporter.db import get_db, VerboseBaseSession
from connect_bi_reporter.feeds.api.schemas import FeedCreateSchema, FeedSchema, map_to_feed_schema
from connect_bi_reporter.feeds.services import create_feed, get_feed_or_404, get_feeds
from connect_bi_reporter.feeds.validator import FeedValidator
from connect_bi_reporter.utils import get_user_data_from_auth_token


class FeedsWebAppMixin:

    @router.get(
        '/feeds/{feed_id}',
        summary='Returns the require feed',
        response_model=FeedSchema,
        status_code=status.HTTP_200_OK,
    )
    def get_feed(
        self,
        feed_id: str,
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
    ):
        return map_to_feed_schema(get_feed_or_404(db, installation, feed_id))

    @router.get(
        '/feeds',
        summary='Returns all feeds',
        response_model=List[FeedSchema],
        status_code=status.HTTP_200_OK,
    )
    def get_feeds(
        self,
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
    ):
        return [map_to_feed_schema(feed) for feed in get_feeds(db, installation)]

    @router.post(
        '/feeds',
        summary='Creates a new Feed',
        response_model=FeedSchema,
        status_code=status.HTTP_201_CREATED,
    )
    def create_feed(
        self,
        feed_schema: FeedCreateSchema,
        db: VerboseBaseSession = Depends(get_db),
        client: ConnectClient = Depends(get_installation_client),
        installation: dict = Depends(get_installation),
        logger: Logger = Depends(get_logger),
        request: Request = None,
    ):
        FeedValidator.validate(db, client, installation, feed_schema, logger)
        logged_user_data = get_user_data_from_auth_token(request.headers['connect-auth'])
        account_id = installation['owner']['id']
        feed = create_feed(db, feed_schema, account_id, logged_user_data)
        return map_to_feed_schema(feed)
