from pydantic import BaseModel, Field, ConfigDict


class CreateProductSchema(BaseModel):
    name: str
    category: str
    description: str
    storage_cell: str


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class UserRoleUpdate(BaseModel):
    username: str
    role_name: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    role_id: int


class StorageCellCreate(BaseModel):
    name: str


class StorageCellGet(BaseModel):
    name: str


class StorageCellResponse(BaseModel):
    id: int
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
