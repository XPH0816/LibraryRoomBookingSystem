-- Add up migration script here
INSERT INTO
    room (
        room_number,
        type,
        capacity,
        location,
        price,
        status
    )
VALUES
    ('1', 'iqra_room', 1, 'level 2', 2000, 'available'),
    ('1', 'hikmah_room', 5, 'level 3', 0, 'available'),
    ('1', 'eksplorasi_room', 10, 'level 3', 0, 'available'),
    ('0', 'big_stage', 100, 'level 2', 0, 'available'),
    ('1', 'lestari_room', 50, 'level 3', 0, 'available'),
    ('2', 'lestari_room', 50, 'level 3', 0, 'available'),
    ('0' ,'lestari_lounge', 50, 'level 3', 0, 'available'),
    ('0' ,'auditorium', 50, 'level 2', 0, 'available');