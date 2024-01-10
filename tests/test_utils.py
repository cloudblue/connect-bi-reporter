import pytest
from connect.client import ClientError

from connect_bi_reporter.utils import get_object_or_404


def test_get_object_or_404(dbsession, credential_factory):
    account_id = 'PA-000'
    _id = 'CRED-000'
    credential_factory(id=_id, account_id=account_id)
    credential_model = credential_factory._meta.model
    filters = (
        credential_model.account_id == account_id,
        credential_model.id == _id,
    )
    cred = get_object_or_404(dbsession, credential_factory._meta.model, filters, _id)
    assert cred.id == _id


def test_get_object_or_404_fail(dbsession, credential_factory):
    account_id = 'PA-000'
    _id = 'CRED-000'
    credential_model = credential_factory._meta.model
    filters = (
        credential_model.account_id == account_id,
        credential_model.id == _id,
    )
    with pytest.raises(ClientError) as ex:
        get_object_or_404(dbsession, credential_factory._meta.model, filters, _id)
    assert ex.value.message == f'Object `{_id}` not found.'
    assert ex.value.status_code == 404
