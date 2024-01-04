# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
import pytest

from contextlib import contextmanager

from pytest_factoryboy import register
from sqlalchemy import event
from connect.client import AsyncConnectClient, ConnectClient
from connect.eaas.core.inject.models import Context

from .database import Session
from .factories import CredentialFactory
from connect_bi_reporter.db import (
    create_db,
    get_db,
    get_engine,
    Model,
)
from connect_bi_reporter.webapp import ConnectBiReporterWebApplication


@pytest.fixture
def connect_client():
    return ConnectClient(
        'ApiKey fake_api_key',
        endpoint='https://localhost/public/v1',
    )


@pytest.fixture
def async_connect_client():
    return AsyncConnectClient(
        'ApiKey fake_api_key',
        endpoint='https://localhost/public/v1',
    )


@pytest.fixture
def logger(mocker):
    return mocker.MagicMock()


@pytest.fixture
def common_context():
    return Context(call_type='user', user_id='UR-000-000-000', account_id='PA-000-000')


@pytest.fixture(scope="session")
def engine():
    return get_engine({})


@pytest.fixture(scope="session")
def connection(request, engine):
    # Modify this URL according to your database backend

    connection = engine.connect()

    def teardown():
        Model.metadata.drop_all()
        connection.close()

    request.addfinalizer(teardown)
    return connection


@pytest.fixture(scope="session", autouse=True)
def setup_db(connection, request):
    """Setup test database.

    Creates all database tables as declared in SQLAlchemy models,
    then proceeds to drop all the created tables after all tests
    have finished running.
    """
    Model.metadata.bind = connection
    create_db({})

    def teardown():
        Model.metadata.drop_all()

    request.addfinalizer(teardown)


@pytest.fixture
def dbsession(connection, request):
    """
    Creates a new database session with (with working transaction)
    for test duration.
    """
    transaction = connection.begin()
    Session.configure(bind=connection)
    session = Session()
    session.begin_nested()

    @event.listens_for(session, "after_transaction_end")
    def restart_savepoint(db_session, transaction):
        if transaction.nested and not transaction._parent.nested:
            session.expire_all()
            session.begin_nested()

    def teardown():
        Session.remove()
        transaction.rollback()

    request.addfinalizer(teardown)
    return session


@pytest.fixture(autouse=True)
def mocked_get_db_ctx(dbsession, mocker):

    @contextmanager
    def mocked_context(config):
        yield dbsession


@pytest.fixture
def api_client(test_client_factory, dbsession):
    client = test_client_factory(ConnectBiReporterWebApplication)
    client.app.dependency_overrides = {
        get_db: lambda: dbsession,
    }
    yield client


register(CredentialFactory)
