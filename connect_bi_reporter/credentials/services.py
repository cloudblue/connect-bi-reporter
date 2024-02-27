from typing import Any, Dict

from connect_extension_utils.api.views import get_object_or_404

from connect_bi_reporter.credentials.api.schemas import (
    CredentialCreateSchema,
    CredentialUpdateSchema,
)
from connect_bi_reporter.credentials.errors import CredentialError
from connect_bi_reporter.credentials.models import Credential


def get_credentials(db, installation: Dict[str, Any]):
    return db.query(Credential).filter_by(account_id=installation['owner']['id'])


def create_credentials(db, data: CredentialCreateSchema, account_id: str, user: Dict[str, str]):

    credential = Credential(
        account_id=account_id,
        created_by=user['id'],
        updated_by=user['id'],
        **data.dict(),
    )
    db.add_with_verbose(credential)
    db.commit()
    db.refresh(credential)
    return credential


def get_credential_or_404(db, installation: Dict[str, Any], credential_id: str):
    filters = (
        Credential.account_id == installation['owner']['id'],
        Credential.id == credential_id,
    )
    return get_object_or_404(db, Credential, filters, credential_id)


def update_credential(
    db,
    data: CredentialUpdateSchema,
    installation: Dict[str, Any],
    credential_id: str,
    user: Dict[str, str],
):
    credential = get_credential_or_404(db, installation, credential_id)
    update_dict = data.dict()
    if update_dict:
        for k, v in update_dict.items():
            setattr(credential, k, v)
        credential.updated_by = user['id']
        db.commit()
        db.refresh(credential)
    return credential


def delete_credential(
    db,
    installation: Dict[str, Any],
    credential_id: str,
):
    credential = get_credential_or_404(db, installation, credential_id)
    related_feeds = credential.feed.all()
    if related_feeds:
        raise CredentialError.CRED_000(
            format_kwargs={
                'credential_id': credential.id,
                'feeds': ', '.join(feed.id for feed in related_feeds),
            },
        )
    db.delete(credential)
    db.commit()
