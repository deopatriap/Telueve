// models/registrationModel.js
import pool from '../config/database.js';

// ======================================================
// CREATE REGISTRATION
// ======================================================
export const createRegistrationDB = async ({ event_id, user_id, name, email }) => {
  const query = `
    INSERT INTO registrations (event_id, user_id, name, email, status, created_at)
    VALUES ($1, $2, $3, $4, 'pending', NOW())
    RETURNING *
  `;
  const result = await pool.query(query, [
    event_id,
    user_id,
    name,
    email
  ]);
  return result.rows[0];
};

// ======================================================
// GET registrations by event
// ======================================================
export const getRegistrationsByEventDB = async (eventId) => {
  const query = `
    SELECT *
    FROM registrations
    WHERE event_id = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [eventId]);
  return result.rows;
};

// ======================================================
// GET all registrations
// ======================================================
export const getAllRegistrationsDB = async () => {
  const query = `
    SELECT *
    FROM registrations
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// ======================================================
// GET my registrations
// ======================================================
export const getMyRegistrationsDB = async (userId) => {
  const query = `
    SELECT *
    FROM registrations
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// ======================================================
// DELETE registration by event + user
// ======================================================
export const deleteRegistrationByEventAndUserDB = async (eventId, userId) => {
  const query = `
    DELETE FROM registrations
    WHERE event_id = $1 AND user_id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [eventId, userId]);
  return result.rows[0] || null;
};

// ======================================================
// DELETE registration by ID
// ======================================================
export const deleteRegistrationByIdDB = async (registrationId) => {
  const query = `
    DELETE FROM registrations
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [registrationId]);
  return result.rows[0] || null;
};

// ======================================================
// UPDATE registration status (FIXED: typo *A → *)
// ======================================================
export const updateRegistrationStatusDB = async (registrationId, status) => {
  const query = `
    UPDATE registrations
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [status, registrationId]);
  return result.rows[0] || null;
};
