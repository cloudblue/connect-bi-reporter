from azure.core.exceptions import ResourceNotFoundError
from azure.storage.blob import ContainerClient


CONNECTION_STRING_TMPL = 'DefaultEndpointsProtocol=https;AccountName={account_name}'


def upload_file(data, filename, credentials, logger, config):  # pragma: no cover
    account_name = config.get('UPLOADS_ACCOUNT_NAME')
    container_name = config.get('UPLOADS_CONTAINER_NAME')

    try:
        container_client = ContainerClient.from_connection_string(
            CONNECTION_STRING_TMPL.format(account_name=account_name),
            container_name=container_name,
            credential=credentials.sas_token,
        )

    except ResourceNotFoundError:
        logger.error(f'Error uploading file: Containter {container_name} does not exist.')

    blob_client = container_client.upload_blob(name=filename, data=data)
    blob_props = blob_client.get_blob_properties()

    return {
        'name': blob_props.name,
        'size': blob_props.size,
    }
