# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
from connect.client import ClientError
from connect.eaas.core.constants import PROXIED_CONNECT_API_ATTR_NAME

from connect_bi_reporter.webapp import ConnectBiReporterWebApplication


def test_on_startup_web_app_create_schedule_task(
    installation,
    logger,
    eaas_schedule_task,
    mocker,
):
    config = {}
    mocker.patch(
        'connect_bi_reporter.webapp.get_extension_owner_installation',
        return_value=installation,
    )
    mocker.patch(
        'connect_bi_reporter.scheduler.get_schedule_tasks',
        return_value=[],
    )
    mocker.patch(
        'connect_bi_reporter.scheduler.create_schedule_task',
        return_value=eaas_schedule_task,
    )
    ConnectBiReporterWebApplication.on_startup(logger, config)
    assert logger.method_calls[0].args[0] == 'Database created...'
    assert logger.method_calls[1].args[0] == (
        f'Periodic Schedule Task created: `{eaas_schedule_task["id"]}`.'
    )


def test_on_startup_web_app_task_already_exists(
    installation,
    logger,
    eaas_schedule_task,
    mocker,
):
    config = {}
    mocker.patch(
        'connect_bi_reporter.webapp.get_extension_owner_installation',
        return_value=installation,
    )
    mocker.patch(
        'connect_bi_reporter.scheduler.get_schedule_tasks',
        return_value=[eaas_schedule_task],
    )

    ConnectBiReporterWebApplication.on_startup(logger, config)
    assert logger.method_calls[0].args[0] == 'Database created...'
    assert logger.method_calls[1].args[0] == (
        f'Existing Periodic Tasks Schedule founded for installation'
        f' `{installation["id"]}`: {eaas_schedule_task["id"]}.'
    )


def test_on_startup_web_app_connect_client_error_get_installation(
    logger,
    mocker,
):
    config = {}
    mocker.patch(
        'connect_bi_reporter.webapp.get_extension_owner_installation',
        side_effect=ClientError(message='Bad!', status_code=500),
    )

    ConnectBiReporterWebApplication.on_startup(logger, config)
    assert logger.method_calls[0].args[0] == 'Database created...'
    assert logger.method_calls[1].args[0] == (
        'Something went wrong when trying to initialize the extension:'
        ' Please stop it and run it again.'
    )


def test_on_startup_web_app_connect_client_error_create_schedule_task(
    logger,
    mocker,
    installation,
):
    config = {}
    mocker.patch(
        'connect_bi_reporter.webapp.get_extension_owner_installation',
        return_value=installation,
    )
    mocker.patch(
        'connect_bi_reporter.scheduler.get_schedule_tasks',
        side_effect=ClientError(message='Bad!', status_code=500),
    )

    ConnectBiReporterWebApplication.on_startup(logger, config)
    assert logger.method_calls[0].args[0] == 'Database created...'
    assert logger.method_calls[1].args[0] == (
        'Something went wrong when trying to initialize the extension:'
        ' Please stop it and run it again.'
    )


def test_proxied_connect_endpoints(api_client):
    proxied = getattr(api_client._webapp_class, PROXIED_CONNECT_API_ATTR_NAME)
    assert isinstance(proxied, dict)
    assert proxied == {
        '/files': 'view',
        '/public/v1/media': 'view',
        '/public/v1/reporting/reports': 'view',
        '/public/v1/reporting/schedules': 'view',
    }
