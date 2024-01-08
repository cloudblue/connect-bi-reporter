from connect_bi_reporter.credentials.api.schemas import CredentialCreateSchema
from connect_bi_reporter.credentials.models import Credential


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
