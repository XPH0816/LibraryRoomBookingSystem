-- Add down migration script here
DELETE FROM admin WHERE username = 'admin';
ALTER TABLE admin AUTO_INCREMENT = 1;