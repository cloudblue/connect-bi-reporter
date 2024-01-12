# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
from connect.eaas.core.decorators import event, variables
from connect.eaas.core.extension import EventsApplicationBase
from connect.eaas.core.responses import BackgroundResponse

from connect_bi_reporter.uploads.tasks import UploadTaskApplicationMixin
from connect_bi_reporter.scheduler import genererate_default_recurring_schedule_task


@variables([
    {
        'name': 'UPLOADS_CONTAINER_NAME',
        'initial_value': 'extension-bi-reporter',
        'secure': False,
    },
])
class ConnectBiReporterEventsApplication(
    EventsApplicationBase,
    UploadTaskApplicationMixin,
):
    @event(
        'installation_status_change',
        statuses=[
            'installed', 'uninstalled',
        ],
    )
    def handle_installation_status_change(self, request):
        account = f"{request['owner']['name']} ({request['owner']['id']})"
        if request['status'] == 'installed':
            self.logger.info(
                f"This extension has been installed by {account}: "
                f"id={request['id']}, environment={request['environment']['id']}",
            )
            return genererate_default_recurring_schedule_task(
                self.installation_client,
                self.context,
                self.logger,
                BackgroundResponse,
            )
        else:
            self.logger.info(
                f'This extension has been removed by {account}: '
                f'id={request["id"]}, environment={request["environment"]["id"]}',
            )
        return BackgroundResponse.done()
