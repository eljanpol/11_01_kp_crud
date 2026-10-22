from fastapi import APIRouter, HTTPException, Body, Depends
from playhouse.shortcuts import model_to_dict
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

from back.database.models import User, UserSubjects, Subject
from back.rest_api.hasher import verify_hash, hash_password
from back.rest_api.jwt_token import get_jwt, get_user, key, auf_token


router = APIRouter(prefix="/users", tags=["users"])


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserGradeCreate(BaseModel):
    subject_id: int
    grade: int = Field(..., ge=1, le=100)
    created_at: str


class UserRoleUpdate(BaseModel):
    role_id: int


@router.post("")
async def register(user_data: UserRegister):
    if user_data.username in [model_to_dict(i)["name"] for i in User.select()]:
        raise HTTPException(400, "User already registered")

    user, _ = User.get_or_create(
        name=user_data.username,
        password=hash_password(user_data.password),
        role=2
    )

    return bool(user)


@router.get("/me")
async def get_me(current_user=Depends(auf_token)):
    return get_user(current_user, key)


@router.get("")
async def get_users(current_user=Depends(auf_token)):
    user = get_user(current_user, key)

    if user.role.name in ["admin", "teacher"]:
        return [model_to_dict(i) for i in User.select()]

    raise HTTPException(400, "Incorrect User role. User must be a Admin")


@router.patch("/{user_id}")
async def change_role(
    user_id: int, 
    role_data: UserRoleUpdate,
    current_user=Depends(auf_token)
):
    current_user = get_user(current_user, key)

    if current_user.role.name != "admin":
        raise HTTPException(400, "Incorrect User role. User must be a Admin")

    user = User.get_or_none(id=user_id)

    if not user:
        raise HTTPException(404, "User not found")

    user.role = role_data.role_id
    user.save()

    return model_to_dict(user)
