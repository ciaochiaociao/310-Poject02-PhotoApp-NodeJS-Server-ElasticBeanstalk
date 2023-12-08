select now();
-- CREATE DATABASE photoapp-- 
USE photoapp;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM assets;
SELECT * FROM users JOIN assets ON users.userid = assets.userid;