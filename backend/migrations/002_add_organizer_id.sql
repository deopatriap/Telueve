-- Migration: Add organizer_id column to events table
-- This adds support for event organizer tracking

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS organizer_id INTEGER;

-- Add foreign key constraint (adjust if your users table is different)
ALTER TABLE events 
ADD CONSTRAINT fk_events_organizer 
FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);