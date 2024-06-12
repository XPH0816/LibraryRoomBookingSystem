-- Add up migration script here
INSERT INTO
    admin (username, password, email, phone)
VALUES
    (
        'admin',
        '$2a$12$AM1UXtvoMLfu1L59iWagFe/vnN.G.5iP6PqNA4OUz/OG4xZ.w8zG.',
        'admin@gmail.com',
        '123456789'
    );