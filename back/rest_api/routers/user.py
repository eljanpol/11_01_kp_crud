from back.rest_api.jwt_token import encode_jwt
from fastapi import APIRouter, HTTPException, Body, Depends
from datetime import date

from back.database.schemas import UserRegister, UserResponse, UserRoleUpdate
from back.database.models import User, Role
from back.rest_api.dependencies import get_current_user


router = APIRouter(prefix="/users", tags=["users"])


@router.post("", response_model=UserResponse)
def register(user_data: UserRegister):
    return User.create_user(user_data)


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    return current_user 


@router.get("", response_model=list[UserResponse])
def get_users(current_user=Depends(get_current_user)):
    if current_user.role.name == "admin":
        return list(User.select())

    raise HTTPException(403, "User must be a admin")


@router.patch("/{user_id}", response_model=UserResponse)
def change_role(
    data: UserRoleUpdate,
    current_user=Depends(get_current_user)
    ):
    
    if current_user.role.name == "admin":
        User.change_role(data)

    raise HTTPException(403, "User must be a admin")
