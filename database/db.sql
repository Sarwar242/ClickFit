
CREATE DATABASE IF NOT EXISTS clickfit_db;
USE clickfit_db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    type ENUM('admin', 'trainer', 'member') NOT NULL DEFAULT 'member',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Add indexes for better performance
    INDEX idx_email (email),
    INDEX idx_type (type),
    INDEX idx_active (active)
);

-- ============================================
-- Create Stored Procedure: addUser
-- ============================================

DELIMITER //

DROP PROCEDURE IF EXISTS addUser//

CREATE PROCEDURE addUser(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_type ENUM('admin', 'trainer', 'member'),
    IN p_active BOOLEAN,
    OUT p_userId INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'Error occurred during user creation';
        SET p_userId = NULL;
    END;

    START TRANSACTION;
    
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
        SET p_success = FALSE;
        SET p_message = 'Email already exists';
        SET p_userId = NULL;
        ROLLBACK;
    ELSE
        -- Insert new user
        INSERT INTO users (email, password, type, active)
        VALUES (p_email, p_password, IFNULL(p_type, 'member'), IFNULL(p_active, TRUE));
        
        SET p_userId = LAST_INSERT_ID();
        SET p_success = TRUE;
        SET p_message = 'User created successfully';
        
        COMMIT;
    END IF;
    
END//

DELIMITER ;

CALL addUser(
    'john.doe@example.com', 
    'hashed_password_123', 
    'member', 
    TRUE, 
    @user_id, 
    @success, 
    @message
);


SELECT @user_id as userId, @success as success, @message as message;

-- Verify the users table

SELECT * FROM users;



