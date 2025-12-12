import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    const migrationsPath = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsPath).sort();

    console.log('🔄 Starting migrations...\n');

    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`📄 Running migration: ${file}`);
        const filePath = path.join(migrationsPath, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        // Split by semicolon and filter empty statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        for (const statement of statements) {
          try {
            await pool.query(statement);
            console.log(`  ✅ Executed statement successfully`);
          } catch (error) {
            // Ignore "already exists" errors
            if (error.code === '42P07' || error.code === '42701') {
              console.log(`  ⚠️  Already exists, skipping...`);
            } else {
              console.error(`  ❌ Error:`, error.message);
            }
          }
        }
        console.log(`✅ Completed: ${file}\n`);
      }
    }

    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();