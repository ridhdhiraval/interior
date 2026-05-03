require("dotenv").config();
const db = require("./db");

async function fixNotificationTable() {
  try {
    console.log("Ensuring user_notifications table exists...");
    
    // Create user_notifications table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("Table check/creation completed successfully.");
  } catch (err) {
    console.error("Error fixing notification table:", err);
  } finally {
    process.exit(0);
  }
}

fixNotificationTable();
