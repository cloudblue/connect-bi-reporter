import os

from azure.core.exceptions import ResourceNotFoundError
from azure.storage.blob import ContainerClient


def upload_file(data, filename, credentials, logger):  # pragma: no cover
    container_name = os.getenv('UPLOADS_CONTAINER_NAME')

    try:
        container_client = ContainerClient.from_connection_string(
            credentials.connection_string, container_name,
        )
    except ResourceNotFoundError:
        logger.error(f'Error uploading file: Containter {container_name} does not exist.')

    blob_client = container_client.upload_blob(name=filename, data=data)
    blob_props = blob_client.get_blob_properties()

    return {
        'name': blob_props.name,
        'size': blob_props.size,
    }
