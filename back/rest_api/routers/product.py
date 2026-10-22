from fastapi import APIRouter, HTTPException, Body, Depends
from playhouse.shortcuts import model_to_dict
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

from back.database.models import Product
from back.rest_api.jwt_token import get_jwt, get_user, key, auf_token


router = APIRouter(prefix="/products", tags=["products"])


class Product(BaseModel):
    name: str
    category: int
    description: str
    storage_cell: str
    date_added: str


@router.get("/")
def get_products_list(current_user=Depends(auf_token)):
    return [model_to_dict(i) for i in Product.select()]


@router.get("/{id}")
def get_product(id: int, current_user=Depends(auf_token)):
    return model_to_dict(Product.get_or_none(id=id))


@router.post("/")
def create_product(product: Product):
    pass
