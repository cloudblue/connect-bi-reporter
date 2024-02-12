from connect_extension_utils.api.errors import ExtensionErrorBase


class UploadError(ExtensionErrorBase):
    PREFIX = 'UPL'

    ERRORS = {
        0: "Can not retry Upload `{upload_id}`: {reason}",
    }
