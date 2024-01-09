from typing import Any, Dict

from connect_bi_reporter.credentials.api.schemas import CredentialCreateSchema
from connect_bi_reporter.credentials.models import Credential
from connect_bi_reporter.utils import get_object_or_404


def get_credentials(db, installation: Dict[str, Any]):
    return db.query(Credential).filter_by(account_id=installation['owner']['id']).all()


def create_credentials(db, data: CredentialCreateSchema, account_id: str, user: str):

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
