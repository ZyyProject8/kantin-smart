import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    await query(`
      ALTER TABLE orders
        ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'QRIS',
        ADD COLUMN IF NOT EXISTS pickup_time VARCHAR(20)
    `);
    console.log("orders table updated");

    await query(`
      ALTER TABLE order_items
        ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT '',
        ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '',
        ADD COLUMN IF NOT EXISTS selected_variants JSONB DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS selected_addons JSONB DEFAULT '[]',
        ADD COLUMN IF NOT EXISTS price BIGINT DEFAULT 0
    `);
    console.log("order_items table updated");

    console.log("Migration completed successfully!");
  } catch (e) {
    console.error("Migration error:", e);
  } finally {
    closePool();
  }
}

main();
