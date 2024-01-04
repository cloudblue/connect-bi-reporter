from datetime import datetime

import sqlalchemy as db

from connect_bi_reporter.db import Model


class Credential(Model):
    __tablename__ = "credential"

    PREFIX = 'CRED'

    id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    connection_string = db.Column(db.String(256), nullable=False)
    account_id = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    created_by = db.Column(db.String(20))
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow, default=datetime.utcnow)
    updated_by = db.Column(db.String(20))
