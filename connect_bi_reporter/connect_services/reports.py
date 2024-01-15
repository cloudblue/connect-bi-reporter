def get_report_schedule(client, report_id):
    return client.ns('reporting').schedules[report_id].get()


def get_reporting_schedules(client, filters):
    pass


def get_reporting_reports(client, filters):
    pass


def download_report(client, report_id):
    return client.ns('reporting').collection('reports')[report_id]('download').get()


def get_reporting_report(client, filters):
    return (
        client.ns('reporting')
        .reports.filter(filters)
        .order_by('-events.created.at')
        .first()
    )
