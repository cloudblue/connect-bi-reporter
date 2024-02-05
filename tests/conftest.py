# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
from contextlib import contextmanager

import pytest
from pytest_factoryboy import register
from connect.client import AsyncConnectClient, ConnectClient
from connect.eaas.core.inject.models import Context
from connect_extension_utils.db.models import get_db

from .factories import CredentialFactory, FeedFactory, UploadFactory
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
def connect_auth_header():
    """Connect-Auth header for the user fixture ('SU-295-689-628', 'Neri')"""
    return (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1Ijp7Im9pZCI6IlNVLTI5NS02ODktN"
        "jI4IiwibmFtZSI6Ik5lcmkifX0.U_T6vuXnD293hcWNTJZ9QBViteNv8JXUL2gM0BezQ-k"
    )


@pytest.fixture
def logger(mocker):
    return mocker.MagicMock()


@pytest.fixture
def common_context():
    return Context(call_type='user', user_id='UR-000-000-000', account_id='PA-000-000')


@pytest.fixture(autouse=True)
def mocked_get_db_ctx(dbsession, mocker):

    @contextmanager
    def mocked_context(config):
        yield dbsession

    mocker.patch(
        'connect_bi_reporter.uploads.tasks.get_db_ctx_manager',
        wraps=mocked_context,
    )


@pytest.fixture
def api_client(test_client_factory, dbsession):
    client = test_client_factory(ConnectBiReporterWebApplication)
    client.app.dependency_overrides = {
        get_db: lambda: dbsession,
    }
    yield client


@pytest.fixture
def installation():
    return {
        "id": "EIN-8436-7221-8308",
        "environment": {
            "id": "ENV-2244-9935-01",
            "type": "development",
            "icon": "googleExtensionBaseline",
            "extension": {
                "id": "SRVC-2244-9935",
                "name": "BI Reporter ext",
                "owner": {
                    "id": "PA-000-000",
                    "name": "Provider account 00",
                    "icon": "/media/PA-000-000/media/icon.png",
                    "role": "distributor",
                },
                "icon": "https://portal.cnct.info/files/media/public/eaas_icons/"
                "SRVC-2244-9935/5f5def84784825c0a74b.png",
                "extension_id": "EXT-426-640",
            },
            "hostname": "srvc-2244-9935-dev",
            "domain": "ext.cnct.info",
            "git": {},
            "runtime": "local",
        },
        "owner": {
            "id": "PA-000-000",
            "name": "Provider account 00",
            "icon": "/media/PA-000-000/media/icon.png",
            "role": "distributor",
        },
        "settings": {},
        "events": {
            "installed": {
                "at": "2023-06-27T11:22:01+00:00",
                "by": {
                    "id": "UR-000-000-000",
                    "name": "Jhon Doe",
                },
            },
            "updated": {
                "at": "2023-06-27T11:22:01+00:00",
            },
        },
        "status": "installed",
    }


@pytest.fixture
def report_schedule():
    return {
        "id": "RS-2796-9021",
        "name": "Report schedule for feed",
        "description": "Some",
        "events": {
            "created": {
                "at": "2024-01-04T17:21:55+00:00",
                "by": {
                    "id": "UR-065-000-003",
                    "name": "JPaul",
                },
            },
            "updated": {
                "at": "2024-01-04T17:21:55+00:00",
                "by": {
                    "id": "UR-065-000-003",
                    "name": "JPaul",
                },
            },
            "next_execution": {
                "at": "2024-01-05T05:00:00+00:00",
            },
        },
        "template": {
            "id": "RT-7657-8947-0004",
            "name": "Billing requests report",
            "type": "system",
            "revision": 0,
            "local_id": "billing_requests",
            "repository": {
                "id": "RR-7657-8947",
                "name": "Connect Reports",
            },
            "status": "enabled",
        },
        "trigger": {
            "frequency": "daily",
            "time": "05:00:00+00:00",
        },
        "parameters": [
            {
                "id": "date",
                "name": "Report period",
                "type": "date_range",
                "schedule": {
                    "to": {
                        "exact": "2024-01-04T00:00:00+00:00",
                    },
                    "from": "now",
                },
            },
            {
                "id": "product",
                "name": "Product list",
                "type": "product",
                "value": {
                    "all": False,
                    "choices": [
                        "PRD-000-065-001",
                    ],
                },
            },
            {
                "id": "mkp",
                "name": "Marketplaces",
                "type": "marketplace",
                "value": {
                    "all": False,
                    "choices": [
                        "MP-06521",
                    ],
                },
            },
        ],
        "status": "enabled",
        "renderer": "csv",
        "owner": {
            "id": "PA-000-000",
            "name": "Provider account for JPaul Platinum",
        },
        "stats": {
            "total_executions": 0,
            "average_execution_time": 0,
        },
    }


@pytest.fixture
def eaas_schedule_task():
    return {
        "id": "EFS-6538-5881-01-0005",
        "name": "Create Uploads - PA-065-102",
        "description": "Create Uploads for recurrent processing.",
        "method": "create_uploads",
        "parameter": {},
        "trigger": {
            "type": "recurring",
            "start": "2024-01-10T09:35:03+00:00",
            "unit": "days",
            "amount": 7,
        },
        "environment": {
            "id": "ENV-6538-5881-01",
            "type": "development",
            "icon": "googleExtensionBaseline",
        },
        "events": {
            "created": {
                "at": "2024-01-10T09:34:04+00:00",
                "by": {
                    "id": "SU-540-221-350",
                    "name": "token for connect reporter bi",
                },
            },
            "updated": {
                "at": "2024-01-10T09:34:04+00:00",
                "by": {
                    "id": "SU-540-221-350",
                    "name": "token for connect reporter bi",
                },
            },
        },
        "status": "pending",
    }


register(CredentialFactory)
register(FeedFactory)
register(UploadFactory)
