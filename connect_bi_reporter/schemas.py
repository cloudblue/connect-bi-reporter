from datetime import datetime
from typing import Dict, Optional, Union

from pydantic import BaseModel, root_validator

_By = Optional[Union[str, Dict[str, str]]]
Events = Dict[str, Dict[str, Union[datetime, _By]]]


def clean_empties_from_dict(data):
    """
    Removes inplace all the fields that are None or empty dicts in data.
    Returns param data, that was modified inplace.
    If the param is not a dict, will return the param unmodified.
    :param data: dict
    :rtype: dict
    """
    if not isinstance(data, dict):
        return data

    for key in list(data.keys()):
        value = data[key]
        if isinstance(value, dict):
            clean_empties_from_dict(value)
            value = data[key]
        if not value:
            del data[key]
    return data


class NonNullSchema(BaseModel):
    def dict(self, *args, **kwargs):
        kwargs['exclude_none'] = True
        return super().dict(*args, **kwargs)

    @root_validator(pre=True)
    def validate_events(cls, values):
        events = values.get('events')
        if events:
            values['events'] = clean_empties_from_dict(events)
        return values


class ReferenceSchema(NonNullSchema):
    id: str
    name: Optional[str]
