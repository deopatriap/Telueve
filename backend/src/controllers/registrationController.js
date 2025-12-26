import pool from "../config/database.js";

/* ============================
   REGISTER FOR EVENT
============================ */
export const registerForEvent = async (req, res) => {
  try {
    console.log("=== REGISTER FOR EVENT DEBUG ===");
    console.log("🔍 Headers:", req.headers.authorization);
    console.log("🔍 req.user:", req.user);
    console.log("🔍 req.params:", req.params);
    console.log("🔍 req.body:", req.body);
    
    const userId = req.user.userId;
    const { eventId } = req.params;
    
    console.log("🔍 userId final:", userId);
    console.log("🔍 eventId final:", eventId);
    console.log("🔍 eventId type:", typeof eventId);

    // Validasi eventId
    if (!eventId || isNaN(eventId)) {
      console.log("❌ Event ID tidak valid");
      return res.status(400).json({ 
        success: false, 
        message: "Event ID tidak valid" 
      });
    }

    // Check if event exists
    console.log("🔍 Checking if event exists...");
    const eventResult = await pool.query("SELECT * FROM events WHERE id = $1", [eventId]);
    
    if (eventResult.rows.length === 0) {
      console.log("❌ Event tidak ditemukan");
      return res.status(404).json({ 
        success: false, 
        message: "Event tidak ditemukan" 
      });
    }

    const event = eventResult.rows[0];
    console.log("✅ Event found:", event.nama_event);

    // Check if already registered
    console.log("🔍 Checking if user already registered...");
    const existResult = await pool.query(
      "SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );

    if (existResult.rows.length > 0) {
      console.log("❌ User sudah terdaftar");
      return res.status(400).json({ 
        success: false, 
        message: "Anda sudah terdaftar di event ini" 
      });
    }

    // Check kuota
    console.log("🔍 Checking kuota...");
    const countResult = await pool.query(
      "SELECT COUNT(*) as total FROM registrations WHERE event_id = $1 AND status IN ('pending', 'accepted')",
      [eventId]
    );

    const currentRegistrations = parseInt(countResult.rows[0].total);
    console.log("📊 Current registrations:", currentRegistrations);
    console.log("📊 Kuota peserta:", event.kuota_peserta);

    if (event.kuota_peserta && currentRegistrations >= event.kuota_peserta) {
      console.log("❌ Kuota penuh");
      return res.status(400).json({
        success: false,
        message: "Kuota peserta sudah penuh"
      });
    }

    // Register user to event
    console.log("✅ Registering user to event...");
    await pool.query(
      "INSERT INTO registrations (user_id, event_id, status, registered_at) VALUES ($1, $2, 'pending', NOW())",
      [userId, eventId]
    );

    console.log("✅ Registration successful!");
    res.status(201).json({ 
      success: true, 
      message: "Berhasil mendaftar event. Menunggu konfirmasi organizer." 
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({ 
      success: false, 
      message: "Gagal mendaftar event",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ============================
   CANCEL REGISTRATION
============================ */
export const cancelRegistration = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { eventId } = req.params;

    // Check if registration exists
    const existResult = await pool.query(
      "SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );

    if (existResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Anda belum terdaftar di event ini" 
      });
    }

    // Delete registration
    await pool.query(
      "DELETE FROM registrations WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );

    res.json({ 
      success: true, 
      message: "Pendaftaran berhasil dibatalkan" 
    });
  } catch (error) {
    console.error("Cancel registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Gagal membatalkan pendaftaran" 
    });
  }
};

/* ============================
   GET MY REGISTRATIONS
============================ */
export const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT 
        r.id,
        r.status,
        r.registered_at,
        e.id as event_id,
        e.nama_event,
        e.deskripsi,
        e.tanggal_event,
        e.waktu_event,
        e.jam_mulai,
        e.tempat,
        e.kuota_peserta
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = $1
      ORDER BY r.registered_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Get my registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data registrasi"
    });
  }
};

/* ============================
   CHECK MY REGISTRATION FOR EVENT
============================ */
export const checkMyRegistration = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { eventId } = req.params;

    const result = await pool.query(
      `SELECT 
        r.id,
        r.status,
        r.registered_at
      FROM registrations r
      WHERE r.user_id = $1 AND r.event_id = $2`,
      [userId, eventId]
    );

    res.json({
      success: true,
      isRegistered: result.rows.length > 0,
      registration: result.rows[0] || null
    });
  } catch (error) {
    console.error("Check registration error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengecek status registrasi"
    });
  }
};

/* ============================
   GET EVENT REGISTRATIONS (Organizer)
============================ */
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists and user is organizer of this event
    const eventResult = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event tidak ditemukan"
      });
    }

    const event = eventResult.rows[0];

    // If not admin, check if user is the organizer
    if (req.user.role !== 'admin' && event.created_by !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke event ini"
      });
    }

    // Get all registrations for this event
    const result = await pool.query(
      `SELECT 
        r.id,
        r.status,
        r.registered_at,
        u.id as user_id,
        u.nama,
        u.email
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = $1
      ORDER BY r.registered_at DESC`,
      [eventId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Get event registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data registrasi event"
    });
  }
};

/* ============================
   UPDATE REGISTRATION STATUS (Organizer)
============================ */
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid. Gunakan: pending, accepted, atau rejected"
      });
    }

    // Get registration with event info
    const result = await pool.query(
      `SELECT r.*, e.created_by 
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE r.id = $1`,
      [registrationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Registrasi tidak ditemukan"
      });
    }

    const registration = result.rows[0];

    // Check if user is organizer of this event or admin
    if (req.user.role !== 'admin' && registration.created_by !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengubah registrasi ini"
      });
    }

    // Update status
    await pool.query(
      "UPDATE registrations SET status = $1 WHERE id = $2",
      [status, registrationId]
    );

    res.json({
      success: true,
      message: `Status registrasi berhasil diubah menjadi ${status}`
    });
  } catch (error) {
    console.error("Update registration status error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengubah status registrasi"
    });
  }
};

/* ============================
   DELETE REGISTRATION (Admin)
============================ */
export const deleteRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;

    // Check if registration exists
    const result = await pool.query(
      "SELECT * FROM registrations WHERE id = $1",
      [registrationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Registrasi tidak ditemukan"
      });
    }

    // Delete registration
    await pool.query("DELETE FROM registrations WHERE id = $1", [registrationId]);

    res.json({
      success: true,
      message: "Registrasi berhasil dihapus"
    });
  } catch (error) {
    console.error("Delete registration error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus registrasi"
    });
  }
};

/* ============================
   GET REGISTRATION STATISTICS (Organizer)
============================ */
export const getRegistrationStatistics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'admin';

    let query;
    let params = [];

    if (isAdmin) {
      // Admin bisa lihat semua stats
      query = `
        SELECT 
          COUNT(*) as total_registrations,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM registrations
      `;
    } else {
      // Organizer hanya lihat stats event mereka
      query = `
        SELECT 
          COUNT(*) as total_registrations,
          SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN r.status = 'accepted' THEN 1 ELSE 0 END) as accepted,
          SUM(CASE WHEN r.status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE e.created_by = $1
      `;
      params = [userId];
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Get registration statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil statistik registrasi"
    });
  }
};
