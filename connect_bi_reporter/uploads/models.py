from datetime import datetime

from sqlalchemy.orm import relationship
import sqlalchemy as db
from connect_extension_utils.db.models import Model

from connect_bi_reporter.feeds.models import Feed
from connect_bi_reporter.uploads.enums import UploadStatusChoices


class Upload(Model):
    __tablename__ = 'upload'

    PREFIX = 'ULF'
    STATUSES = UploadStatusChoices

    id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(128))
    feed_id = db.Column(db.ForeignKey(Feed.id), nullable=False)
    report_id = db.Column(db.String(20), nullable=False)
    size = db.Column(db.Integer)
    status = db.Column(
        db.Enum(STATUSES, validate_strings=True),
        default=STATUSES.pending,
        nullable=False,
    )
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow, default=datetime.utcnow)

    feed = relationship('Feed', back_populates='upload')
