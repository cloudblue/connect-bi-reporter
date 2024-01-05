import factory

from .database import Session
from connect_bi_reporter.credentials.models import Credential
from connect_bi_reporter.feeds.models import Feed
from connect_bi_reporter.uploads.models import Upload
from connect_bi_reporter.db import _generate_verbose_id


class OnlyIdSubFactory(factory.SubFactory):
    def evaluate(self, instance, step, extra):
        if step.builder.factory_meta._is_transactional and step.sequence > 0:
            session = step.builder.factory_meta.sqlalchemy_session
            transactional_instance = session.query(step.builder.factory_meta.model).first()
            if transactional_instance:
                related_field = step.builder.factory_meta._related_id_field
                return getattr(transactional_instance, related_field)
        result = super().evaluate(instance, step, extra)
        return result.id


class TransactionalVerboseSQLAlchemyOptions(factory.alchemy.SQLAlchemyOptions):
    def _build_default_options(self):
        return super()._build_default_options() + [
            factory.base.OptionDefault('_related_id_field', None),
            factory.base.OptionDefault('_is_transactional', False),
        ]


class BaseFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Base Factory."""

    _options_class = TransactionalVerboseSQLAlchemyOptions

    class Meta:
        """Factory configuration."""

        abstract = True
        sqlalchemy_session = Session
        sqlalchemy_session_persistence = "commit"

    @classmethod
    def _save(cls, model_class, session, args, kwargs):
        session_persistence = cls._meta.sqlalchemy_session_persistence

        obj = model_class(*args, **kwargs)
        if cls._meta._is_transactional:
            obj = cls.add_next_with_verbose(model_class, session, obj, cls._meta._related_id_field)
        session.add(obj)
        if session_persistence == factory.alchemy.SESSION_PERSISTENCE_FLUSH:
            session.flush()
        elif session_persistence == factory.alchemy.SESSION_PERSISTENCE_COMMIT:
            session.commit()
        return obj

    @classmethod
    def add_next_with_verbose(cls, model_class, session, obj, related_id_field):
        new_suffix = 0
        related_id_value = getattr(obj, related_id_field)
        if (
            session.query(session.query(model_class).filter(
                model_class.__dict__[related_id_field] == related_id_value).exists(),
            ).scalar()
        ):
            last_obj = session.query(model_class).order_by(
                model_class.id.desc(),
            ).first()
            _instance_id, suffix = last_obj.id.rsplit('-', 1)
            new_suffix = int(suffix) + 1
        else:
            id_body = related_id_value.split('-', 1)[-1]
            _instance_id = f"{model_class.PREFIX}-{id_body}"

        obj.id = '{0}-{1}'.format(_instance_id, '{0:03d}'.format(new_suffix))
        return obj


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


class FeedFactory(BaseFactory):
    class Meta:
        model = Feed

    id = factory.Sequence(lambda _: _generate_verbose_id(Feed.PREFIX))
    file_name = factory.Sequence(lambda n: f'File name {n}')
    description = factory.Sequence(lambda _: 'Some description')
    account_id = factory.Sequence(lambda n: f'PA-{n}')
    schedule_id = factory.Sequence(lambda n: f'RS-{n}')
    credential_id = OnlyIdSubFactory('tests.factories.CredentialFactory')
    created_by = factory.Sequence(lambda n: f'SU-{n}')
    updated_by = factory.Sequence(lambda n: f'SU-{n}')


class UploadFactory(BaseFactory):

    class Meta:
        model = Upload
        _related_id_field = 'feed_id'
        _is_transactional = True

    feed_id = OnlyIdSubFactory('tests.factories.FeedFactory')
    report_id = factory.Sequence(lambda n: f'RP-{n}')
