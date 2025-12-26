ALTER TABLE events ADD COLUMN category TEXT DEFAULT 'General';
UPDATE events SET category = 'Academic' WHERE nama_event LIKE '%Tech%' OR nama_event LIKE '%Workshop%';
UPDATE events SET category = 'Social' WHERE nama_event LIKE '%Music%' OR nama_event LIKE '%Night%';
UPDATE events SET category = 'Technology' WHERE nama_event LIKE '%Hackathon%' OR nama_event LIKE '%Code%';
UPDATE events SET category = 'Seminar' WHERE nama_event LIKE '%Career%' OR nama_event LIKE '%Talk%';
