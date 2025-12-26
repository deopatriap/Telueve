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

// Promise to track connection attempt
const connectionPromise = pgPool.connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL");
    isPostgresConnected = true;
    client.release();
  })
  .catch((err) => {
    console.warn("⚠️  PostgreSQL connection failed. Falling back to SQLite.");
    // console.warn("   Error:", err.message); // Too verbose
    activePool = sqlitePool;
  });

// Export a proxy object that delegates to the active pool
export default {
  query: async (text, params) => {
    // Ensure we know which pool to use
    await connectionPromise;
    return activePool.query(text, params);
  },
  connect: () => connectionPromise.then(() => isPostgresConnected ? pgPool.connect() : Promise.resolve()),
};
