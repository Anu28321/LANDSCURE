CREATE DATABASE IF NOT EXISTS land_store;
USE land_store;

CREATE TABLE IF NOT EXISTS land_properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_cart_property FOREIGN KEY (property_id) REFERENCES land_properties(id)
);
