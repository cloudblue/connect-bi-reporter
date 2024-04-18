# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
from connect.eaas.core.decorators import event, variables
from connect.eaas.core.extension import EventsApplicationBase
from connect.eaas.core.responses import BackgroundResponse
from connect.eaas.core.inject.models import Context
from connect_extension_utils.connect_services.base import get_extension_owner_client

from connect_bi_reporter.uploads.tasks import UploadTaskApplicationMixin
from connect_bi_reporter.scheduler import genererate_default_recurring_schedule_task


@variables([
    {
        'name': 'UPLOADS_CONTAINER_NAME',
        'initial_value': 'extension-bi-reporter',
        'secure': False,
    },
    {
        'name': 'UPLOADS_ACCOUNT_NAME',
        'initial_value': 'extension-local',
        'secure': False,
    },
    {
        'name': 'DATABASE_URL',
        'initial_value': 'postgresql+psycopg2://postgres:1q2w3e@db/bi_reporter',
        'secure': True,
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
            client = get_extension_owner_client(self.logger)
            return genererate_default_recurring_schedule_task(
                client,
                Context(
                    extension_id=self.context.extension_id,
                    environment_id=self.context.environment_id,
                    installation_id=request['id'],
                    account_id=request['owner']['id'],
                ),
                self.logger,
                BackgroundResponse,
            )
        else:
            self.logger.info(
                f'This extension has been removed by {account}: '
                f'id={request["id"]}, environment={request["environment"]["id"]}',
            )
        return BackgroundResponse.done()
