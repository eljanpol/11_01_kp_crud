-- Справочник ролей
CREATE TABLE role (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Категории товаров
CREATE TABLE category (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     VARCHAR(255) NOT NULL,
    storage_section VARCHAR(255) NOT NULL
);

-- Пользователи
CREATE TABLE "user" (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    role_id  INTEGER      NOT NULL REFERENCES role(id),
    password VARCHAR(255) NOT NULL
);

-- Товары
CREATE TABLE product (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    category_id  INTEGER      NOT NULL REFERENCES category(id),
    description  VARCHAR(255) NOT NULL,
    storage_cell VARCHAR(255) NOT NULL,
    date_added   TIMESTAMP    NOT NULL
);