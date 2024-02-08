from typing import List

from fastapi import Depends, status
from connect.eaas.core.decorators import router
from connect.eaas.core.inject.synchronous import get_installation
from connect_extension_utils.db.models import get_db, VerboseBaseSession

from connect_bi_reporter.uploads.api.schemas import map_to_upload_schema, UploadSchema
from connect_bi_reporter.uploads.services import get_upload_or_404, get_uploads_or_404


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
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
    ):
        return [
            map_to_upload_schema(upload)
            for upload in get_uploads_or_404(db, installation, feed_id)
        ]
