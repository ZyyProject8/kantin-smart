import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    const res = await query(
      `UPDATE menu_items SET image_url = '/image/risol.jpg' WHERE name = 'Risol Bites' RETURNING name, image_url`
    );
    if (res.rows.length === 0) {
      console.log("Risol Bites not found!");
    } else {
      console.log("Updated:", res.rows[0]);
    }
  } catch (e) {
    console.error(e);
  } finally {
    closePool();
  }
}

main();
