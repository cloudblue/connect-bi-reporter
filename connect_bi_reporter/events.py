# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
from connect.eaas.core.decorators import (
    event,
    schedulable,
    variables,
)
from connect.eaas.core.extension import EventsApplicationBase
from connect.eaas.core.responses import (
    BackgroundResponse,
    ScheduledExecutionResponse,
)


@variables([
    {
        'name': 'VAR_NAME_1',
        'initial_value': 'VAR_VALUE_1',
        'secure': False,
    },
    {
        'name': 'VAR_NAME_N',
        'initial_value': 'VAR_VALUE_N',
        'secure': True,
    },
])
class ConnectBiReporterEventsApplication(EventsApplicationBase):
    @event(
        'installation_status_change',
        statuses=[
            'installed', 'uninstalled',
        ],
    )
    def handle_installation_status_change(self, request):
        self.logger.info(f"Obtained request with id {request['id']}")
        return BackgroundResponse.done()

    @schedulable('Schedulable method', 'It can be used to test DevOps scheduler.')
    def execute_scheduled_processing(self, schedule):
        self.logger.info(
            f"Received event for schedule  {schedule['id']}",
        )
        return ScheduledExecutionResponse.done()
