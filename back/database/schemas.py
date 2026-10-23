from pydantic import BaseModel


class CreateProductSchema(BaseModel):
    name: str
    category: int
    description: str
    storage_cell: str
    date_added: str
