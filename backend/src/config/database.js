import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import sqlitePool from './sqliteWrapper.js';

dotenv.config();

const pgPool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

let activePool = pgPool;
let isPostgresConnected = false;

// Attempt PG connection
pgPool.connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL");
    isPostgresConnected = true;
    client.release();
  })
  .catch((err) => {
    console.warn("⚠️  PostgreSQL connection failed. Falling back to SQLite.");
    console.warn("   Error:", err.message);
    activePool = sqlitePool;
  });

// Export a proxy object that delegates to the active pool
export default {
  query: (text, params) => activePool.query(text, params),
  connect: () => isPostgresConnected ? pgPool.connect() : Promise.resolve(),
};
