import pool from '../config/database.js';

export const initAnnouncementsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS announcements (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("✅ Announcements table initialized");
  } catch (err) {
    console.error("❌ Failed to init announcements table:", err);
  }
};
