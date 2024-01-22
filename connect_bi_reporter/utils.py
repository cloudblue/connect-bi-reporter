import os

import jwt
from connect.eaas.core.logging import RequestLogger
from connect.client.rql import R
from connect.client import ConnectClient

from connect_bi_reporter.errors import Http404


def get_extension_owner_client(logger):
    return ConnectClient(
        os.getenv('API_KEY'),
        endpoint=f"https://{os.getenv('SERVER_ADDRESS')}/public/v1",
        use_specs=False,
        logger=RequestLogger(logger),
    )


def get_extension_owner_installation(client):
    rql = R().environment.id.eq(os.getenv('ENVIRONMENT_ID'))
    return client('devops').installations.filter(rql).first()


def get_user_data_from_auth_token(token):
    payload = jwt.decode(token, options={"verify_signature": False})
    return {
        'id': payload['u']['oid'],
        'name': payload['u']['name'],
    }


def get_object_or_404(db, model, filters, object_id):
    obj = db.query(model).filter(*filters).one_or_none()
    if not obj:
        raise Http404(obj_id=object_id)
    return obj
