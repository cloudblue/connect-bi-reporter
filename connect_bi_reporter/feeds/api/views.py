from logging import Logger
from typing import List

from connect.client import ConnectClient
from fastapi import Depends, Request, Response, status
from connect.eaas.core.decorators import router
from connect.eaas.core.inject.common import get_logger
from connect.eaas.core.inject.synchronous import get_installation, get_installation_client
from connect_extension_utils.api.pagination import apply_pagination, PaginationParams
from connect_extension_utils.api.views import get_user_data_from_auth_token
from connect_extension_utils.db.models import get_db, VerboseBaseSession

from connect_bi_reporter.feeds.api.schemas import (
    FeedCreateSchema,
    FeedSchema,
    FeedUpdateSchema,
    map_to_feed_schema,
)
from connect_bi_reporter.feeds.enums import FeedStatusChoices
from connect_bi_reporter.feeds.services import (
    change_feed_status,
    create_feed,
    delete_feed,
    get_feed_or_404,
    get_feeds,
    update_feed,
)
from connect_bi_reporter.feeds.validator import FeedValidator


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
        pagination_params: PaginationParams = Depends(),
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
        response: Response = None,
    ):
        paginated_response = apply_pagination(
            get_feeds(db, installation),
            db,
            pagination_params,
            response,
        )
        return [map_to_feed_schema(feed) for feed in paginated_response]

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

    @router.put(
        '/feeds/{feed_id}',
        summary='Update a Feed',
        response_model=FeedSchema,
        status_code=status.HTTP_200_OK,
    )
    def update_feed(
        self,
        feed_id: str,
        feed_schema: FeedUpdateSchema,
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
        logger: Logger = Depends(get_logger),
        request: Request = None,
    ):
        logged_user_data = get_user_data_from_auth_token(request.headers['connect-auth'])
        feed = update_feed(
            db, feed_schema, installation, feed_id, logged_user_data, logger,
        )
        return map_to_feed_schema(feed)

    @router.delete(
        '/feeds/{feed_id}',
        summary='Delete a Feed',
        status_code=status.HTTP_204_NO_CONTENT,
    )
    def delete_feed(
        self,
        feed_id: str,
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
    ):
        delete_feed(db, installation, feed_id)

    @router.post(
        '/feeds/{feed_id}/enable',
        summary='Enable a Feed',
        response_model=FeedSchema,
        status_code=status.HTTP_200_OK,
        name=FeedStatusChoices.enabled,
    )
    def enable_feed(
        self,
        feed_id: str,
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
        request: Request = None,
    ):
        return self.handle_feed_status_change(feed_id, db, installation, request)

    @router.post(
        '/feeds/{feed_id}/disable',
        summary='Enable a Feed',
        response_model=FeedSchema,
        status_code=status.HTTP_200_OK,
        name=FeedStatusChoices.disabled,
    )
    def disable_feed(
        self,
        feed_id: str,
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
        request: Request = None,
    ):
        return self.handle_feed_status_change(feed_id, db, installation, request)

    def handle_feed_status_change(self, feed_id, db, installation, request):
        logged_user_data = get_user_data_from_auth_token(request.headers['connect-auth'])
        status_for_change = request.scope['route'].name
        feed = change_feed_status(db, installation, feed_id, logged_user_data, status_for_change)
        return map_to_feed_schema(feed)
