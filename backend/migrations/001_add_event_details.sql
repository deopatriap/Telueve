-- Migration: Add new columns to events table for admin panel
-- This adds support for separate date/time/location fields

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS tanggal_event DATE;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS jam_mulai TIME;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS jam_selesai TIME;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS tempat VARCHAR(255);

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS kuota_peserta INT DEFAULT NULL;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create index untuk better performance
CREATE INDEX IF NOT EXISTS idx_events_tanggal ON events(tanggal_event);
CREATE INDEX IF NOT EXISTS idx_events_tempat ON events(tempat);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);