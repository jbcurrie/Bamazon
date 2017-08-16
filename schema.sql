CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products( 
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NULL,
    style_color VARCHAR (45) NULL,
    department_name VARCHAR(45) NULL,
    price DECIMAL(4,2),
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

ALTER TABLE products
    MODIFY price DECIMAL(5,2) NULL;

SELECT * FROM products;
TRUNCATE TABLE products;

-- // Create a MySQL Database called bamazon.
-- // Then create a Table inside of that database called products.
-- // The products table should have each of the following columns:
-- // item_id (unique id for each product)
-- // product_name (Name of product)
-- // department_name
-- // price (cost to customer)
-- // stock_quantity (how much of the product is available in stores)
-- // Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).