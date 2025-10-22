-- Create database
CREATE DATABASE escape_room_db;

-- Use the database
\c escape_room_db;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create teams table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create team_members table (many-to-many relationship)
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

-- Create game stages table
CREATE TABLE game_stages (
    id SERIAL PRIMARY KEY,
    stage_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    puzzle_text TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create team progress table
CREATE TABLE team_progress (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    current_stage INTEGER DEFAULT 1,
    completed_stages INTEGER[] DEFAULT '{}',
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    final_code_submitted BOOLEAN DEFAULT FALSE,
    final_submission_time TIMESTAMP,
    final_code_attempt TEXT,
    is_locked BOOLEAN DEFAULT FALSE,
    locked_by INTEGER REFERENCES users(id),
    locked_at TIMESTAMP,
    UNIQUE(team_id)
);

-- Create submission attempts table
CREATE TABLE submission_attempts (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    submitted_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin announcements table
CREATE TABLE admin_announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    announcement_type VARCHAR(50) DEFAULT 'info',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create event status table
CREATE TABLE event_status (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) DEFAULT 'Escape Room Challenge',
    is_active BOOLEAN DEFAULT TRUE,
    is_completed BOOLEAN DEFAULT FALSE,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    winner_team_id INTEGER REFERENCES teams(id),
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Create final escape codes table
CREATE TABLE final_escape_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quizzes table
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quiz_link VARCHAR(255) UNIQUE NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    total_time_minutes INTEGER DEFAULT 30,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quiz questions table
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    time_limit_seconds INTEGER DEFAULT 120
);

-- Create quiz submissions table
CREATE TABLE quiz_submissions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    team_name VARCHAR(255) NOT NULL,
    answers TEXT[],
    score INTEGER DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Create basic indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_teams_name ON teams(name);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);

-- Insert initial event status
INSERT INTO event_status (event_name, is_active) VALUES ('Escape Room Challenge 2024', true);

-- Create quiz settings table
CREATE TABLE quiz_settings (
    id SERIAL PRIMARY KEY,
    settings JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO users (email, password, name) VALUES 
('admin@escaperoom.com', 'admin123', 'Admin User');