import json

from connect_bi_reporter.settings.api.schemas import EaasScheduleTaskSchema


def test_eaas_schema(eaas_schedule_task):
    task = EaasScheduleTaskSchema(**eaas_schedule_task)
    assert task.json() == json.dumps(eaas_schedule_task)
