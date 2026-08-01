import { query, closePool } from "./src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  try {
    let userRes = await query(`SELECT id FROM users WHERE role = 'seller' LIMIT 1`);
    if (userRes.rows.length === 0) {
      console.log("No seller found! Creating one...");
      const hash = await bcrypt.hash("password123", 10);
      userRes = await query(
        `INSERT INTO users (name, email, password_hash, role) VALUES ('Tenant', 'tenant@tenant.com', $1, 'seller') RETURNING id`,
        [hash]
      );
    }
    const sellerId = userRes.rows[0].id;
    
    const name = "Es Nutrisari";
    const description = "Es Nutrisari segar penghilang dahaga dengan berbagai rasa buah pilihan.";
    const price = 3000;
    const category = "Minuman";
    const image_url = "/image/nutrisari.jpg";
    const stock = 12;
    
    // Using some standard nutrisari flavors for variants
    const variants = [
      {
        id: "v_rasa_nutrisari",
        name: "Pilihan Rasa",
        options: ["Jeruk Peras", "Jeruk Nipis", "Sweet Orange", "Mangga", "Sirsak"],
        required: true
      }
    ];

    const res = await query(
      `INSERT INTO menu_items (seller_id, name, description, price, category, image_url, stock, variants)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [sellerId, name, description, price, category, image_url, stock, JSON.stringify(variants)]
    );
    
    console.log("Successfully added:", res.rows[0].name);
  } catch (e) {
    console.error(e);
  } finally {
    closePool();
  }
}

main();
