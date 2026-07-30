import { query } from "./db";

export async function initDatabase() {
  console.log("Initializing database...");
  
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL DEFAULT 0,
        category VARCHAR(100) NOT NULL DEFAULT 'Makanan',
        image_url TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        is_sold_out BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Allow running this script directly
if (process.argv[1] && process.argv[1].endsWith('db-init.ts')) {
    initDatabase().catch(() => process.exit(1)).then(() => process.exit(0));
}

