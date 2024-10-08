import factory
from connect_extension_utils.db.models import _generate_verbose_id
from connect_extension_utils.testing.factories import BaseFactory, OnlyIdSubFactory

from connect_bi_reporter.credentials.models import Credential
from connect_bi_reporter.feeds.models import Feed
from connect_bi_reporter.uploads.models import Upload


class CredentialFactory(BaseFactory):
    class Meta:
        model = Credential

    id = factory.Sequence(lambda _: _generate_verbose_id(Credential.PREFIX))
    name = factory.Sequence(lambda n: f'Credential {n}')
    sas_token = factory.Sequence(
        lambda _: (
            'sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2024-04-09T19:38:51Z'
            '&st=2024-04-08T11:38:51Z&spr=https&sig=MeZjy2Df96DjJax7Oeor8ZzUePjhTzaVZRvE1wixThM%3D'
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
