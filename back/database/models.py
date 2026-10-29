from peewee import Model, CharField, SqliteDatabase, AutoField, ForeignKeyField, IntegerField, DateTimeField, PostgresqlDatabase
from playhouse.shortcuts import model_to_dict
import datetime

from back.rest_api.hasher import verify_hash, hash_password
from back.rest_api.jwt_token import decode_jwt
from back.database.schemas import (UserRegister, UserRoleUpdate, CreateProductSchema, StorageCellCreate, CategoryCreate, CategoryGet, StorageCellGet)
from back.core.exceptions import InvalidRole, NotFoundError, AlreadyExsist


db = PostgresqlDatabase(
    database="postgres",
    user="postgres",
    password="postgres",
    host="localhost",
    port=5432
)
db.connect()


class Table(Model):
    id = AutoField()

    class Meta:
        database = db


class Role(Table):
    name = CharField()


class Category(Table):
    name = CharField()
    description = CharField()

    @classmethod
    def create_category(cls, data: CategoryCreate):
        category = cls.get_or_create(
            name=data.name,
            description=data.description
        )

        return category

    @classmethod
    def get_category(cls, data: CategoryGet):
        category = cls.get_or_none(id=data.id)

        if not category:
            raise NotFoundError(f"category {data.id} not found")

        return category

    @classmethod
    def get_category_list(cls):
        return cls.select()


class User(Table):
    name = CharField(unique=True)
    role = ForeignKeyField(Role)
    password = CharField()

    @classmethod
    def create_user(cls, user_data: UserRegister):
        if user_data.username in [model_to_dict(i)["name"] for i in User.select()]:
            raise AlreadyExsist("User already registered")

        role = Role.get_or_none(name="user")

        if not role:
            raise NotFoundError(f"role 'user' not found")

        user, _ = cls.get_or_create(
            name=user_data.username,
            password=hash_password(user_data.password),
            role=role
        )

        return user

    @classmethod
    def change_role(cls, data: UserRoleUpdate):
        role = Role.get_or_none(id=data.role_name)
        user = cls.get_or_none(id=data.username)

        if not role or not user:
            raise NotFoundError("User of Role not found")

        user.role = role
        user.save()

        return user

    def is_admin(self):
        return self.role.name == "admin"


class Warehouse(Table):
    name = CharField()
    adress = CharField()
    responsible_user = ForeignKeyField(User)


class Suppliers(Table):
    name = CharField()
    phone = CharField()
    email = CharField()
    inn = CharField()


class StorageCell(Table):
    name = CharField()

    @classmethod
    def add_storage_sell(cls, sell: StorageCellCreate):
        cell = cls.get_or_create(
            name=sell.name
        )

        return cell

    @classmethod
    def get_cells_list(cls):
        return cls.select()

    @classmethod
    def get_cell(cls, cell: StorageCellGet):
        cell = cls.get_or_none(name=cell.name)

        if not cell:
            raise NotFoundError(f"storage cell {cell.name} not found")

        return cell


class Product(Table):
    name = CharField()
    category = ForeignKeyField(Category)
    description = CharField()
    storage_cell = ForeignKeyField(StorageCell)
    date_added = DateTimeField()

    @classmethod
    def get_product_by_id(cls, id: int):
        product = cls.get_or_none(id=id)

        if not product:
            raise NotFoundError(f"product {id} not found")

        return product

    @classmethod
    def create_product(cls, product: CreateProductSchema):
        category = Category.get_or_none(name=product.category)
        cell = StorageCell.get_or_none(name=product.storage_cell)
        
        if not category or not cell:
            raise NotFoundError(f"category or cell not found")

        product = cls.get_or_create(
            name=product.name,
            category=category,
            description=product.description,
            storage_cell=cell,
            date_added=datetime.datetime.now
        )

        return product

    @classmethod
    def change_product_cell(cls, id: int, new_cell: str):
        product = cls.get_or_none(id=id)

        if not product:
            raise NotFoundError(f"product {id} not found")

        product.storage_cell = new_cell
        product.save()

        return product


class ProductTransportation(Table):
    product = ForeignKeyField(Product)
    from_adress = CharField()
    to_adress = CharField()
    sending_date = DateTimeField()


def main():
    for name in ("user", "manager", "admin"):
        Role.get_or_create(name=name)

    user, _ = User.get_or_create(
        name="admin",
        role=Role.get_or_none(name="admin"),
        password=hash_password("qwerty123")
    )


if __name__ == "__main__":
    db.create_tables([
        Role,
        User,
        Category,
        Product,
        StorageCell,
        ProductTransportation,
        Suppliers,
        Warehouse        
    ])
    main()
