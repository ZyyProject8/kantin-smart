import { query } from "./db";
import bcrypt from "bcryptjs";

export async function seedAdmin() {
  console.log("Seeding admin account...");
  
  try {
    const adminEmail = "admin@sekolah.id";
    const existing = await query("SELECT id FROM users WHERE email = $1", [adminEmail]);
    
    if (existing.rows.length > 0) {
      console.log("Admin account already exists.");
      return;
    }

    const password_hash = await bcrypt.hash("admin123", 10);
    await query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)",
      ["Admin Utama", adminEmail, password_hash, "admin"]
    );
    
    console.log("Admin account seeded successfully!");
    console.log("Email: admin@sekolah.id");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error seeding admin:", error);
    throw error;
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed-admin.ts')) {
    seedAdmin().catch(() => process.exit(1)).then(() => process.exit(0));
}
