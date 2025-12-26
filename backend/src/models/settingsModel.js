import pool from '../config/database.js';

export const initSettingsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `;
  try {
    await pool.query(query);

    // Seed default settings if not exists
    const defaults = [
      { key: 'site_name', value: 'Telueve Event Campus' },
      { key: 'maintenance_mode', value: 'false' },
      { key: 'registration_open', value: 'true' }
    ];

    for (const setting of defaults) {
      await pool.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT(key) DO NOTHING',
        [setting.key, setting.value]
      );
    }

    console.log("✅ Settings table initialized");
  } catch (err) {
    console.error("❌ Failed to init settings table:", err);
  }
};
