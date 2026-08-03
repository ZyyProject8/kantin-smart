import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    const res = await query(`SELECT name, image_url FROM menu_items`);
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    closePool();
  }
}

main();
