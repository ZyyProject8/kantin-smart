import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    const zyyId = '792095c4-6b69-4144-8516-d42f04493f0b';
    
    // Update all menu items to belong to zyy
    await query("UPDATE menu_items SET seller_id = $1", [zyyId]);
    console.log("Updated menu items to belong to zyy");

    // Update all orders to belong to zyy (where applicable)
    await query("UPDATE orders SET seller_id = $1 WHERE seller_id IS NOT NULL", [zyyId]);
    console.log("Updated orders to belong to zyy");

  } finally {
    closePool();
  }
}

main();
