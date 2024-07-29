CREATE DATABASE keeper_app;


CREATE TABLE note (
    id SERIAL PRIMARY KEY,
    title varchar(45),
    content varchar(100)
);