from _typeshed import structseq

from pydantic import BaseModel, Field, ConfigDict


class CreateProductSchema(BaseModel):
    name: str
    category: int
    description: str
    storage_cell: int
    date_added: str


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserRoleUpdate(BaseModel):
    role_id: int


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    role_id: int


class StorageSellCreate(BaseModel):
    name: str


class CategoryCreate(BaseModel):
    name: str
    description: str


class CategoryGet(BaseModel):
    id: int


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: str
