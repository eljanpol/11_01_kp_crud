from back.database.models import User
from back.core.exceptions import InvalidCredentials
from back.rest_api.hasher import verify_hash
from back.rest_api.jwt_token import encode_jwt, key


def authentificate(username: str, password: str):
    user = User.get_or_none(name=username)

    if verify_hash(password, user["password"]) and user:
        return {"access_token": encode_jwt(user.id, key, 60 * 24 * 30),
                "token_type": "bearer"}

    raise InvalidCredentials("Invalid password or username")
