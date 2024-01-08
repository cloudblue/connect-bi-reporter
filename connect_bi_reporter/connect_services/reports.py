def get_report_schedule(client, report_id):
    return client.ns('reporting').schedules[report_id].get()


def get_reporting_schedules(client, filters):
    pass


def get_reporting_reports(client, filters):
    pass
