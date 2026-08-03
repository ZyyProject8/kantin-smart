import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    // Check what tables exist
    const res = await query(`
      SELECT table_name, table_schema
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name
    `);
    console.log("Existing tables:", res.rows);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    closePool();
  }
}

main();
