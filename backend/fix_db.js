require("dotenv").config();
const db = require("./db");

async function fixDatabase() {
  try {
    console.log("Checking and fixing database tables...");
    
    // Create global_settings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS global_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT NOT NULL
      );
    `);
    
    // Create plan_details table
    await db.query(`
      CREATE TABLE IF NOT EXISTS plan_details (
        id SERIAL PRIMARY KEY,
        plan_name VARCHAR(255) UNIQUE NOT NULL,
        monthly_price DECIMAL(10, 2) NOT NULL,
        yearly_price DECIMAL(10, 2) NOT NULL
      );
    `);

    // Insert default settings
    await db.query(`
      INSERT INTO global_settings (key, value) 
      VALUES ('site_name', 'Iconic Interior'), ('currency', 'INR')
      ON CONFLICT (key) DO NOTHING;
    `);

    // Insert default plans
    await db.query(`
      INSERT INTO plan_details (plan_name, monthly_price, yearly_price)
      VALUES ('STANDARD', 5.00, 50.00), ('PRO', 10.00, 100.00)
      ON CONFLICT (plan_name) DO NOTHING;
    `);
    
    console.log("Database fixed successfully.");
  } catch (err) {
    console.error("Error fixing database:", err);
  } finally {
    process.exit(0);
  }
}

fixDatabase();
