import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    const res = await query("SELECT id, name, seller_id FROM menu_items LIMIT 5");
    console.log("Menu Items:", res.rows);
  } finally {
    closePool();
  }
}

main();
