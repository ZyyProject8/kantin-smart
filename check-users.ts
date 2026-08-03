import { query, closePool } from "./src/lib/db";

async function main() {
  try {
    const res = await query("SELECT id, name, email, role FROM users");
    console.log("Users:", res.rows);
  } finally {
    closePool();
  }
}

main();
