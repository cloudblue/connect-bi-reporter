from connect.eaas.core.decorators import schedulable
from connect.eaas.core.responses import (
    ScheduledExecutionResponse,
)


class UploadTaskApplicationMixin:
    @schedulable(
        'Create Uploads',
        'DESCRIPTION',
    )
    def create_uploads(self, schedule):
        return ScheduledExecutionResponse.done()

    @schedulable(
        'Process Uploads',
        'DESCRIPTION',
    )
    def process_uploads(self, schedule):
        return ScheduledExecutionResponse.done()
