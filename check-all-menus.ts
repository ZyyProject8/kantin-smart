import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    const res = await query("SELECT id, name, seller_id FROM menu_items");
    console.log("All Menu Items:", res.rows);
  } finally {
    closePool();
  }
}

main();
