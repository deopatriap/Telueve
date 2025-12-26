
import db from './src/config/database.js';

console.log("Testing DB connection...");
db.connect().then(async () => {
  console.log("DB Connected via proxy.");
  try {
    const res = await db.query('SELECT 1 as val');
    console.log("Query result:", res.rows[0]);
  } catch (e) {
    console.error("Query failed:", e);
  }
}).catch(e => {
  console.error("Connect failed:", e);
});
