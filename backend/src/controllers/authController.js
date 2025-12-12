// controllers/authController.js
import { createUser, findUserByEmail } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    // Validasi input
    if (!nama || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Semua field harus diisi" 
      });
    }

    // Cek user sudah ada
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: "Email sudah terdaftar" 
      });
    }

    // Buat user baru
    const user = await createUser(nama, email, password);

    // Generate JWT token - PERBAIKAN: gunakan user_id yang konsisten
    const token = jwt.sign(
      { 
        user_id: user.id, 
        email: user.email,
        role: user.role || 'participant',
        username: user.nama
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      user: { 
        id: user.id, 
        nama: user.nama, 
        email: user.email,
        role: user.role || 'participant'
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ 
      success: false,
      message: "Terjadi kesalahan server", 
      error: err.message 
    });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email dan password wajib diisi" 
      });
    }

    // Cari user berdasarkan email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Email atau password salah" 
      });
    }

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Email atau password salah" 
      });
    }

    // Generate JWT token - PERBAIKAN: gunakan user_id yang konsisten
    const token = jwt.sign(
      { 
        user_id: user.id, 
        email: user.email,
        role: user.role || 'participant',
        username: user.nama
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      user: { 
        id: user.id, 
        nama: user.nama, 
        email: user.email,
        role: user.role || 'participant'
      },
      token,
    });
  } catch (err) {
    console.error("Login user error:", err);
    res.status(500).json({ 
      success: false,
      message: "Terjadi kesalahan server", 
      error: err.message 
    });
  }
};

// LOGIN ADMIN
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Username dan password wajib diisi" 
      });
    }

    // Cek kredensial admin
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ 
        success: false,
        message: "Username atau password admin salah" 
      });
    }

    // Cari atau buat user admin di database
    let adminUser;
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        ['admin@eventcampus.com']
      );
      
      if (result.rows.length > 0) {
        adminUser = result.rows[0];
      } else {
        // Buat user admin baru jika belum ada
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const insertResult = await pool.query(
          "INSERT INTO users (nama, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
          ['Admin', 'admin@eventcampus.com', hashedPassword, 'admin']
        );
        adminUser = insertResult.rows[0];
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Fallback jika database error
      adminUser = { id: 1, nama: 'Admin', email: 'admin@eventcampus.com', role: 'admin' };
    }

    // PERBAIKAN: Generate JWT token admin dengan struktur yang sama seperti user
    const token = jwt.sign(
      { 
        user_id: adminUser.id,
        email: adminUser.email,
        role: 'admin',
        username: ADMIN_USERNAME
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login admin berhasil",
      user: {
        id: adminUser.id,
        nama: adminUser.nama,
        email: adminUser.email,
        role: 'admin'
      },
      token,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Terjadi kesalahan server", 
      error: err.message 
    });
  }
};