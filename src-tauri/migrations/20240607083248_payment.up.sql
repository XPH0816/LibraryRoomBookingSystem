-- Add up migration script here
CREATE TABLE
    IF NOT EXISTS payment (
        payment_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
        booking_id INT UNSIGNED NOT NULL,
        datetime DATETIME NOT NULL,
        method ENUM (
            'cash',
            'credit_card',
            'debit_card',
            'bank transfer'
        ) NOT NULL,
        amount SMALLINT UNSIGNED NOT NULL,
        payment_status ENUM ('completed', 'failed', 'canceled') NOT NULL,
        FOREIGN KEY (booking_id) REFERENCES booking (booking_id) ON DELETE CASCADE ON UPDATE CASCADE
    );