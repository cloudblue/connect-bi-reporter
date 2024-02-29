from datetime import datetime, timedelta
from logging import Logger
import enum
from typing import Any, Dict, Optional

from connect.client import ClientError, ConnectClient
from connect.eaas.core.responses import BackgroundResponse
from connect.eaas.core.inject.models import Context

from connect_bi_reporter.connect_services.devops import create_schedule_task, get_schedule_tasks
from connect_bi_reporter.constants import DEFAULT_RECURRING_EAAS_SCHEDULE_TASK_DATA


class TriggerTypeEnum(str, enum.Enum):
    onetime = 'onetime'
    recurring = 'recurring'
    advanced = 'advanced'


class ResponseTypeEnum(str, enum.Enum):
    SUCCESS = 'done'
    ERROR = 'reschedule'


class TriggerType:
    TYPE = None
    REQUIRED_KEYS = []

    def __init__(self, **data):
        self._trigger_data = {}
        self.update(**data)

    def update(self, **data):
        self.initial_data = {'type': self.TYPE}
        clean_data = {k: v for k, v in data.items() if k in self.required_keys}
        self.initial_data.update(**clean_data)
        self._trigger_data.update({'trigger': self.initial_data})

    @property
    def trigger_data(self):
        if not all(key in self.initial_data for key in self.required_keys):
            raise ValueError('All required keys must be present before accessing `trigger_data`.')
        return self._trigger_data

    @property
    def required_keys(self):
        required_keys = set(self.REQUIRED_KEYS)
        required_keys.add('type')
        return required_keys


class OnetimeTriggerType(TriggerType):
    TYPE = 'onetime'
    REQUIRED_KEYS = ['date']


class RecurringTriggerType(TriggerType):
    TYPE = 'recurring'
    REQUIRED_KEYS = ['unit', 'amount', 'start']


class AdvancedTriggerType(TriggerType):
    TYPE = 'advanced'
    required_keys = ['cron_expression', 'start']


class EaasScheduleTask:
    onetime = OnetimeTriggerType
    recurring = RecurringTriggerType
    advanced = AdvancedTriggerType

    @classmethod
    def get_task_payload(cls, trigger_type, trigger_data, method_payload):
        trigger_type = getattr(cls, trigger_type)
        trigger = trigger_type(**trigger_data)
        method_payload.update(**trigger.trigger_data)
        return method_payload


class Scheduler:
    def __init__(self, client: ConnectClient, context: Context, logger: Logger) -> None:
        self.client = client
        self.context = context
        self.logger = logger

    def get_schedule_tasks(self):
        return get_schedule_tasks(self.client, self.context)

    def get_schedule_task_by_method_name(self, method_name: str):
        existing_tasks = self.get_schedule_tasks()
        task = None
        for _task in existing_tasks:
            if _task['method'] == method_name:
                task = _task
                break
        return task

    def create_schedule_task(
        self,
        trigger_type: TriggerTypeEnum,
        trigger_data: Dict[str, Any],
        method_payload: Dict[Any, Any],
    ):
        payload = EaasScheduleTask.get_task_payload(
            trigger_type=trigger_type,
            trigger_data=trigger_data,
            method_payload=method_payload,
        )
        new_schedule_task = create_schedule_task(self.client, self.context, payload)
        self.logger.info(
            f"Periodic Schedule Task created: `{new_schedule_task['id']}`.",
        )
        return new_schedule_task


def genererate_default_recurring_schedule_task(
    client: ConnectClient,
    context: Context,
    logger: Logger,
    response: Optional[BackgroundResponse] = None,
):
    try:
        scheduler = Scheduler(client, context, logger)
        schedule_tasks = scheduler.get_schedule_tasks()
        if schedule_tasks:
            task_ids = ', '.join(task['id'] for task in schedule_tasks)
            logger.info(
                (
                    f"Existing Periodic Tasks Schedule "
                    f"founded for installation `{context.installation_id}`: "
                    f"{task_ids}."
                ),
            )
            return get_response(response, ResponseTypeEnum.SUCCESS)
        start_date = (
            datetime.utcnow() + timedelta(days=1)
        ).replace(hour=0, minute=0, second=0, microsecond=0)
        method_payload = {
            'method': 'create_uploads',
            'name': f'Create Uploads - {context.account_id}',
            'description': 'Create Uploads for recurrent processing.',
            'parameter': {
                'installation_id': context.installation_id,
            },
        }
        trigger_data = {
            **DEFAULT_RECURRING_EAAS_SCHEDULE_TASK_DATA,
            'start': start_date.isoformat(),
        }
        scheduler.create_schedule_task(
            trigger_type=TriggerTypeEnum.recurring,
            trigger_data=trigger_data,
            method_payload=method_payload,
        )
    except ClientError:
        info = 'Something went wrong when trying to {action}: {message}'
        action = 'initialize the extension'
        message = 'Please stop it and run it again.'
        if response:
            action = 'process the event'
            message = 'Rescheduling...'
        logger.info(info.format(action=action, message=message))
        return get_response(response, ResponseTypeEnum.ERROR)
    return get_response(response, ResponseTypeEnum.SUCCESS)


def get_response(response, response_type):
    response = getattr(response, response_type, None)
    if callable(response):
        return response()
    return response
