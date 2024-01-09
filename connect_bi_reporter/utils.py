import jwt

from connect_bi_reporter.errors import Http404


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
