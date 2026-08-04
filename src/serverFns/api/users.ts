import { query } from "../../lib/db";
import { getAuthUser } from "./auth";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleUsersApiRequest(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Auth check — hanya admin
  const requester = await getAuthUser(request);
  if (!requester || requester.role !== "admin") {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  // GET /api/users — daftar semua pengguna
  if (request.method === "GET" && pathname === "/api/users") {
    try {
      const role = url.searchParams.get("role"); // optional filter
      let res;
      if (role) {
        res = await query(
          `SELECT id, name, email, role, created_at
           FROM users
           WHERE role = $1
           ORDER BY created_at DESC`,
          [role]
        );
      } else {
        res = await query(
          `SELECT id, name, email, role, created_at
           FROM users
           ORDER BY created_at DESC`
        );
      }
      return jsonResponse(res.rows);
    } catch (e) {
      console.error("[users GET]", e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  // DELETE /api/users/:id — hapus pengguna (non-admin only)
  const deleteMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
  if (request.method === "DELETE" && deleteMatch) {
    const targetId = deleteMatch[1];

    // Cegah Admin menghapus dirinya sendiri
    if (String(requester.id) === String(targetId)) {
      return jsonResponse({ error: "Tidak bisa menghapus akun sendiri" }, 400);
    }

    try {
      // Pastikan target bukan admin lain
      const targetRes = await query("SELECT role FROM users WHERE id = $1", [targetId]);
      if (targetRes.rows.length === 0) {
        return jsonResponse({ error: "Pengguna tidak ditemukan" }, 404);
      }
      if (targetRes.rows[0].role === "admin") {
        return jsonResponse({ error: "Tidak bisa menghapus akun Admin lain" }, 403);
      }

      await query("DELETE FROM users WHERE id = $1", [targetId]);
      return jsonResponse({ ok: true });
    } catch (e) {
      console.error("[users DELETE]", e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  return jsonResponse({ error: "Not found" }, 404);
}
