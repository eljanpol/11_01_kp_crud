from peewee import Model, CharField, SqliteDatabase, AutoField, ForeignKeyField, IntegerField, DateTimeField, PostgresqlDatabase
from back.database.schemas import ProductSchema
from back.rest_api.hasher import hash_password
from back.rest_api.routers import product
from playhouse.shortcuts import model_to_dict
from back.database.schemas import *


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


class User(Table):
    name = CharField()
    role = ForeignKeyField(Role)
    password = CharField()


class Warehouse(Table):
    name = CharField()
    adress = CharField()
    responsible_user = ForeignKeyField(User)


class Suppliers(Table):
    name = CharField()
    phone = CharField()
    email = CharField()
    inn = CharField()


class StorageSell(Table):
    name = CharField()


class Product(Table):
    name = CharField()
    category = ForeignKeyField(Category)
    description = CharField()
    storage_cell = ForeignKeyField(StorageSell)
    date_added = DateTimeField()

    def get_product_list(self):
        return [model_to_dict(i) for i in Product.select()]

    def get_product_by_id(self, id: str):
        return model_to_dict(Product.get_or_none(id=id))

    def create_product(self, product: CreateProductSchema):
        product = Product.get_or_create(
            name=product.name,
            category=product.category,
            description=product.description,
            storage_cell=product.storage_cell,
            date_added=product.date_added
        )

        return model_to_dict(product)

    def change_product_cell(self, id: int, new_cell: str):
        product = Product.get_or_none(id=id)

        if not product:
            raise 

        product.storage_cell = new_cell
        product.save()

        return model_to_dict(product)


class ProductTransportation(Table):
    product = ForeignKeyField(Product)
    from_adress = CharField()
    to_adress = CharField()
    sending_date = DateTimeField()


def main():
    Role.get_or_create(
        name="1"
    )
    User.get_or_create(
        name="1",
        role=1,
        password=hash_password("qwert")
    )
    Category.get_or_create(
        name="1",
        description="qwerty"
    )
    Product.get_or_create(
        name="qwerty",
        category=1,
        description="sadf",
        storage_cell="a1",
        date_added="2026-05-05 10:20:53"
    )


if __name__ == "__main__":
    db.create_tables([
        Role,
        User,
        Category,
        Product
    ])
    main()
