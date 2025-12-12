import pool from './src/config/database.js';

async function addOrganizerColumn() {
  try {
    console.log('🔄 Adding organizer_id column...\n');

    // Check if column exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'events' AND column_name = 'organizer_id';
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✅ Column organizer_id already exists!');
      await pool.end();
      return;
    }

    // Add organizer_id column
    await pool.query(`
      ALTER TABLE events 
      ADD COLUMN organizer_id INTEGER;
    `);
    console.log('✅ Added organizer_id column');

    // Add foreign key constraint
    try {
      await pool.query(`
        ALTER TABLE events 
        ADD CONSTRAINT fk_events_organizer 
        FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL;
      `);
      console.log('✅ Added foreign key constraint');
    } catch (err) {
      console.log('⚠️  Foreign key constraint might already exist or users table not found');
    }

    // Add index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
    `);
    console.log('✅ Added index');

    console.log('\n✅ Successfully added organizer_id column!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

addOrganizerColumn();