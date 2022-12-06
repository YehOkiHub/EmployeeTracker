DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department  (

    id INT AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE role (

    id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY(department_id)
    REFERENCES department(id)
    ON DELETE CASCADE
);

CREATE TABLE employee (

    id INT AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT DEFAULT NULL,
    role_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id)
    REFERENCES role(id),
    FOREIGN KEY(manager_id)
    REFERENCES employee(id)

)