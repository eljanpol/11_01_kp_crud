import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from back.rest_api.jwt_token import decode_jwt, key
from back.database.models import User, Role


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")


CREDS_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = decode_jwt(token, key)
        user_id = payload.get("user_id")

        if user_id is None:
            raise CREDS_ERROR

    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired",
                            headers={"WWW-Authenticate": "Bearer"})

    except jwt.PyJWTError:
        raise CREDS_ERROR

    user = User.get_or_none(User.id == user_id)

    if user is None:
        raise CREDS_ERROR

    return user
