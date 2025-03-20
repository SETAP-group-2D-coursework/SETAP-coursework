--------- CREATE ENUM TYPES ---------

CREATE TYPE
    meeting_status AS ENUM ('Scheduled', 'Cancelled');

CREATE TYPE
    day AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

CREATE TYPE
    notification_status AS ENUM ('Sent', 'Failed');

CREATE TYPE
    notification_type AS ENUM ('Meeting Reminder', 'Missed Meeting', 'General');


--------- CREATE TABLES ---------

CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        user_username VARCHAR(50) NOT NULL,
        user_email VARCHAR(150) NOT NULL,
        user_password VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
       
CREATE TABLE rooms(
    room_id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    room_name VARCHAR(50) NOT NULL,
    invite_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE notifications(
    notification_id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    notification_type notification_type NOT NULL,
    message TEXT,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notification_status notification_status NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE meetings (
    meeting_id SERIAL PRIMARY KEY,
    room_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    meeting_location TEXT,
    meeting_status meeting_status NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms (room_id)
);


CREATE TABLE availability(
    availability_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    meeting_id INT NOT NULL,
    day day NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (meeting_id) REFERENCES meetings (meeting_id)
);


CREATE TABLE notes(
    note_id SERIAL PRIMARY KEY NOT NULL,
    room_id INT NOT NULL,
    content TEXT NULL,
    attachment VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_by TIMESTAMP NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

CREATE TABLE meeting_participants(
    meeting_id INT NOT NULL,
    user_id INT NOT NULL,
    availability_id INT NOT NULL,
    is_attending boolean,
    notified_at TIMESTAMP NOT NULL,
    FOREIGN KEY (meeting_id) REFERENCES meetings (meeting_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (availability_id) REFERENCES availability (availability_id)
);

CREATE TABLE room_participants(
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    joined_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (room_id) REFERENCES rooms (room_id)
);

--Role creation for database access 
CREATE ROLE slotify_team WITH LOGIN PASSWORD 'team_password';
ALTER ROLE slotify_team CREATEDB;
ALTER ROLE slotify_team CREATEROLE;

--Creating slotify database
createdb -U slotify_team slotify_db


--Granting ownership to setap team
ALTER DATABASE slotify_db OWNER TO slotify_team;
GRANT ALL PRIVILEGES ON DATABASE slotify_db TO slotify_team;

--Connect to new databse 
psql -U slotify_team -d slotify_db


