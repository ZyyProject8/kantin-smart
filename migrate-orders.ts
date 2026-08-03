import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    // Tabel orders
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
        seller_id UUID,
        total BIGINT NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        payment_method VARCHAR(50) DEFAULT 'QRIS',
        pickup_time VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      )
    `);
    console.log("✓ orders table created");

    // Tabel order_items
    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
        name VARCHAR(255) DEFAULT '',
        image_url TEXT DEFAULT '',
        quantity INTEGER NOT NULL DEFAULT 1,
        price BIGINT NOT NULL DEFAULT 0,
        selected_variants JSONB DEFAULT '{}',
        selected_addons JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      )
    `);
    console.log("✓ order_items table created");

    // Index
    await query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`);
    console.log("✓ Indexes created");

    console.log("\n🎉 Migration selesai!");
  } catch (e) {
    console.error("Migration error:", e);
  } finally {
    closePool();
  }
}

main();
