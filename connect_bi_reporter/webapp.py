# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
from connect.eaas.core.decorators import router, web_app
from connect.eaas.core.extension import WebApplicationBase

from connect_bi_reporter.credentials.api.views import CredentialsWebAppMixin
from connect_bi_reporter.db import create_db


@web_app(router)
class ConnectBiReporterWebApplication(
    CredentialsWebAppMixin,
    WebApplicationBase,
):

    @classmethod
    def on_startup(cls, logger, config):
        # When database schema is completely defined
        # here we are going to add migration based on alembic.
        create_db(config)
        logger.info('Database created...')
