-- Add down migration script here
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE room;
SET FOREIGN_KEY_CHECKS = 1;