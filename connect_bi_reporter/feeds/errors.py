from connect_bi_reporter.errors import ExtensionErrorBase


class FeedError(ExtensionErrorBase):
    PREFIX = 'RF'

    ERRORS = {
        0: "Report schedule `{report_schedule}` not valid for feed creation: {reason}",
        1: "Credential `{credential_id}` not valid for feed creation.",
    }
