from connect_bi_reporter.errors import ExtensionErrorBase


class CredentialError(ExtensionErrorBase):
    PREFIX = 'CRED'

    ERRORS = {
        0: "Can not delete Credential `{credential_id}`, "
        "is already related to Feeds `{feeds}`.",
    }
