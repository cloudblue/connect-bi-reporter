# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
from connect.client import ClientError
from connect.eaas.core.inject.models import Context

from connect_bi_reporter.events import ConnectBiReporterEventsApplication


def test_handle_installation_status_installed_create_task(
    connect_client,
    client_mocker_factory,
    logger,
    installation,
    eaas_schedule_task,
):
    config = {}
    client_mocker = client_mocker_factory(base_url=connect_client.endpoint)
    ctx = Context(
        installation_id=installation['id'],
        environment_id=installation['environment']['id'],
        extension_id=installation['environment']['extension']['id'],
        account_id=installation['environment']['extension']['owner']['id'],
    )
    (
        client_mocker.ns('devops')
        .services[ctx.extension_id]
        .environments[ctx.environment_id]
        .schedules.all().mock(
            return_value=[],
        )
    )
    (
        client_mocker.ns('devops')
        .services[ctx.extension_id]
        .environments[ctx.environment_id]
        .schedules.create(return_value=eaas_schedule_task)
    )
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config,
        context=ctx,
        installation_client=connect_client,
    )
    result = ext.handle_installation_status_change(installation)
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
    client_mocker_factory,
    logger,
    installation,
    eaas_schedule_task,
):
    config = {}
    client_mocker = client_mocker_factory(base_url=connect_client.endpoint)
    ctx = Context(
        installation_id=installation['id'],
        environment_id=installation['environment']['id'],
        extension_id=installation['environment']['extension']['id'],
        account_id=installation['environment']['extension']['owner']['id'],
    )
    (
        client_mocker.ns('devops')
        .services[ctx.extension_id]
        .environments[ctx.environment_id]
        .schedules.all().mock(
            return_value=[eaas_schedule_task],
        )
    )
    ext = ConnectBiReporterEventsApplication(
        connect_client,
        logger,
        config,
        context=ctx,
        installation_client=connect_client,
    )
    result = ext.handle_installation_status_change(installation)
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
