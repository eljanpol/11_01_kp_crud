from fastapi import APIRouter, HTTPException, Body, Depends
from typing import Optional

from back.database.models import StorageCell
from back.rest_api.dependencies import get_current_user
from back.database.schemas import StorageCellCreate, StorageCellGet, StorageCellResponse


router = APIRouter(prefix="/storageCell", tags=["storageCell"])


@router.get("/", response_model=list[StorageCellResponse])
def get_category_list(current_user=Depends(get_current_user)):
	return StorageCell.get_cells_list()


@router.get("/{id}", response_model=StorageCellResponse)
def ger_category(data: StorageCellGet, current_user=Depends(get_current_user)):
    return StorageCell.get_cell(data)


@router.post("/", response_model=StorageCellResponse)
def create_category(data: StorageCellCreate, current_user=Depends(get_current_user)):
	return StorageCell.add_storage_cell(data)
