import pool from '../config/db.js';
import bcrypt from 'bcrypt';

// Admin credentials (bisa di-setup via seed atau hardcoded untuk saat ini)
// Untuk production, disimpan di database dengan password ter-hash
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Ganti di production!

export const verifyAdmin = async (username, password) => {
  // Simple in-memory verification untuk MVP
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return { admin_id: 1, username: ADMIN_USERNAME, role: 'admin' };
  }
  return null;
};
