from fastapi import APIRouter, HTTPException, Body, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional
from datetime import date

from back.database.models import Product
from back.rest_api.jwt_token import key, auf_token, encode_jwt, decode_jwt


router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def get_products_list(current_user=Depends(auf_token)):



@router.get("/{id}")
def get_product(id: int, current_user=Depends(auf_token)):
    


@router.post("/")
def create_product(product: ProductModel, current_user=Depends(auf_token)):
    product = Product.get_or_create(
        name=product.name,
        category=product.category,
        description=product.description,
        storage_cell=product.storage_cell,
        date_added=product.date_added
    )

    return model_to_dict(product)


@router.patch("/{id}")
def change_product_cell(id: int, new_cell: str, current_user=Depends(auf_token)):
    product = Product.get_or_none(id=id)

    if not product:
        HTTPException(400, "Product not found")

    product.storage_cell = new_cell
    product.save()

    return model_to_dict(product)
