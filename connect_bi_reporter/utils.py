import jwt


def get_user_data_from_auth_token(token):
    payload = jwt.decode(token, options={"verify_signature": False})
    return {
        'id': payload['u']['oid'],
        'name': payload['u']['name'],
    }
