-- Add up migration script here
CREATE TABLE
    IF NOT EXISTS room (
        room_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
        room_number SMALLINT UNSIGNED NOT NULL,
        type ENUM (
            'iqra_room',
            'hikmah_room',
            'eksplorasi_room',
            'big_stage',
            'lestari_room',
            'auditorium',
            'lestari_lounge'
        ) NOT NULL,
        capacity INT NOT NULL,
        location VARCHAR(100) NOT NULL,
        price SMALLINT UNSIGNED NOT NULL,
        status ENUM ('available', 'booked', 'maintenance') NOT NULL,
        CONSTRAINT roomName UNIQUE (room_number, type)
    );