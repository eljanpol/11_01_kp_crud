import jwt
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer

from back.rest_api.jwt_token import decode_jwt, key
from back.database.models import User, Role


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")


CREDS_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Unautrorized"
)


def get_current_user(token: str | None= Header()) -> User:
    if not token:
        raise CREDS_ERROR

    try:
        payload = decode_jwt(token, key)
        user_id = payload.get("user_id")

    except:
        raise CREDS_ERROR

    user = User.get_or_none(User.id == user_id)

    if user is None:
        raise CREDS_ERROR

    return user
