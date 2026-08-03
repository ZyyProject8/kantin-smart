import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    const variants = [
      {
        id: "v_indomie",
        name: "Varian Rasa",
        options: [
          "Mi Goreng",
          "Rendang",
          "Sate",
          "Kari Ayam",
          "Ayam Spesial",
          "Soto",
          "Ayam Bawang",
          "Pedas"
        ],
        required: true
      }
    ];

    const res = await query(
      `UPDATE menu_items SET variants = $1 WHERE name = 'Indomie' RETURNING *`,
      [JSON.stringify(variants)]
    );
    
    if (res.rows.length > 0) {
      console.log("Successfully updated Indomie variants:", res.rows[0].name);
    } else {
      console.log("Indomie not found.");
    }
  } catch (e) {
    console.error(e);
  } finally {
    closePool();
  }
}

main();
