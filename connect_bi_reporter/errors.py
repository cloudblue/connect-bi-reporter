from typing import Any, Dict, Union

from connect.client import ClientError


class Error:

    STATUS_CODE = 400

    def __init__(self, message, error_code):
        self.message = message
        self.error_code = error_code

    def __call__(self, **kwds: Dict[str, Any]) -> ClientError:
        format_kwargs = kwds.get('format_kwargs', {})

        message = self.message.format(**format_kwargs)
        errors = kwds.get('errors')

        if not errors:
            errors = [message or 'Unexpected error.']
        if not isinstance(errors, list):
            errors = [errors]

        return ClientError(
            message=message,
            status_code=self.STATUS_CODE,
            error_code=self.error_code,
            errors=errors,
        )


class ExtensionErrorMeta(type):
    PREFIX = 'EXT'
    ERRORS = {}

    def __getattr__(cls, __name: str) -> Union[Error, AttributeError]:
        valid_dict = {cls.PREFIX: cls.ERRORS}
        try:
            prefix, code = __name.split('_')
            error = valid_dict[prefix][int(code)]
        except (KeyError, ValueError):
            raise AttributeError(f"type object '{cls.__name__}' has no attribute '{__name}'")
        return Error(message=error, error_code=__name)


class ExtensionErrorBase(metaclass=ExtensionErrorMeta):
    '''
    Base Error class to group a set of errors base on a prefix.
    By default the `PREFIX` value is `EXT`, but it can be overwritten.
    Also `status_code` and/or list of `errors` can be provided.

    Usage:

    ```
    # Define a custom error class
    class MyError(ExtensionErrorBase)
        PREFIX = "BIR"
        ERRORS = {
            1: "Some error",
            2: "Some {template} error.",
            3: "Not found",

        }

    # raise the error
    raise MyError.BIR_001()
    raise MyError.BIR_002(format_kwargs={"template": "foo"})
    raise MyError.BIR_003(status_code=404)
    ```
    '''
