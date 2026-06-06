CREATE DATABASE IF NOT EXISTS sail_vrs;
USE sail_vrs;

CREATE TABLE IF NOT EXISTS employees (
    employee_id     VARCHAR(20)  PRIMARY KEY,
    designation_type ENUM('Executive', 'Non-Executive') NOT NULL,
    dob             DATE         NOT NULL,
    doj             DATE         NOT NULL,
    basic_pay       DECIMAL(10, 2) NOT NULL,
    da              DECIMAL(10, 2) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    role            ENUM('Employee', 'Admin') NOT NULL DEFAULT 'Employee',
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grading_history (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    employee_id     VARCHAR(20)  NOT NULL,
    appraisal_year  VARCHAR(10)  NOT NULL,
    grade           VARCHAR(5)   NOT NULL,
    points          DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vrs_applications (
    application_id      INT AUTO_INCREMENT PRIMARY KEY,
    employee_id         VARCHAR(20)    NOT NULL,
    submission_timestamp TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    status              ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    formula_a_value     DECIMAL(12, 2) NOT NULL,
    formula_b_value     DECIMAL(12, 2) NOT NULL,
    final_compensation  DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);
