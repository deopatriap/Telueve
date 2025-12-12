import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password diperlukan' });
    }

    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const admin = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { admin_id: admin.admin_id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      admin: {
        admin_id: admin.admin_id,
        username: admin.username
      }
    });

  } catch (err) {
    console.error('Error login admin:', err);
    res.status(500).json({ error: err.message });
  }
};

// Middleware: Verify Admin Token
export const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.admin = decoded;
    next();

  } catch (err) {
    console.error('Error verify token:', err);
    return res.status(403).json({ error: 'Token tidak valid atau expired' });
  }
};

// Get All Events (Admin) - FIXED
export const getEventsAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id as event_id,
        nama_event,
        tanggal_event,
        jam_mulai,
        jam_selesai,
        tempat,
        deskripsi,
        waktu_event,
        created_at,
        updated_at
      FROM events 
      ORDER BY tanggal_event DESC, jam_mulai DESC
    `);
    
    // Return array directly (not wrapped in object)
    res.json(result.rows);
  } catch (err) {
    console.error('Error get events admin:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add Event - FIXED
export const addEvent = async (req, res) => {
  try {
    const { nama_event, tanggal_event, jam_mulai, jam_selesai, tempat, deskripsi } = req.body;

    // Validasi input
    if (!nama_event || !tanggal_event || !jam_mulai || !jam_selesai || !tempat) {
      return res.status(400).json({ 
        error: 'Semua field wajib diisi (nama_event, tanggal_event, jam_mulai, jam_selesai, tempat)' 
      });
    }

    // Gabungkan tanggal dan jam untuk waktu_event
    const waktu_event = `${tanggal_event} ${jam_mulai}`;

    // Get admin_id dari token
    const created_by = req.admin.admin_id;

    const query = `
      INSERT INTO events 
      (nama_event, waktu_event, deskripsi, created_by, tanggal_event, jam_mulai, jam_selesai, tempat, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
      RETURNING 
        id as event_id,
        nama_event,
        tanggal_event,
        jam_mulai,
        jam_selesai,
        tempat,
        deskripsi,
        waktu_event,
        created_at
    `;

    const result = await pool.query(query, [
      nama_event,
      waktu_event,
      deskripsi || '',
      created_by,
      tanggal_event,
      jam_mulai,
      jam_selesai,
      tempat
    ]);

    res.status(201).json({
      message: 'Event berhasil ditambahkan',
      event: result.rows[0]
    });

  } catch (err) {
    console.error('Error add event:', err);
    res.status(500).json({ error: err.message });
  }
};

// Edit Event - FIXED
export const editEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    const { nama_event, tanggal_event, jam_mulai, jam_selesai, tempat, deskripsi } = req.body;

    // Validasi input
    if (!nama_event || !tanggal_event || !jam_mulai || !jam_selesai || !tempat) {
      return res.status(400).json({ 
        error: 'Semua field wajib diisi (nama_event, tanggal_event, jam_mulai, jam_selesai, tempat)' 
      });
    }

    // Validasi event_id
    if (!event_id || event_id === 'undefined') {
      return res.status(400).json({ error: 'Event ID tidak valid' });
    }

    // Gabungkan tanggal dan jam untuk waktu_event
    const waktu_event = `${tanggal_event} ${jam_mulai}`;

    const query = `
      UPDATE events 
      SET nama_event = $1, 
          waktu_event = $2, 
          deskripsi = $3, 
          tanggal_event = $4, 
          jam_mulai = $5, 
          jam_selesai = $6, 
          tempat = $7, 
          updated_at = NOW() 
      WHERE id = $8 
      RETURNING 
        id as event_id,
        nama_event,
        tanggal_event,
        jam_mulai,
        jam_selesai,
        tempat,
        deskripsi,
        waktu_event,
        created_at,
        updated_at
    `;

    const result = await pool.query(query, [
      nama_event,
      waktu_event,
      deskripsi || '',
      tanggal_event,
      jam_mulai,
      jam_selesai,
      tempat,
      event_id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event tidak ditemukan' });
    }

    res.json({
      message: 'Event berhasil diupdate',
      event: result.rows[0]
    });

  } catch (err) {
    console.error('Error edit event:', err);
    res.status(500).json({ error: err.message });
  }
};

// Remove Event - FIXED
export const removeEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    // Validasi event_id
    if (!event_id || event_id === 'undefined') {
      return res.status(400).json({ error: 'Event ID tidak valid' });
    }

    const query = `
      DELETE FROM events 
      WHERE id = $1 
      RETURNING 
        id as event_id,
        nama_event,
        tanggal_event,
        jam_mulai,
        jam_selesai,
        tempat
    `;
    
    const result = await pool.query(query, [event_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event tidak ditemukan' });
    }

    res.json({
      message: 'Event berhasil dihapus',
      event: result.rows[0]
    });

  } catch (err) {
    console.error('Error remove event:', err);
    res.status(500).json({ error: err.message });
  }
};