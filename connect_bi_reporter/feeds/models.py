from datetime import datetime

from sqlalchemy.orm import relationship
import sqlalchemy as db

from connect_bi_reporter.db import Model
from connect_bi_reporter.credentials.models import Credential
from connect_bi_reporter.feeds.enums import FeedStatusChoices


class Feed(Model):
    __tablename__ = 'feed'

    PREFIX = 'RF'
    STATUSES = FeedStatusChoices

    id = db.Column(db.String(20), primary_key=True)
    file_name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.Text, nullable=True)
    account_id = db.Column(db.String(20), nullable=False)
    schedule_id = db.Column(db.String(20), nullable=False)
    credential_id = db.Column(db.ForeignKey(Credential.id), nullable=False)
    status = db.Column(
        db.Enum(STATUSES, validate_strings=True),
        default=STATUSES.enabled,
        nullable=False,
    )
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    created_by = db.Column(db.String(20))
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow, default=datetime.utcnow)
    updated_by = db.Column(db.String(20))

    credential = relationship('Credential', back_populates='feed')
