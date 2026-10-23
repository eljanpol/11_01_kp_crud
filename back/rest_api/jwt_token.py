import jwt
from fastapi import FastAPI, HTTPException, Body, Depends
from playhouse.shortcuts import model_to_dict
from fastapi.security import OAuth2PasswordBearer

from back.database.models import User


auf_token = OAuth2PasswordBearer(tokenUrl="token")
key = "QDRDDoV7TZE0MrJmsL2PmV853ZE7luZZpD27TnU9Gnq1nZOcbiNGxtmdUIzjn3QPYfBBMbk1yGl9xZTpl3TqfCsSGL7o3ZjXKaqc1OiS7eilQKCAnquvaTP9XYGCFswe"


def encode_jwt(user_id: str, key: str):
    return jwt.encode({"user_id": user_id}, key=key, algorithm="HS256")


def decode_jwt(token: str, key: str):
    user_dict = jwt.decode(token, key=key, algorithms=["HS256"])

    return User.get_or_none(id=user_dict["id"])


async def get_current_user(id: str = Depends(auf_token)):
    user = User.get_or_none(id=id)

    if not user:
        raise HTTPException(status_code=400, detail="invalid name")

    return decode_jwt(user.id, key=key)
