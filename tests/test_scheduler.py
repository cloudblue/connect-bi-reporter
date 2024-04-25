from connect.client import ClientError
from connect.eaas.core.inject.models import Context
from connect.eaas.core.responses import BackgroundResponse
import pytest

from connect_bi_reporter.scheduler import (
    EaasScheduleTask,
    genererate_default_recurring_schedule_task,
    Scheduler,
    TriggerTypeEnum,
)


@pytest.mark.parametrize(
    'task_type,extra_data,expected_payload',
    (
        (
            TriggerTypeEnum.onetime,
            {'date': 'test', 'foo': 'bar'},
            {'trigger': {'type': 'onetime', 'date': 'test'}},
        ),
        (
            TriggerTypeEnum.recurring,
            {'start': 'test', 'amount': 2, 'unit': 'days', 'foo': 'bar'},
            {'trigger': {'type': 'recurring', 'amount': 2, 'unit': 'days', 'start': 'test'}},
        ),
        (
            TriggerTypeEnum.advanced,
            {'start': 'test', 'amount': 2, 'cron_expression': '* * *', 'foo': 'bar'},
            {'trigger': {'type': 'advanced', 'cron_expression': '* * *', 'start': 'test'}},
        ),
    ),
)
def test_get_task_payload(task_type, extra_data, expected_payload):
    payload = EaasScheduleTask.get_task_payload(task_type, extra_data, {})
    assert payload == expected_payload


@pytest.mark.parametrize(
    'task_type,extra_data',
    (
        (
            TriggerTypeEnum.recurring,
            {'start': 'test', 'amount': 2, 'foo': 'bar'},
        ),
        (
            TriggerTypeEnum.advanced,
            {'start': 'test', 'amount': 2, 'foo': 'bar'},
        ),
    ),
)
def test_get_task_payload_fail_missing_data(task_type, extra_data):
    with pytest.raises(ValueError) as ex:
        EaasScheduleTask.get_task_payload(task_type, extra_data, {})
    assert ex.value.args[0] == 'All required keys must be present before accessing `trigger_data`.'


def test_scheduler(connect_client, logger, mocker, eaas_schedule_task, installation):
    ctx = Context(
        installation_id=installation['id'],
        environment_id=installation['environment']['id'],
        extension_id=installation['environment']['extension']['id'],
        account_id=installation['environment']['extension']['owner']['id'],
    )
    mocker.patch(
        'connect_bi_reporter.scheduler.get_schedule_tasks',
        return_value=[eaas_schedule_task],
    )
    scheduler = Scheduler(connect_client, ctx, logger)
    tasks = scheduler.get_schedule_tasks()
    assert tasks == [eaas_schedule_task]

    mocker.patch(
        'connect_bi_reporter.scheduler.create_schedule_task',
        return_value=eaas_schedule_task,
    )
    trigger_data = {
        'cron_expression': '* *',
        'start': 'test',
    }
    new_task = scheduler.create_schedule_task(
        TriggerTypeEnum.advanced,
        trigger_data,
        {},
    )
    assert new_task == eaas_schedule_task
    assert logger.method_calls[0].args[0] == (
        f'Periodic Schedule Task created: `{eaas_schedule_task["id"]}`.'
    )


@pytest.mark.parametrize(
    'response_type, mocker_return_value, expected_response',
    (
        (None, {
            'return_value': [
                {
                    'id': 'some',
                    'method': 'create_uploads',
                    'parameter': {
                        'installation_id': 'EIN-8436-7221-8308',
                    },
                },
            ],
        }, None),
        (None, {'side_effect': ClientError(message='Bad!', status_code=500)}, None),
        (BackgroundResponse, {
            'return_value': [
                {
                    'id': 'some',
                    'method': 'create_uploads',
                    'parameter': {
                        'installation_id': 'EIN-8436-7221-8308',
                    },
                },
            ],
        }, 'success'),
        (
            BackgroundResponse,
            {'side_effect': ClientError(message='Bad!', status_code=500)},
            'reschedule',
        ),
    ),
)
def test_genererate_default_recurring_schedule_task(
    connect_client,
    logger,
    mocker,
    installation,
    response_type,
    mocker_return_value,
    expected_response,

):
    ctx = Context(
        installation_id=installation['id'],
        environment_id=installation['environment']['id'],
        extension_id=installation['environment']['extension']['id'],
        account_id=installation['environment']['extension']['owner']['id'],
    )
    mocker.patch(
        'connect_bi_reporter.scheduler.get_schedule_tasks',
        **mocker_return_value,
    )
    result = genererate_default_recurring_schedule_task(
        connect_client,
        ctx,
        logger,
        response_type,
    )
    assert getattr(result, 'status', None) == expected_response
