import pool from "../config/database.js";

/* ============================
   GET ALL EVENTS
============================ */
export const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        e.*,
        u.nama as organizer_name,
        u.email as organizer_email,
        COUNT(DISTINCT r.id) as total_registrations,
        COUNT(DISTINCT CASE WHEN r.status = 'accepted' THEN r.id END) as accepted_registrations
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN registrations r ON e.id = r.event_id
      GROUP BY e.id, u.nama, u.email
      ORDER BY e.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Get all events error:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data events",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ============================
   GET EVENT BY ID
============================ */
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        e.*,
        u.nama as organizer_name,
        u.email as organizer_email,
        COUNT(DISTINCT r.id) as total_registrations,
        COUNT(DISTINCT CASE WHEN r.status = 'accepted' THEN r.id END) as accepted_registrations
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.id, u.nama, u.email`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Get event by id error:", error.message);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data event",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ============================
   GET UPCOMING EVENTS
============================ */
export const getUpcomingEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        e.*,
        u.nama as organizer_name,
        u.email as organizer_email,
        COUNT(DISTINCT r.id) as total_registrations,
        COUNT(DISTINCT CASE WHEN r.status = 'accepted' THEN r.id END) as accepted_registrations
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.tanggal_event >= CURRENT_DATE OR e.waktu_event >= NOW()
      GROUP BY e.id, u.nama, u.email
      ORDER BY COALESCE(e.tanggal_event, DATE(e.waktu_event)) ASC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Get upcoming events error:", error.message);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data upcoming events",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ============================
   SEARCH EVENTS
============================ */
export const searchEvents = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Query pencarian tidak boleh kosong"
      });
    }

    const searchTerm = `%${q}%`;

    const result = await pool.query(
      `SELECT 
        e.*,
        u.nama as organizer_name,
        u.email as organizer_email,
        COUNT(DISTINCT r.id) as total_registrations,
        COUNT(DISTINCT CASE WHEN r.status = 'accepted' THEN r.id END) as accepted_registrations
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.nama_event ILIKE $1 OR e.deskripsi ILIKE $2 OR e.tempat ILIKE $3
      GROUP BY e.id, u.nama, u.email
      ORDER BY e.created_at DESC`,
      [searchTerm, searchTerm, searchTerm]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Search events error:", error.message);
    res.status(500).json({
      success: false,
      message: "Gagal mencari events",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ============================
   CREATE EVENT (Organizer)
============================ */
export const createEvent = async (req, res) => {
  try {
    const {
      nama_event,
      deskripsi,
      tanggal_event,
      waktu_event,
      jam_mulai,
      jam_selesai,
      tempat
    } = req.body;

    const createdBy = req.user.userId;

    // Validasi input
    if (!nama_event || !tempat) {
      return res.status(400).json({
        success: false,
        message: "Nama event dan tempat harus diisi"
      });
    }

    if (!tanggal_event && !waktu_event) {
      return res.status(400).json({
        success: false,
        message: "Tanggal event atau waktu event harus diisi"
      });
    }

    // Insert event
    const result = await pool.query(
      `INSERT INTO events 
      (nama_event, deskripsi, tanggal_event, waktu_event, jam_mulai, jam_selesai, tempat, created_by, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id`,
      [
        nama_event,
        deskripsi || null,
        tanggal_event || null,
        waktu_event || null,
        jam_mulai || null,
        jam_selesai || null,
        tempat,
        createdBy
      ]
    );

    res.status(201).json({
      success: true,
      message: "Event berhasil dibuat",
      data: {
        id: result.rows[0].id
      }
    });
  } catch (error) {
    console.error("Create event error:", error.message);
    res.status(500).json({
      success: false,
      message: "Gagal membuat event",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ============================
   UPDATE EVENT (Organizer)
============================ */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_event,
      deskripsi,
      tanggal_event,
      waktu_event,
      jam_mulai,
      jam_selesai,
      tempat
    } = req.body;

    // Check if event exists
    const eventResult = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event tidak ditemukan"
      });
    }

    const event = eventResult.rows[0];

    // Check if user is creator of this event or admin
    if (req.user.role !== 'admin' && event.created_by !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengubah event ini"
      });
    }

    // Update event
    await pool.query(
      `UPDATE events 
      SET nama_event = $1, 
          deskripsi = $2, 
          tanggal_event = $3, 
          waktu_event = $4,
          jam_mulai = $5,
          jam_selesai = $6,
          tempat = $7,
          updated_at = NOW()
      WHERE id = $8`,
      [
        nama_event || event.nama_event,
        deskripsi !== undefined ? deskripsi : event.deskripsi,
        tanggal_event !== undefined ? tanggal_event : event.tanggal_event,
        waktu_event !== undefined ? waktu_event : event.waktu_event,
        jam_mulai !== undefined ? jam_mulai : event.jam_mulai,
        jam_selesai !== undefined ? jam_selesai : event.jam_selesai,
        tempat || event.tempat,
        id
      ]
    );

    res.json({
      success: true,
      message: "Event berhasil diupdate"
    });
  } catch (error) {
    console.error("Update event error:", error.message);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate event",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ============================
   DELETE EVENT (Organizer/Admin)
============================ */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const eventResult = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event tidak ditemukan"
      });
    }

    const event = eventResult.rows[0];

    // Check if user is creator of this event or admin
    if (req.user.role !== 'admin' && event.created_by !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk menghapus event ini"
      });
    }

    // Delete all registrations for this event first
    await pool.query("DELETE FROM registrations WHERE event_id = $1", [id]);

    // Delete event
    await pool.query("DELETE FROM events WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Event berhasil dihapus"
    });
  } catch (error) {
    console.error("Delete event error:", error.message);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus event",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
