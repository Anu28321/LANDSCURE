CREATE DATABASE IF NOT EXISTS landsure;

USE landsure;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('buyer', 'owner', 'admin') NOT NULL
);

-- 2. Lands table
CREATE TABLE lands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    land_name VARCHAR(150) NOT NULL,
    location VARCHAR(200) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    survey_number VARCHAR(100),
    description TEXT,
    status ENUM('available', 'pending', 'sold') DEFAULT 'available',

    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- 3. Documents table
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    land_id INT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_path VARCHAR(500) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_status ENUM(
        'pending',
        'verified',
        'needs_review',
        'rejected'
    ) DEFAULT 'pending',

    FOREIGN KEY (land_id) REFERENCES lands(id)
);

-- 4. Verification Results table
CREATE TABLE verification_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    owner_match BOOLEAN DEFAULT FALSE,
    survey_match BOOLEAN DEFAULT FALSE,
    location_match BOOLEAN DEFAULT FALSE,
    area_match BOOLEAN DEFAULT FALSE,
    overall_status ENUM(
        'verified',
        'needs_review',
        'mismatch'
    ) DEFAULT 'needs_review',
    remarks TEXT,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- 5. Purchase Requests table
CREATE TABLE purchase_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    owner_id INT NOT NULL,
    land_id INT NOT NULL,
    status ENUM(
        'pending',
        'accepted',
        'rejected'
    ) DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (land_id) REFERENCES lands(id)
);