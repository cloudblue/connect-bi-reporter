from logging import Logger
from typing import List

from fastapi import Depends, Response, status
from connect.client import ConnectClient
from connect.eaas.core.decorators import router
from connect.eaas.core.inject.common import get_call_context, get_logger
from connect.eaas.core.inject.models import Context
from connect.eaas.core.inject.synchronous import (
    get_extension_client,
    get_installation,
    get_installation_client,
)
from connect_extension_utils.api.pagination import apply_pagination, PaginationParams
from connect_extension_utils.db.models import get_db, VerboseBaseSession

from connect_bi_reporter.scheduler import Scheduler
from connect_bi_reporter.uploads.api.schemas import map_to_upload_schema, UploadSchema
from connect_bi_reporter.uploads.services import (
    force_upload,
    get_feed_for_uploads,
    get_upload_or_404,
    get_uploads_or_404,
    retry_failed_upload,
)


class UploadsWebAppMixin:

    @router.get(
        '/feeds/{feed_id}/uploads/{upload_id}',
        summary='Returns the require Upload related to a Feed',
        response_model=UploadSchema,
        status_code=status.HTTP_200_OK,
    )
    def get_upload(
        self,
        feed_id: str,
        upload_id: str,
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
    ):
        return map_to_upload_schema(get_upload_or_404(db, installation, feed_id, upload_id))

    @router.get(
        '/feeds/{feed_id}/uploads',
        summary='Returns all Uploads related to a Feed',
        response_model=List[UploadSchema],
        status_code=status.HTTP_200_OK,
    )
    def get_uploads(
        self,
        feed_id: str,
        pagination_params: PaginationParams = Depends(),
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
        response: Response = None,
    ):
        paginated_response = apply_pagination(
            get_uploads_or_404(db, installation, feed_id),
            db,
            pagination_params,
            response,
        )
        return [map_to_upload_schema(upload) for upload in paginated_response]

    @router.post(
        '/feeds/{feed_id}/uploads/{upload_id}/retry',
        summary='Retry the require Upload which was previously failed',
        response_model=UploadSchema,
        status_code=status.HTTP_200_OK,
    )
    def get_retry_upload(
        self,
        feed_id: str,
        upload_id: str,
        db: VerboseBaseSession = Depends(get_db),
        extension_client: ConnectClient = Depends(get_extension_client),
        context: Context = Depends(get_call_context),
        logger: Logger = Depends(get_logger),
        installation: dict = Depends(get_installation),
    ):
        scheduler = Scheduler(extension_client, context, logger)
        upload = retry_failed_upload(db, installation, feed_id, upload_id, scheduler)
        return map_to_upload_schema(upload)

    def _force_upload(
        self,
        db,
        extension_client,
        installation_client,
        context,
        logger,
        installation,
        feed,
    ):
        scheduler = Scheduler(extension_client, context, logger)
        upload = force_upload(db, installation_client, scheduler, installation, feed)
        return map_to_upload_schema(upload)

    @router.post(
        '/feeds/{feed_id}/uploads/force',
        summary='Force creation of Upload from a Feed',
        response_model=UploadSchema,
        status_code=status.HTTP_201_CREATED,
    )
    def force_upload(
        self,
        feed_id: str,
        db: VerboseBaseSession = Depends(get_db),
        extension_client: ConnectClient = Depends(get_extension_client),
        installation_client: ConnectClient = Depends(get_installation_client),
        context: Context = Depends(get_call_context),
        logger: Logger = Depends(get_logger),
        installation: dict = Depends(get_installation),
    ):
        feed = get_feed_for_uploads(db, installation, feed_id)
        return self._force_upload(
            db,
            extension_client,
            installation_client,
            context,
            logger,
            installation,
            feed,
        )
