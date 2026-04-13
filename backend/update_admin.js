require("dotenv").config();
const db = require("./db");
const bcrypt = require("bcryptjs");

async function updateAdmin() {
  try {
    const hash = await bcrypt.hash("admin123", 10);
    const res = await db.query("UPDATE users SET password = $1 WHERE email = $2 RETURNING *", [hash, "admin"]);
    console.log("Updated admin:", res.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

updateAdmin();
