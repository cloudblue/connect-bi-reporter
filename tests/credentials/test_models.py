from datetime import datetime


def test_create_credential(dbsession, credential_factory):
    credential_model = credential_factory._meta.model
    assert not dbsession.query(credential_model).all()
    credential = credential_model(
        name='My cred',
        account_id='PA-000-000',
        sas_token='core.windows.net',
    )
    dbsession.add_with_verbose(credential)
    dbsession.commit()
    dbsession.refresh(credential)
    assert credential.id.startswith(credential_model.PREFIX)
    assert credential.name == 'My cred'
    assert credential.sas_token == 'core.windows.net'
    assert isinstance(credential.created_at, datetime)


def test_update_credential(dbsession, credential_factory):
    credential = credential_factory()
    assert credential.name.startswith('Credential')
    previous_update = credential.updated_at
    credential.name = 'New name'
    dbsession.add(credential)
    dbsession.commit()
    assert credential.name == 'New name'
    assert credential.updated_at != previous_update


def test_delete_credential(dbsession, credential_factory):
    credential = credential_factory()
    assert dbsession.query(credential_factory._meta.model).count() == 1
    dbsession.delete(credential)
    assert not dbsession.query(credential_factory._meta.model).all()
