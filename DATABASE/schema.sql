CREATE DATABASE IF NOT EXISTS landsure;
USE landsure;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('buyer','owner','admin') NOT NULL
);

CREATE TABLE lands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    land_name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    survey_number VARCHAR(100),
    description TEXT,
    status ENUM('available','pending','sold') DEFAULT 'available',
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    land_id INT NOT NULL,
    document_name VARCHAR(150) NOT NULL,
    document_path VARCHAR(255),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_status ENUM('pending','verified','mismatch','rejected')
        DEFAULT 'pending',
    FOREIGN KEY (land_id) REFERENCES lands(id)
);

CREATE TABLE verification_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    extracted_data TEXT,
    mismatch_details TEXT,
    suggested_correction TEXT,
    verification_status ENUM('pending','verified','mismatch')
        DEFAULT 'pending',
    verified_at TIMESTAMP NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE TABLE purchase_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    land_id INT NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending','accepted','rejected','completed')
        DEFAULT 'pending',
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (land_id) REFERENCES lands(id)
);