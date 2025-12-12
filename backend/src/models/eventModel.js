import pool from '../config/database.js';

// Create Event
export const createEvent = async ({
  nama_event,
  tanggal_event,
  jam_mulai,
  jam_selesai,
  tempat,
  deskripsi,
  created_by,
  kuota_peserta,
  status
}) => {
  const waktu_event = tanggal_event && jam_mulai ? `${tanggal_event} ${jam_mulai}` : null;

  const query = `
    INSERT INTO events 
    (nama_event, waktu_event, deskripsi, created_by, tanggal_event, jam_mulai, jam_selesai, tempat, kuota_peserta, created_at, updated_at) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
    RETURNING id
  `;

  const result = await pool.query(query, [
    nama_event,
    waktu_event,
    deskripsi || null,
    created_by,
    tanggal_event || null,
    jam_mulai || null,
    jam_selesai || null,
    tempat,
    kuota_peserta || null
  ]);

  return { id: result.rows[0].id };
};

// Update Event
export const updateEvent = async (event_id, data) => {
  const { nama_event, tanggal_event, jam_mulai, jam_selesai, tempat, deskripsi, kuota_peserta, status } = data;
  const waktu_event = tanggal_event && jam_mulai ? `${tanggal_event} ${jam_mulai}` : null;

  const query = `
    UPDATE events 
    SET nama_event = $1,
        waktu_event = $2,
        deskripsi = $3,
        tanggal_event = $4,
        jam_mulai = $5,
        jam_selesai = $6,
        tempat = $7,
        kuota_peserta = $8,
        updated_at = NOW()
    WHERE id = $9
    RETURNING *
  `;

  const result = await pool.query(query, [
    nama_event,
    waktu_event,
    deskripsi || null,
    tanggal_event || null,
    jam_mulai || null,
    jam_selesai || null,
    tempat,
    kuota_peserta || null,
    event_id
  ]);

  return result.rows[0];
};

// Delete Event
export const deleteEvent = async (event_id) => {
  const query = `DELETE FROM events WHERE id = $1 RETURNING *`;
  const result = await pool.query(query, [event_id]);
  return result.rows[0];
};

// Get All Events
export const getAllEvents = async () => {
  const query = `
    SELECT e.*, 
           u.username as organizer_name,
           u.nama_lengkap as organizer_full_name
    FROM events e
    LEFT JOIN users u ON e.created_by = u.id
    ORDER BY e.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Get Event by ID
export const getEventById = async (event_id) => {
  const query = `
    SELECT e.*, 
           u.username as organizer_name,
           u.nama_lengkap as organizer_full_name,
           u.email as organizer_email
    FROM events e
    LEFT JOIN users u ON e.created_by = u.id
    WHERE e.id = $1
  `;
  const result = await pool.query(query, [event_id]);
  return result.rows[0];
};

// Get Events by Organizer
export const getEventsByOrganizer = async (created_by) => {
  const query = `
    SELECT e.*,
           COUNT(DISTINCT r.id) as total_registrations,
           COUNT(DISTINCT CASE WHEN r.status = 'accepted' THEN r.id END) as accepted_registrations
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
    WHERE e.created_by = $1
    GROUP BY e.id
    ORDER BY e.created_at DESC
  `;
  const result = await pool.query(query, [created_by]);
  return result.rows;
};