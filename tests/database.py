from sqlalchemy.orm import scoped_session, sessionmaker

from connect_bi_reporter.db import VerboseBaseSession


Session = scoped_session(sessionmaker(class_=VerboseBaseSession))
