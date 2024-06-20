-- Add up migration script here
CREATE TABLE
    IF NOT EXISTS booking (
        booking_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
        room_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        start_datetime DATETIME NOT NULL,
        end_datetime DATETIME NOT NULL,
        reason TEXT NOT NULL,
        status ENUM (
            'completed',
            'failed',
            'canceled',
            'approved',
            'rejected',
            'pending'
        ) NOT NULL,
        admin_id INT UNSIGNED NULL,
        FOREIGN KEY (room_id) REFERENCES room (room_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES admin (admin_id) ON DELETE CASCADE ON UPDATE CASCADE
    );