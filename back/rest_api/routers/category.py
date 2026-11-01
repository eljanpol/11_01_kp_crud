from fastapi import APIRouter, HTTPException, Body, Depends
from typing import Optional

from back.database.models import Category
from back.rest_api.dependencies import get_current_user
from back.database.schemas import CategoryGet, CategoryCreate, CategoryResponse
from back.rest_api.routers import product


router = APIRouter(prefix="/category", tags=["category"])


@router.get("/", response_model=list[CategoryResponse])
def get_category_list(current_user=Depends(get_current_user)):
	return Category.get_category_list()


@router.get("/{id}", response_model=CategoryResponse)
def ger_category(data: CategoryGet, current_user=Depends(get_current_user)):
    return Category.get_category(data)


@router.post("/", response_model=CategoryResponse)
def create_category(data: CategoryCreate, current_user=Depends(get_current_user)):
	return Category.create_category(data)
