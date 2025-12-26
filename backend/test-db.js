import pool from './src/config/database.js';

async function test() {
  try {
    console.log("Testing DB connection...");
    const res = await pool.query('SELECT 1 as val');
    console.log("Result:", res.rows);
  } catch (err) {
    console.error("DB Error:", err);
  }
}

test();
