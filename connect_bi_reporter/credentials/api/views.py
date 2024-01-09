from typing import List

from fastapi import Depends, Request, status
from connect.eaas.core.decorators import router
from connect.eaas.core.inject.synchronous import get_installation

from connect_bi_reporter.db import get_db, VerboseBaseSession
from connect_bi_reporter.credentials.api.schemas import (
    CredentialCreateSchema,
    CredentialGetSchema,
    CredentialListSchema,
    map_to_credential_get_schema,
    map_to_credential_list_schema,
)
from connect_bi_reporter.credentials import services
from connect_bi_reporter.utils import get_user_data_from_auth_token


class CredentialsWebAppMixin:
    @router.get(
        '/credentials/{credential_id}',
        summary='Returns the require credential',
        response_model=CredentialGetSchema,
        status_code=status.HTTP_200_OK,
    )
    def get_credential(
        self,
        credential_id: str,
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
    ):
        return map_to_credential_get_schema(
            services.get_credential_or_404(db, installation, credential_id),
        )

    @router.get(
        '/credentials',
        summary='Returns all users credentials',
        response_model=List[CredentialListSchema],
        status_code=status.HTTP_200_OK,
    )
    def get_credentials(
        self,
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
    ):
        return [
            map_to_credential_list_schema(cred)
            for cred in services.get_credentials(db, installation)
        ]

    @router.post(
        '/credentials',
        summary='Creates a new credentials for external storage',
        response_model=CredentialGetSchema,
        status_code=status.HTTP_201_CREATED,
    )
    def create_credential(
        self,
        credential_schema: CredentialCreateSchema,
        db: VerboseBaseSession = Depends(get_db),
        installation: dict = Depends(get_installation),
        request: Request = None,
    ):
        logged_user_data = get_user_data_from_auth_token(request.headers['connect-auth'])
        account_id = installation['owner']['id']
        credential = services.create_credentials(
            db, credential_schema, account_id, logged_user_data,
        )
        return map_to_credential_get_schema(credential)
