import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    const userRes = await query(`SELECT id FROM users WHERE role = 'seller' LIMIT 1`);
    if (userRes.rows.length === 0) {
      console.log("No seller found!");
      return;
    }
    const sellerId = userRes.rows[0].id;
    
    const name = "Risol Bites";
    const description = "Risol nikmat dengan 5 varian rasa spesial: Mayo, Coklat Keju, Ayam Suwir Pedas, Matcha Keju, dan Rogout Ayam.";
    const price = 4000;
    const category = "Snack";
    const image_url = "/risol.jpg";
    const stock = 10;
    
    const variants = [
      {
        id: "v_rasa",
        name: "Pilihan Rasa",
        options: ["Mayo", "Coklat Keju", "Ayam Suwir Pedas", "Matcha Keju", "Rogout Ayam"],
        required: true
      }
    ];

    const res = await query(
      `INSERT INTO menu_items (seller_id, name, description, price, category, image_url, stock, variants)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [sellerId, name, description, price, category, image_url, stock, JSON.stringify(variants)]
    );
    
    console.log("Successfully added Risol Bites:", res.rows[0].name);
  } catch (e) {
    console.error(e);
  } finally {
    closePool();
  }
}

main();
