from logging import Logger
from typing import Any, Dict

from connect.client import ClientError, ConnectClient
from connect_extension_utils.db.models import VerboseBaseSession

from connect_bi_reporter.credentials.models import Credential
from connect_bi_reporter.feeds.errors import FeedError
from connect_bi_reporter.feeds.api.schemas import FeedCreateSchema
from connect_bi_reporter.connect_services.reports import get_report_schedule
from connect_bi_reporter.constants import ALLOWED_RENDERERS


class FeedValidator:

    @classmethod
    def validate(
        cls,
        db: VerboseBaseSession,
        client: ConnectClient,
        installation: Dict[str, Any],
        feed_schema: FeedCreateSchema,
        logger: Logger,
        **kwargs: Dict[Any, Any],
    ):
        args = (db, client, installation, feed_schema, logger)
        for attr in cls.__dict__.keys():
            if attr.startswith('validate_'):
                getattr(cls, attr)(*args, **kwargs)

    @classmethod
    def validate_report_schedule(cls, *args, **kwargs):
        client = args[1]
        feed_schema = args[3]
        logger = args[4]
        reason = None
        report_schedule = None
        try:
            report_schedule = get_report_schedule(client, feed_schema.schedule.id)
        except ClientError as ex:
            reason = str(ex)
        if report_schedule and report_schedule['renderer'] not in ALLOWED_RENDERERS:
            reason = f"Renderer `{report_schedule['renderer']}` not allowed."
        if reason:
            logger.warning(reason)
            raise FeedError.RF_000(format_kwargs={
                'report_schedule': feed_schema.schedule.id,
                'reason': reason,
            })

    @classmethod
    def validate_credential(cls, *args, **kwargs):
        db = args[0]
        installation = args[2]
        feed_schema = args[3]
        logger = args[4]
        action = kwargs.pop('action', 'create')
        cred = db.query(Credential).filter(
            Credential.account_id == installation['owner']['id'],
            Credential.id == feed_schema.credential.id,
        ).one_or_none()
        if not cred:
            exc = FeedError.RF_001(format_kwargs={
                'credential_id': feed_schema.credential.id,
                'action': action,
            })
            logger.warning(exc.message)
            raise exc
