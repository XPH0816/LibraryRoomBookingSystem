-- Add up migration script here
CREATE TABLE
    IF NOT EXISTS admin (
        admin_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
        username VARCHAR(50) NOT NULL,
        password TEXT NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL
    );