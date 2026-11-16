-- Справочник ролей
CREATE TABLE role (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Категории товаров
CREATE TABLE category (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     VARCHAR(255) NOT NULL
);

-- Пользователи
CREATE TABLE "user" (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL UNIQUE,
    role_id  INTEGER      NOT NULL REFERENCES role(id),
    password VARCHAR(255) NOT NULL
);

-- Ячейки (места) хранения
CREATE TABLE storagecell (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Склады
CREATE TABLE warehouse (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    adress              VARCHAR(255) NOT NULL,
    responsible_user_id INTEGER      NOT NULL REFERENCES "user"(id)
);

-- Поставщики
CREATE TABLE suppliers (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    inn   VARCHAR(255) NOT NULL
);

-- Товары
CREATE TABLE product (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    category_id     INTEGER      NOT NULL REFERENCES category(id),
    description     VARCHAR(255) NOT NULL,
    storage_cell_id INTEGER      NOT NULL REFERENCES storagecell(id),
    date_added      TIMESTAMP    NOT NULL
);

-- Транспортировка товаров
CREATE TABLE producttransportation (
    id            SERIAL PRIMARY KEY,
    product_id    INTEGER      NOT NULL REFERENCES product(id),
    from_adress   VARCHAR(255) NOT NULL,
    to_adress     VARCHAR(255) NOT NULL,
    sending_date  TIMESTAMP    NOT NULL
);
