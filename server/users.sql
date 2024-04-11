CREATE DATABASE users;
USE users;
CREATE TABLE login(
   id AUTO_INCREMENT PRIMARY KEY , 
   username VARCHAR(50) NOT NULL,
   password VARCHAR(50) NOT NULL
);

INSERT INTO login (username, password) VALUES ('alice','1234');