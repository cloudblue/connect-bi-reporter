# -*- coding: utf-8 -*-
#
# Copyright (c) 2024, Ingram Micro
# All rights reserved.
#
from connect_bi_reporter.events import ConnectBiReporterEventsApplication


def test_handle_installation_status_change(
    connect_client,
    client_mocker_factory,
    logger,
):
    config = {}
    request = {'id': 1}
    ext = ConnectBiReporterEventsApplication(connect_client, logger, config)
    result = ext.handle_installation_status_change(request)
    assert result.status == 'success'
