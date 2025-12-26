// Seed script to add sample data to SQLite database
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();
import bcrypt from 'bcrypt';
import path from 'path';

const dbPath = path.resolve('database.sqlite');
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function seed() {
  console.log('🌱 Seeding database...');
  console.log(`📁 Database path: ${dbPath}`);

  try {
    // Create tables if they don't exist
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
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
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'pending',
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, event_id)
      )
    `);

    // Check if admin user exists
    const existingAdmin = await all("SELECT * FROM users WHERE email = 'admin@telueve.com'");

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await run(
        "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)",
        ['Admin Telueve', 'admin@telueve.com', hashedPassword, 'admin']
      );
      console.log('✅ Admin user created: admin@telueve.com / admin123');
    }

    // Check if test user exists
    const existingUser = await all("SELECT * FROM users WHERE email = 'user@telueve.com'");

    if (existingUser.length === 0) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      await run(
        "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)",
        ['Test User', 'user@telueve.com', hashedPassword, 'user']
      );
      console.log('✅ Test user created: user@telueve.com / user123');
    }

    // Check if we have events
    const existingEvents = await all("SELECT COUNT(*) as count FROM events");

    if (existingEvents[0].count === 0) {
      // Insert sample events
      const events = [
        {
          nama_event: 'Tech Talk: Introduction to AI',
          waktu_event: '2025-01-15 09:00:00',
          deskripsi: 'An introductory session about artificial intelligence and its applications in modern technology. Learn about machine learning, neural networks, and the future of AI.',
          tanggal_event: '2025-01-15',
          jam_mulai: '09:00',
          jam_selesai: '12:00',
          tempat: 'Auditorium A',
          kuota_peserta: 100,
          status: 'published'
        },
        {
          nama_event: 'Workshop: Web Development with Next.js',
          waktu_event: '2025-01-20 13:00:00',
          deskripsi: 'Hands-on workshop covering React, Next.js, and modern web development practices. Build a complete application from scratch.',
          tanggal_event: '2025-01-20',
          jam_mulai: '13:00',
          jam_selesai: '17:00',
          tempat: 'Computer Lab 1',
          kuota_peserta: 30,
          status: 'published'
        },
        {
          nama_event: 'Career Fair 2025',
          waktu_event: '2025-02-01 08:00:00',
          deskripsi: 'Meet top companies and explore career opportunities. Bring your CV! Network with industry professionals and discover internship opportunities.',
          tanggal_event: '2025-02-01',
          jam_mulai: '08:00',
          jam_selesai: '16:00',
          tempat: 'Main Hall',
          kuota_peserta: 500,
          status: 'published'
        },
        {
          nama_event: 'Music Night: Campus Talent Show',
          waktu_event: '2025-02-14 19:00:00',
          deskripsi: 'An evening of live music performances by student bands and solo artists. Celebrate Valentine\'s Day with amazing music and performances.',
          tanggal_event: '2025-02-14',
          jam_mulai: '19:00',
          jam_selesai: '22:00',
          tempat: 'Open Stage',
          kuota_peserta: 200,
          status: 'published'
        },
        {
          nama_event: 'Hackathon: Code for Good',
          waktu_event: '2025-02-22 08:00:00',
          deskripsi: '48-hour hackathon focused on building solutions for social good. Prizes for top teams! Free food and drinks provided.',
          tanggal_event: '2025-02-22',
          jam_mulai: '08:00',
          jam_selesai: '20:00',
          tempat: 'Innovation Hub',
          kuota_peserta: 150,
          status: 'published'
        }
      ];

      for (const event of events) {
        await run(
          `INSERT INTO events (nama_event, waktu_event, deskripsi, tanggal_event, jam_mulai, jam_selesai, tempat, kuota_peserta, status, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [event.nama_event, event.waktu_event, event.deskripsi, event.tanggal_event, event.jam_mulai, event.jam_selesai, event.tempat, event.kuota_peserta, event.status, 1]
        );
      }
      console.log('✅ Sample events created (5 events)');
    } else {
      console.log(`ℹ️  Events already exist (${existingEvents[0].count} events), skipping seed`);
    }

    console.log('🌱 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }

  db.close();
  process.exit(0);
}

seed();
