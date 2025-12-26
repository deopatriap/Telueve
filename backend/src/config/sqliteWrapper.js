import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();
import path from 'path';

class SQLitePool {
  constructor() {
    this.dbPath = path.resolve('database.sqlite');
    this.db = new sqlite3.Database(this.dbPath);
    console.log(`⚠️  Using SQLite database at ${this.dbPath}`);
    this.initPromise = this.init().catch(err => {
      console.error("❌ FATAL: SQLite Init Failed:", err);
      process.exit(1);
    });
  }

  async init() {
    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');

    // Create tables if they don't exist
    const createUsers = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createEvents = `
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_event TEXT NOT NULL,
        waktu_event DATETIME NOT NULL,
        deskripsi TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        tanggal_event DATE,
        jam_mulai TIME,
        jam_selesai TIME,
        tempat TEXT,
        kuota_peserta INTEGER,
        status TEXT DEFAULT 'draft',
        created_by INTEGER REFERENCES users(id)
      )
    `;

    // Future registration table
    const createRegistrations = `
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'pending',
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, event_id)
      )
    `;

    const createAnnouncements = `
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createSettings = `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `;

    await this.run(createUsers);
    await this.run(createEvents);
    await this.run(createRegistrations);
    await this.run(createAnnouncements);
    await this.run(createSettings);

    // Create Indexes for Performance
    await this.run('CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_events_nama ON events(nama_event)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  }

  connect() {
    return Promise.resolve(this);
  }

  // Mimic pg.query
  async query(text, params = []) {
    await this.initPromise;

    // 1. Convert PG params ($1, $2) to SQLite (?)
    let queryObj = this.convertQuery(text, params);
    let sql = queryObj.sql;
    let safeParams = queryObj.params;

    // 2. Handle RETURNING clause (simple emulation for INSERT/UPDATE)
    // SQLite supports RETURNING in recent versions, but node-sqlite3 might vary.
    // For safety with older libs, we might need separate SELECT. 
    // However, let's try standard execution first.

    return new Promise((resolve, reject) => {
      // Check if it's a SELECT or RETURNING
      const isSelect = /^\s*SELECT/i.test(sql) || /RETURNING/i.test(sql);

      // Simple heuristic: usage of RETURNING usually implies we want the row back.
      // node-sqlite3 'all' returns rows. 'run' returns context.

      if (isSelect || /RETURNING/i.test(sql)) {
        this.db.all(sql, safeParams, (err, rows) => {
          if (err) {
            console.error('SQLite Error:', err.message, '\nSQL:', sql);
            reject(err);
          } else {
            resolve({ rows: rows || [], rowCount: rows ? rows.length : 0 });
          }
        });
      } else {
        this.db.run(sql, safeParams, function (err) {
          if (err) {
            console.error('SQLite Error:', err.message, '\nSQL:', sql);
            reject(err);
          } else {
            // "this" contains lastID and changes
            resolve({ rows: [], rowCount: this.changes, lastID: this.lastID });
          }
        });
      }
    });
  }

  convertQuery(text, params) {
    // 1. Handle SQL syntax replacements first
    let sql = text
      .replace(/NOW\(\)/gi, "datetime('now', 'localtime')")
      .replace(/ILIKE/gi, 'LIKE')
      .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/BOOLEAN/gi, 'INTEGER')
      .replace(/true/gi, '1')
      .replace(/false/gi, '0')
      .replace(/Boolean\(/g, '')
      .replace(/::[a-z]+/g, '');

    // 2. Handle parameter mapping ($1 -> ?, $2 -> ?)
    // We need to rebuild the params array to match the order of ? appearance
    const newParams = [];

    // Replace $N with ? and populate newParams
    sql = sql.replace(/\$(\d+)/g, (match, number) => {
      const index = parseInt(number) - 1; // $1 is index 0
      if (index >= 0 && index < params.length) {
        newParams.push(params[index]);
        return '?';
      }
      return match; // Keep if invalid index (shouldn't happen)
    });

    // console.log(`[SQLite] Executing: ${sql.substring(0, 100)}...`);

    return { sql, params: newParams };
  }

  async run(sql, params = []) {
    // Apply conversion
    // For raw run(), we assume generic SQL or manual ? usage.
    // If it uses $N, we need to convert.
    const queryObj = this.convertQuery(sql, params);

    return new Promise((resolve, reject) => {
      this.db.run(queryObj.sql, queryObj.params, function (err) {
        if (err) {
          console.error('[SQLite] Run Error:', err.message);
          reject(err);
        }
        else resolve(this);
      });
    });
  }
}

export default new SQLitePool();
