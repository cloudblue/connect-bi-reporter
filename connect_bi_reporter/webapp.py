# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
from connect.client import ClientError
from connect.eaas.core.decorators import module_pages, proxied_connect_api, router, web_app
from connect.eaas.core.inject.models import Context
from connect.eaas.core.extension import WebApplicationBase
from connect_extension_utils.connect_services.base import (
    get_extension_owner_client,
    get_extension_owner_installation,
)
from connect_extension_utils.db.models import create_db

from connect_bi_reporter.credentials.api.views import CredentialsWebAppMixin
from connect_bi_reporter.feeds.api.views import FeedsWebAppMixin
from connect_bi_reporter.settings.api.views import SettingsWebAppMixin
from connect_bi_reporter.uploads.api.views import UploadsWebAppMixin
from connect_bi_reporter.scheduler import genererate_default_recurring_schedule_task


@web_app(router)
@module_pages(
    label='Feeds',
    url='/static/main.html',
)
@proxied_connect_api(
    {
        '/files': 'view',
        '/public/v1/media': 'view',
        '/public/v1/reporting/reports': 'view',
        '/public/v1/reporting/schedules': 'view',
    },
)
class ConnectBiReporterWebApplication(
    CredentialsWebAppMixin,
    FeedsWebAppMixin,
    UploadsWebAppMixin,
    SettingsWebAppMixin,
    WebApplicationBase,
):

    @classmethod
    def on_startup(cls, logger, config):
        # When database schema is completely defined
        # here we are going to add migration based on alembic.
        create_db(config)
        logger.info('Database created...')
        client = get_extension_owner_client(logger)
        try:
            installation = get_extension_owner_installation(client)
        except ClientError:
            logger.exception(
                'Something went wrong when trying to initialize the extension:'
                ' Please stop it and run it again.',
            )
            return
        if (
            installation['owner']['id'] == installation
            ['environment']['extension']['owner']['id']
        ):
            context = Context(
                installation_id=installation['id'],
                environment_id=installation['environment']['id'],
                extension_id=installation['environment']['extension']['id'],
                account_id=installation['environment']['extension']['owner']['id'],
            )
            genererate_default_recurring_schedule_task(client, context, logger)
