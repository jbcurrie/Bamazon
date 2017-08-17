CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products( 
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NULL,
    style_color VARCHAR (45) NULL,
    department_name VARCHAR(45) NULL,
    price DECIMAL(5,2) NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL(7,2),
    PRIMARY KEY (item_id)
);


SELECT * FROM products;
-- TRUNCATE TABLE products;


CREATE TABLE departments(
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(45) NULL,
    over_head_costs DECIMAL(7,2) NULL,
    PRIMARY KEY (department_id)
);

SELECT * FROM departments;
-- TRUNCATE TABLE departments;
 