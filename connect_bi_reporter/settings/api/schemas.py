from typing import Any, Dict

from connect_extension_utils.api.schemas import Events, NonNullSchema


_DictAny = Dict[Any, Any]


class EaasScheduleTaskSchema(NonNullSchema):
    id: str
    name: str
    description: str
    method: str
    parameter: _DictAny
    trigger: _DictAny
    environment: _DictAny
    events: Events
    status: str
