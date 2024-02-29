
from logging import Logger

from connect.client import ConnectClient
from connect.eaas.core.decorators import router
from connect.eaas.core.inject.common import get_call_context, get_logger
from connect.eaas.core.inject.models import Context
from connect.eaas.core.inject.synchronous import get_installation_client
from connect_extension_utils.api.errors import Http404
from fastapi import Depends, status

from connect_bi_reporter.constants import CREATE_UPLOADS_METHOD_NAME
from connect_bi_reporter.settings.api.schemas import EaasScheduleTaskSchema
from connect_bi_reporter.scheduler import Scheduler


class SettingsWebAppMixin:

    @router.get(
        '/settings/schedule-tasks/create-uploads',
        summary='Returns the Schedule Task named `create_uploads`',
        response_model=EaasScheduleTaskSchema,
        status_code=status.HTTP_200_OK,
    )
    def get_create_upload_task_info(
        self,
        client: ConnectClient = Depends(get_installation_client),
        context: Context = Depends(get_call_context),
        logger: Logger = Depends(get_logger),
    ):
        scheduler = Scheduler(client, context, logger)

        task = scheduler.get_schedule_task_by_method_name(CREATE_UPLOADS_METHOD_NAME)

        if not task:
            raise Http404(obj_id=CREATE_UPLOADS_METHOD_NAME)
        return EaasScheduleTaskSchema(**task)
