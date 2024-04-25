# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
from datetime import datetime, timedelta

from connect.client import ClientError
from connect.eaas.core.inject.models import Context

from connect_bi_reporter.events import ConnectBiReporterEventsApplication


def test_handle_installation_status_installed_create_task(
    connect_client,
    logger,
    installation,
    eaas_schedule_task,
    mocker,
):
    config = {}
    mocker.patch(
        'connect_bi_reporter.events.get_extension_owner_client',
        return_value=connect_client,
    )
    start = datetime.utcnow()
    string_start_date = (
        start + timedelta(days=1)
    ).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    p_datetime = mocker.patch(
        'connect_bi_reporter.scheduler.datetime',
    )
    p_datetime.utcnow.return_value = start
    p_get_connect_task = mocker.patch(
        'connect_bi_reporter.scheduler.get_schedule_tasks',
        return_value=[],
    )
    p_create_connect_task = mocker.patch(
        'connect_bi_reporter.scheduler.create_schedule_task',
        return_value=eaas_schedule_task,
    )
    ctx = Context(
        installation_id=installation['id'],
        environment_id=installation['environment']['id'],
        extension_id=installation['environment']['extension']['id'],
        account_id=installation['environment']['extension']['owner']['id'],
    )
    task_payload = {
        'description': 'Create Uploads for recurrent processing.',
        'method': 'create_uploads',
        'name': f'Create Uploads - {ctx.account_id}',
        'parameter': {
            'installation_id': ctx.installation_id,
            'account_id': ctx.account_id,
        },
        'trigger': {
            'amount': 1,
            'start': string_start_date,
            'type': 'recurring',
            'unit': 'days',
        },
    }
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config,
        context=ctx,
        installation_client=connect_client,
    )
    result = ext.handle_installation_status_change(installation)
    p_get_connect_task.assert_called_once_with(connect_client, ctx)
    p_create_connect_task.assert_called_once_with(connect_client, ctx, task_payload)

    assert result.status == 'success'
    assert logger.method_calls[0].args[0] == (
        f'This extension has been installed by Provider '
        f'account 00 ({ctx.account_id}): id={ctx.installation_id}, '
        f'environment={ctx.environment_id}'
    )
    assert logger.method_calls[1].args[0] == (
        f'Periodic Schedule Task created: `{eaas_schedule_task["id"]}`.'
    )


def test_handle_installation_status_installed_task_already_exists(
    connect_client,
    logger,
    installation,
    eaas_schedule_task,
    mocker,
):
    config = {}
    mocker.patch(
        'connect_bi_reporter.events.get_extension_owner_client',
        return_value=connect_client,
    )
    p_get_connect_task = mocker.patch(
        'connect_bi_reporter.scheduler.get_schedule_tasks',
        return_value=[eaas_schedule_task],
    )
    p_create_connect_task = mocker.patch(
        'connect_bi_reporter.scheduler.create_schedule_task',
    )
    ctx = Context(
        installation_id=installation['id'],
        environment_id=installation['environment']['id'],
        extension_id=installation['environment']['extension']['id'],
        account_id=installation['environment']['extension']['owner']['id'],
    )

    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config,
        context=ctx,
        installation_client=connect_client,
    )
    result = ext.handle_installation_status_change(installation)
    p_get_connect_task.assert_called_once_with(connect_client, ctx)
    p_create_connect_task.assert_not_called()
    assert result.status == 'success'
    assert logger.method_calls[0].args[0] == (
        f'This extension has been installed by Provider '
        f'account 00 ({ctx.account_id}): id={ctx.installation_id}, '
        f'environment={ctx.environment_id}'
    )
    assert logger.method_calls[1].args[0] == (
        f'Existing Periodic Tasks Schedule founded for installation'
        f' `{ctx.installation_id}`: {eaas_schedule_task["id"]}.'
    )


def test_handle_installation_status_uninstalled(
    connect_client,
    logger,
    installation,
):
    installation['status'] = 'uninstalled'
    config = {}
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config,
        installation=installation,
    )
    result = ext.handle_installation_status_change(installation)
    account = f"{installation['owner']['name']} ({installation['owner']['id']})"
    assert result.status == 'success'
    assert logger.method_calls[0].args[0] == (
        f'This extension has been removed by {account}: '
        f'id={installation["id"]}, environment={installation["environment"]["id"]}'
    )


def test_handle_installation_status_installed_fail_create_task(
    connect_client,
    logger,
    installation,
    mocker,
):
    config = {}
    ctx = Context(
        installation_id=installation['id'],
        environment_id=installation['environment']['id'],
        extension_id=installation['environment']['extension']['id'],
        account_id=installation['environment']['extension']['owner']['id'],
    )
    mocker.patch(
        'connect_bi_reporter.scheduler.get_schedule_tasks',
        side_effect=ClientError(message='Bad!', status_code=500),
    )
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config,
        context=ctx,
        installation_client=connect_client,
    )
    result = ext.handle_installation_status_change(installation)
    assert result.status == 'reschedule'
    assert logger.method_calls[0].args[0] == (
        f'This extension has been installed by Provider '
        f'account 00 ({ctx.account_id}): id={ctx.installation_id}, '
        f'environment={ctx.environment_id}'
    )
    assert logger.method_calls[1].args[0] == (
        'Something went wrong when trying to process the event: Rescheduling...'
    )
