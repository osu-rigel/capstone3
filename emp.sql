/*
https://remotemysql/myphpadmin.com
*/
CREATE TABLE IF NOT EXISTS emp_user
(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    image varchar(255) NOT NULL,
 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS users
(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    award_allow VARCHAR(1) NOT NULL DEFAULT '1',
    user_type VARCHAR(1) NOT NULL DEFAULT '1'
     
);

CREATE TABLE IF NOT EXISTS admin
(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
 
);

CREATE TABLE IF NOT EXISTS emp_admin
(
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




CREATE TABLE IF NOT EXISTS emp_award
(
    award_id INT AUTO_INCREMENT PRIMARY KEY,
    awardee_name VARCHAR(100) NOT NULL,
    awardee_email VARCHAR(100) NOT NULL ,
    email VARCHAR(100) NOT NULL UNIQUE,
    giver_id INT NOT NULL,                          # this will be a foriegn key from user table
    award_date DATE NOT NULl,
    award_time TIME NOT NULL,
    award_type INT  NOT NULL,
    FOREIGN KEY (giver_id) REFERENCES emp_user(user_id)
 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




CRETE TABLE IF NOT EXISTS award_info 
(
	award_type_id INT NOT NULL,
	award_category VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;