-- Add up migration script here
CREATE TABLE
    IF NOT EXISTS bill (
        bill_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
        payment_id INT UNSIGNED NOT NULL,
        datetime DATETIME NOT NULL,
        amount SMALLINT UNSIGNED NOT NULL,
        status ENUM ('completed', 'failed', 'canceled') NOT NULL,
        FOREIGN KEY (payment_id) REFERENCES payment (payment_id) ON DELETE CASCADE ON UPDATE CASCADE
    );