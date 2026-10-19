from peewee import Model, CharField, SqliteDatabase, AutoField, ForeignKeyField, IntegerField, DateTimeField, PostgresqlDatabase


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
    storage_section = CharField()


class User(Table):
    name = CharField()
    role = ForeignKeyField(Role)
    password = CharField()


class Product(Table):
    name = CharField()
    category = ForeignKeyField(Category)
    description = CharField()
    storage_cell = CharField()


def main():
    Role.get_or_create(
        name="1"
    )
    User.get_or_create(
        name="1",
        role=1,
        password="qwerty"
    )
    Category.get_or_create(
        name="1",
        description="qwerty",
        storage_section="a1"
    )
    Product.get_or_create(
        name="qwerty",
        category=1,
        description="sadf",
        storage_cell="a1"
    )


if __name__ == "__main__":
    db.create_tables([
        Role,
        User,
        Category,
        Product
    ])
    main()
