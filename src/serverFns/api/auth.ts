import { query } from "../../lib/db";
import bcrypt from "bcryptjs";
import { signJWT, verifyJWT } from "../../lib/jwt";

function jsonResponse(body: unknown, status = 200, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}

function parseCookies(request: Request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((c) => {
    const [key, val] = c.trim().split("=");
    if (key && val) cookies[key] = val;
  });
  return cookies;
}

export async function getAuthUser(request: Request) {
  const cookies = parseCookies(request);
  const token = cookies.kantin_token;
  if (!token) return null;

  const decoded = verifyJWT(token);
  if (!decoded) return null;

  try {
    const res = await query("SELECT id, name, email, role FROM users WHERE id = $1", [decoded.id]);
    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch {
    return null;
  }
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

      const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
      if (existing.rows.length > 0) {
        return jsonResponse({ error: "Email already exists" }, 409);
      }

      const password_hash = await bcrypt.hash(password, 10);
      const res = await query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
        [name, email, password_hash, role]
      );

      const user = res.rows[0];
      const token = signJWT({ id: user.id, role: user.role });
      
      return jsonResponse(user, 201, {
        "Set-Cookie": `kantin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
      });
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

      const token = signJWT({ id: user.id, role: user.role });
      
      const userWithoutPassword = { id: user.id, name: user.name, email: user.email, role: user.role };
      return jsonResponse(userWithoutPassword, 200, {
        "Set-Cookie": `kantin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
      });
    } catch (e) {
      console.error(e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  if (request.method === "GET" && pathname === "/api/auth/me") {
    try {
      const cookies = parseCookies(request);
      const token = cookies.kantin_token;
      if (!token) return jsonResponse({ error: "Unauthorized" }, 401);

      const decoded = verifyJWT(token);
      if (!decoded) return jsonResponse({ error: "Unauthorized" }, 401);

      const res = await query("SELECT id, name, email, role FROM users WHERE id = $1", [decoded.id]);
      if (res.rows.length === 0) return jsonResponse({ error: "User not found" }, 404);

      return jsonResponse(res.rows[0], 200);
    } catch (e) {
      console.error(e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  if (request.method === "POST" && pathname === "/api/auth/logout") {
    return jsonResponse({ message: "Logged out" }, 200, {
      "Set-Cookie": `kantin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
    });
  }

  return jsonResponse({ error: "Not found" }, 404);
}
