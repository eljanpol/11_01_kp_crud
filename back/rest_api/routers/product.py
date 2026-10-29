from fastapi import APIRouter, HTTPException, Body, Depends, Path, Query
from typing import Optional
from datetime import date
from playhouse.shortcuts import model_to_dict

from back.database.models import Product
from back.rest_api.jwt_token import key, encode_jwt, decode_jwt
from back.rest_api.dependencies import get_current_user
from back.database.schemas import CreateProductSchema


router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def get_products_list(current_user=Depends(get_current_user)):
	return [model_to_dict(i) for i in Product.select()]


@router.get("/{id}")
def get_product(id: int, current_user=Depends(get_current_user)):
    return model_to_dict(Product.get_product_by_id(id))


@router.post("/")
def create_product(product: CreateProductSchema, current_user=Depends(get_current_user)):
	return model_to_dict(Product.create_product(product))


@router.patch("/{id}")
def change_product_cell(id: int = Path(), new_cell: str = Query(), current_user=Depends(get_current_user)):
	return model_to_dict(Product.change_product_cell(id, new_cell))
