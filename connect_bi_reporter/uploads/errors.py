from connect_extension_utils.api.errors import ExtensionErrorBase


class UploadError(ExtensionErrorBase):
    PREFIX = 'UPL'

    ERRORS = {
        0: "Can not retry Upload `{upload_id}`: {reason}",
        1: "Can not force Upload creation for Feed `{feed_id}` in status `{status}`.",
        2: "Error while forcing Upload for Feed `{feed_id}`: {reason}",
    }
