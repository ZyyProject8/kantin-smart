import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    console.log("Adding variants and addons columns to menu_items...");
    await query(`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb`);
    await query(`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '[]'::jsonb`);
    console.log("Success!");
  } catch (e) {
    console.error(e);
  } finally {
    closePool();
  }
}

main();
