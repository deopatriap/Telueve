import db from "../config/database.js";
import bcrypt from "bcrypt";

// CREATE USER
export const createUser = async (nama, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(
    "INSERT INTO users (nama, email, password) VALUES ($1, $2, $3) RETURNING id, nama, email",
    [nama, email, hashedPassword]
  );

  return result.rows[0]; // ambil object user baru
};

// FIND USER BY EMAIL
export const findUserByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email]
  );

  return result.rows[0];
};

// GET ALL USERS
export const getAllUsers = async () => {
  const result = await db.query(
    "SELECT id, nama, email, created_at FROM users ORDER BY created_at DESC"
  );
  return result.rows;
};

// GET USER BY ID
export const getUserById = async (userId) => {
  const result = await db.query(
    "SELECT id, nama, email, created_at FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0];
};

// UPDATE USER
export const updateUser = async (userId, userData) => {
  const fields = [];
  const values = [];
  let i = 1;

  if (userData.nama) {
    fields.push(`nama = $${i++}`);
    values.push(userData.nama);
  }
  if (userData.email) {
    fields.push(`email = $${i++}`);
    values.push(userData.email);
  }
  if (userData.password) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    fields.push(`password = $${i++}`);
    values.push(hashedPassword);
  }

  values.push(userId);

  const result = await db.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${i} RETURNING id, nama, email`,
    values
  );

  return result.rows[0];
};

// DELETE USER
export const deleteUser = async (userId) => {
  const result = await db.query(
    "DELETE FROM users WHERE id = $1 RETURNING id",
    [userId]
  );
  return result.rows[0];
};
