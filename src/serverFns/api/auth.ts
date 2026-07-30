import { query } from "../../lib/db";
import bcrypt from "bcryptjs";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleAuthApiRequest(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method === "POST" && pathname === "/api/auth/register") {
    try {
      const body = await request.json();
      const { name, email, password, role } = body;

      if (!name || !email || !password || !role) {
        return jsonResponse({ error: "Missing fields" }, 400);
      }

      if (role === "admin") {
        return jsonResponse({ error: "Pendaftaran sebagai admin tidak diizinkan." }, 403);
      }

      // Check if user exists
      const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
      if (existing.rows.length > 0) {
        return jsonResponse({ error: "Email already exists" }, 409);
      }

      const password_hash = await bcrypt.hash(password, 10);
      const res = await query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
        [name, email, password_hash, role]
      );

      return jsonResponse(res.rows[0], 201);
    } catch (e) {
      console.error(e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  if (request.method === "POST" && pathname === "/api/auth/login") {
    try {
      const body = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        return jsonResponse({ error: "Missing fields" }, 400);
      }

      const res = await query("SELECT * FROM users WHERE email = $1", [email]);
      if (res.rows.length === 0) {
        return jsonResponse({ error: "Invalid credentials" }, 401);
      }

      const user = res.rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return jsonResponse({ error: "Invalid credentials" }, 401);
      }

      return jsonResponse({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (e) {
      console.error(e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  return jsonResponse({ error: "Not found" }, 404);
}
