require("dotenv").config();
const db = require("./db");

async function updateSchema() {
  try {
    console.log("Updating schema...");
    
    // Add ai_credits and manual_credits if they don't exist
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS ai_credits INTEGER DEFAULT 3,
      ADD COLUMN IF NOT EXISTS manual_credits INTEGER DEFAULT 3;
    `);
    
    console.log("Schema updated successfully.");
  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    process.exit(0);
  }
}

updateSchema();
