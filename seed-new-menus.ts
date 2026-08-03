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
    
    const newMenus = [
      {
        name: "Ayam Goreng",
        description: "Ayam goreng renyah dan gurih, tersedia pilihan geprek atau kremes.",
        price: 10000,
        category: "Makanan",
        image_url: "/image/ayam.jpg",
        stock: 20,
        variants: [
          {
            id: "v_ayam",
            name: "Kategori",
            options: ["Geprek", "Kremes"],
            required: true
          }
        ]
      },
      {
        name: "Es Teh",
        description: "Es teh manis segar pelepas dahaga.",
        price: 3000,
        category: "Minuman",
        image_url: "/image/esteh.jpg",
        stock: 50,
        variants: []
      },
      {
        name: "Le Minerale",
        description: "Air mineral pegunungan.",
        price: 3000,
        category: "Minuman",
        image_url: "/image/lemineral.jpg",
        stock: 50,
        variants: []
      },
      {
        name: "Indomie",
        description: "Indomie nikmat disajikan selagi hangat.",
        price: 6000,
        category: "Mie",
        image_url: "/image/indomie.jpg",
        stock: 30,
        variants: []
      },
      {
        name: "Seblak Kuah Ceker",
        description: "Seblak kuah pedas dengan topping ceker empuk.",
        price: 8000,
        category: "Makanan",
        image_url: "/image/seblak kuah ceker.jpg",
        stock: 15,
        variants: []
      }
    ];

    for (const menu of newMenus) {
      const res = await query(
        `INSERT INTO menu_items (seller_id, name, description, price, category, image_url, stock, variants)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [sellerId, menu.name, menu.description, menu.price, menu.category, menu.image_url, menu.stock, JSON.stringify(menu.variants)]
      );
      console.log("Successfully added:", res.rows[0].name);
    }
  } catch (e) {
    console.error(e);
  } finally {
    closePool();
  }
}

main();
