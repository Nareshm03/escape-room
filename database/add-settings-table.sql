-- Add quiz_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS quiz_settings (
    id SERIAL PRIMARY KEY,
    settings JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);