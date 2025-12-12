import pool from './src/config/db.js';
import bcrypt from 'bcrypt';

const createAdmin = async () => {
  try {
    // Create admins table if not exists
    console.log('📋 Creating admins table if not exists...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        admin_id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Admins table ready\n');

    // Check if admin already exists
    const checkAdmin = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      ['admin']
    );

    if (checkAdmin.rows.length > 0) {
      console.log('⚠️  Admin "admin" already exists!');
      console.log('Username: admin');
      console.log('If you forgot password, delete and run this script again.\n');
      await pool.end();
      process.exit(0);
    }

    // Hash password
    const username = 'admin';
    const password = 'admin123'; // Change this!
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin
    console.log('👤 Creating new admin...');
    await pool.query(
      'INSERT INTO admins (username, password, created_at) VALUES ($1, $2, NOW())',
      [username, hashedPassword]
    );

    console.log('✅ Admin created successfully!\n');
    console.log('🔐 Login credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Change the password in production!\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

createAdmin();