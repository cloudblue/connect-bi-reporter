from logging import Logger
from typing import Any, Dict

from connect.client import ClientError, ConnectClient

from connect_bi_reporter.credentials.models import Credential
from connect_bi_reporter.db import VerboseBaseSession
from connect_bi_reporter.feeds.errors import FeedError
from connect_bi_reporter.feeds.api.schemas import FeedCreateSchema
from connect_bi_reporter.connect_services.reports import get_report_schedule


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
        try:
            get_report_schedule(client, feed_schema.schedule.id)
        except ClientError as ex:
            logger.warning(str(ex))
            raise FeedError.RF_000(format_kwargs={'report_schedule': feed_schema.schedule.id})

    @classmethod
    def validate_credential(cls, *args, **kwargs):
        db = args[0]
        installation = args[2]
        feed_schema = args[3]
        logger = args[4]
        cred = db.query(Credential).filter(
            Credential.account_id == installation['owner']['id'],
            Credential.id == feed_schema.credential.id,
        ).one_or_none()
        if not cred:
            exc = FeedError.RF_001(format_kwargs={'credential_id': feed_schema.credential.id})
            logger.warning(exc.message)
            raise exc
