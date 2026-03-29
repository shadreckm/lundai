import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function checkDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Supabase.");

    // Check tables
    const tablesRes = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const tables = tablesRes.rows.map(r => r.table_name);
    console.log("Tables found:", tables.join(", "));

    const required = ["users", "properties", "property_images", "inquiries", "transactions", "ai_search_logs", "whatsapp_messages"];
    const missing = required.filter(t => !tables.includes(t));

    if (missing.length > 0) {
      console.log("Missing tables:", missing.join(", "));
    } else {
      console.log("All required tables verified.");
    }

    // Count properties
    const countRes = await client.query("SELECT COUNT(*) FROM properties;");
    console.log("Property count:", countRes.rows[0].count);

    await client.end();
  } catch (err) {
    console.error("Database connection/validation error:", err.message);
    process.exit(1);
  }
}

checkDatabase();
