import enum


class UploadStatusChoices(str, enum.Enum):
    pending = 'pending'
    processing = 'processing'
    uploaded = 'uploaded'
    failed = 'failed'


class UploadErrorLogMessagesEnum(str, enum.Enum):
    report_schedule_client_error = (
        "'Report Schedule `{report_schedule_id}` can not be found ({error})'."
    )
    report_schedule_invalid_status = (
        "'Report Schedule `{report_schedule_id}` invalid status `{status}`'."
    )
    report_file_not_found = "'Report File not found'."
    report_file_invalid_renderer = (
        "'Report File `{report_file_id}` renderer `{renderer}` not allowed'."
    )
    report_file_already_related = (
        "'Report File `{report_file_id}` is already related to an existing Upload'."
    )
    connect_client_error = "Connect client Error."
    db_error = "DB Error."


class UploadInfoLogMessagesEnum(str, enum.Enum):
    new_upload_created = "New Uploads were created: `{uploads_info}`."
    new_upload_schedule_task_created = (
        "New Scheduled Task `{task_id}` created for Upload "
        "`{upload_id}`: Will process Report File `{report_id}`"
    )
    no_feeds_to_process = "No Feeds found to process."


Errors = UploadErrorLogMessagesEnum
Info = UploadInfoLogMessagesEnum
