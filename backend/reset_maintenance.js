require("dotenv").config();
const db = require("./db");

async function resetMaintenance() {
  try {
    console.log("Setting maintenance mode to false in database...");
    await db.query("UPDATE global_settings SET value = 'false' WHERE key = 'is_server_maintenance'");
    console.log("Database updated successfully.");
  } catch (err) {
    console.error("Error updating database:", err);
  } finally {
    process.exit(0);
  }
}

resetMaintenance();
