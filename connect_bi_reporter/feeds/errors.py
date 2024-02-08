from connect_bi_reporter.errors import ExtensionErrorBase


class FeedError(ExtensionErrorBase):
    PREFIX = 'RF'

    ERRORS = {
        0: "Report schedule `{report_schedule}` not valid for feed creation: {reason}",
        1: "Can not {action} Feed, the Credential `{credential_id}` is not valid.",
        2: "Can not delete Feed `{feed_id}`, "
        "is already related to Uploads `{uploads}`.",
        3: "Feed `{feed_id}` is already in status `{status}`.",
    }
