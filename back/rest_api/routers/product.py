from fastapi import APIRouter, HTTPException, Body, Depends, Path, Query
from typing import Optional
from datetime import date

from back.database.models import Product
from back.rest_api.jwt_token import key, encode_jwt, decode_jwt
from back.rest_api.dependencies import get_current_user
from back.database.schemas import CreateProductSchema


router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def get_products_list(current_user = Depends(get_current_user)):
	return list(Product.select())


@router.get("/{id}")
def get_product(
	id: int = Path(), 
	current_user = Depends(get_current_user)
):
    return Product.get_product_by_id(id)


@router.post("/")
def create_product(product: CreateProductSchema, current_user = Depends(get_current_user)):
	return Product.create_product(product)


@router.patch("/{id}")
def change_product_cell(
	id: int = Path(), 
	new_cell: str = Query(), 
	current_user = Depends(get_current_user)
):
	return Product.change_product_cell(id, new_cell)
