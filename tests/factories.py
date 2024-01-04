import factory

from .database import Session
from connect_bi_reporter.credentials.models import Credential
from connect_bi_reporter.db import _generate_verbose_id


class BaseFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Base Factory."""

    class Meta:
        """Factory configuration."""

        abstract = True
        sqlalchemy_session = Session
        sqlalchemy_session_persistence = "commit"


class CredentialFactory(BaseFactory):
    class Meta:
        model = Credential

    id = factory.Sequence(lambda _: _generate_verbose_id(Credential.PREFIX))
    name = factory.Sequence(lambda n: f'Credential {n}')
    connection_string = factory.Sequence(
        lambda n: (
            f'DefaultEndpointsProtocol=https;AccountName={n};'
            f'AccountKey={n};EndpointSuffix=core.windows.net'
        ),
    )
    account_id = factory.Sequence(lambda n: f'PA-{n}')
    created_by = factory.Sequence(lambda n: f'SU-{n}')
    updated_by = factory.Sequence(lambda n: f'SU-{n}')
