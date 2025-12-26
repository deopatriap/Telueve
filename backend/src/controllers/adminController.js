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

    // Environment-based admin credentials (primary method)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    // Check against environment credentials first
    console.log('Login attempt:', { username, password });
    console.log('Expected env:', { ADMIN_USERNAME, ADMIN_PASSWORD });

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { admin_id: 1, username: ADMIN_USERNAME, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        message: 'Login berhasil',
        token,
        admin: {
          admin_id: 1,
          username: ADMIN_USERNAME
        }
      });
    }

    // Fallback: Check database admins table if exists
    try {
      const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);

      if (result.rows.length > 0) {
        const admin = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (isPasswordValid) {
          const token = jwt.sign(
            { admin_id: admin.admin_id || admin.id, username: admin.username, role: 'admin' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
          );

          return res.json({
            success: true,
            message: 'Login berhasil',
            token,
            admin: {
              admin_id: admin.admin_id || admin.id,
              username: admin.username
            }
          });
        }
      }
    } catch (dbErr) {
      // If admins table doesn't exist, ignore and fall through to error
      console.log('Admins table not found, using env-based auth only');
    }

    // If we get here, credentials are invalid
    return res.status(401).json({
      success: false,
      message: 'Username atau password salah'
    });

  } catch (err) {
    console.error('Error login admin:', err);
    res.status(500).json({ success: false, message: err.message, error: err.message });
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

// Get All Events (Admin) - FIXED with CACHING
export const getEventsAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
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
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, NOW())
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

    invalidateCache(['events', 'stats']); // Invalidate cache

    res.json({
      message: 'Event berhasil dihapus',
      event: result.rows[0]
    });

  } catch (err) {
    console.error('Error remove event:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get Dashboard Stats - NEW
export const getDashboardStats = async (req, res) => {
  try {
    // Parallel queries for performance
    const [usersRes, eventsRes, registrationsRes, pendingRes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM events'),
      pool.query('SELECT COUNT(*) FROM registrations'),
      pool.query("SELECT COUNT(*) FROM registrations WHERE status = 'pending'")
    ]);

    const stats = {
      totalUsers: parseInt(usersRes.rows[0].count),
      totalEvents: parseInt(eventsRes.rows[0].count),
      totalRegistrations: parseInt(registrationsRes.rows[0].count),
      pendingRegistrations: parseInt(pendingRes.rows[0].count)
    };

    res.json(stats);
  } catch (err) {
    console.error('Error get dashboard stats:', err);
    res.status(500).json({ error: err.message });
  }
};

// ============================
// USER MANAGEMENT
// ============================

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error get all users:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update User Role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    // ... impl ... 
    const { nama, email } = req.body;
    await pool.query('UPDATE users SET nama = $1, email = $2 WHERE id = $3', [nama, email, userId]);
    invalidateCache(['stats']); // Invalidate stats just in case
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error update user:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete registrations first (manual cascade if needed, though DB might handle it)
    await pool.query('DELETE FROM registrations WHERE user_id = $1', [userId]);

    // Delete user
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    invalidateCache(['stats']); // Invalidate stats
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error delete user:', err);
    res.status(500).json({ error: err.message });
  }
};

// ============================
// ANNOUNCEMENTS
// ============================

// Get All Announcements (Admin)
export const getAllAnnouncements = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error get announcements:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create Announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, active } = req.body;
    await pool.query(
      'INSERT INTO announcements (title, content, type, active) VALUES ($1, $2, $3, $4)',
      [title, content, type || 'info', active !== undefined ? active : true]
    );
    res.status(201).json({ message: 'Announcement created' });
  } catch (err) {
    console.error('Error create announcement:', err);
    res.status(500).json({ error: err.message });
  }
};

// Toggle Active Status
export const toggleAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    await pool.query('UPDATE announcements SET active = $1 WHERE id = $2', [active, id]);
    res.json({ message: 'Announcement status updated' });
  } catch (err) {
    console.error('Error toggle announcement:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete Announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    console.error('Error delete announcement:', err);
    res.status(500).json({ error: err.message });
  }
};

// ============================
// SETTINGS
// ============================

// Get All Settings
export const getSettings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings');
    // Convert to object
    const settings = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    // Convert booleans
    if (settings.maintenance_mode) settings.maintenance_mode = settings.maintenance_mode === 'true';
    if (settings.registration_open) settings.registration_open = settings.registration_open === 'true';

    res.json(settings);
  } catch (err) {
    console.error('Error get settings:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update Settings
export const updateSettings = async (req, res) => {
  try {
    const settings = req.body;

    for (const key in settings) {
      let val = settings[key];
      // Convert bool to string
      if (typeof val === 'boolean') val = val.toString();

      await pool.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = $2',
        [key, val]
      );
    }

    res.json({ message: 'Settings updated' });
  } catch (err) {
    console.error('Error update settings:', err);
    res.status(500).json({ error: err.message });
  }
};