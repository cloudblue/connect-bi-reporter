DEFAULT_RECURRING_EAAS_SCHEDULE_TASK_DATA = {
    'unit': 'days',
    'amount': 1,
}
ALLOWED_RENDERERS = ['csv']
UPLOAD_BASE_ERROR_LOG_MESSAGE = (
    "Skipping Upload creation for Report Schedule `{schedule_id}`: {reason}"
)
# Delay in seconds for schedule to process Upload task
SECONDS_DELAY = 120
# Backoff factor in seconds between Upload tasks creation
SECONDS_BACKOFF_FACTOR = 10
PROCESS_UPLOAD_TAKS_BASE_METHOD_PAYLOAD = {
    'method': 'process_upload',
    'description': (
        'This task will download the report from connect'
        ' and published it in the respective storage.'
    ),
    'parameter': {},
}
