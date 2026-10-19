from peewee import Model, CharField, SqliteDatabase, AutoField, ForeignKeyField, IntegerField, DateTimeField
# import pymysql

from back.api.hasher import hash_password


user = "root"
password = "1234_8765"
host = "localhost"
port = 3306
db_name = "students"


class Table(Model):
    id = AutoField()

    class Meta:
        database = db


class Role(Table):
    name = CharField()


class Category(Table):
    name = CharField()
    


class User(Table):
    name = CharField()
    role = ForeignKeyField(Role)
    password = CharField()


class Product(Table):
    name = CharField()
    category = ForeignKeyField()
