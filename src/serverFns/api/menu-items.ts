import { query } from "../../lib/db";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleMenuItemsApiRequest(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // GET /api/menu-items  — list all or by seller_id
  if (request.method === "GET" && pathname === "/api/menu-items") {
    try {
      const sellerId = url.searchParams.get("seller_id");
      let res;
      if (sellerId) {
        res = await query(
          `SELECT mi.*, u.name as seller_name FROM menu_items mi
           LEFT JOIN users u ON u.id = mi.seller_id
           WHERE mi.seller_id = $1 ORDER BY mi.created_at DESC`,
          [sellerId]
        );
      } else {
        res = await query(
          `SELECT mi.*, u.name as seller_name FROM menu_items mi
           LEFT JOIN users u ON u.id = mi.seller_id
           ORDER BY mi.created_at DESC`
        );
      }
      return jsonResponse(res.rows);
    } catch (e) {
      console.error(e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  // POST /api/menu-items — create menu
  if (request.method === "POST" && pathname === "/api/menu-items") {
    try {
      const body = await request.json();
      const { seller_id, name, description, price, category, image_url, stock } = body;
      if (!name || !price || !category) {
        return jsonResponse({ error: "name, price, category wajib diisi" }, 400);
      }
      const res = await query(
        `INSERT INTO menu_items (seller_id, name, description, price, category, image_url, stock)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [seller_id || null, name, description || "", price, category, image_url || "", stock || 0]
      );
      return jsonResponse(res.rows[0], 201);
    } catch (e) {
      console.error(e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  // PATCH /api/menu-items/:id — update stock / sold_out / name etc
  const patchMatch = pathname.match(/^\/api\/menu-items\/([^/]+)$/);
  if (request.method === "PATCH" && patchMatch) {
    const id = patchMatch[1];
    try {
      const body = await request.json();
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (body.stock !== undefined) { fields.push(`stock = $${idx++}`); values.push(body.stock); }
      if (body.is_sold_out !== undefined) { fields.push(`is_sold_out = $${idx++}`); values.push(body.is_sold_out); }
      if (body.name !== undefined) { fields.push(`name = $${idx++}`); values.push(body.name); }
      if (body.price !== undefined) { fields.push(`price = $${idx++}`); values.push(body.price); }
      if (body.description !== undefined) { fields.push(`description = $${idx++}`); values.push(body.description); }
      if (body.category !== undefined) { fields.push(`category = $${idx++}`); values.push(body.category); }
      if (body.image_url !== undefined) { fields.push(`image_url = $${idx++}`); values.push(body.image_url); }

      if (fields.length === 0) return jsonResponse({ error: "No fields to update" }, 400);

      values.push(id);
      const res = await query(
        `UPDATE menu_items SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
        values
      );
      if (res.rows.length === 0) return jsonResponse({ error: "Not found" }, 404);
      return jsonResponse(res.rows[0]);
    } catch (e) {
      console.error(e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  // DELETE /api/menu-items/:id
  const deleteMatch = pathname.match(/^\/api\/menu-items\/([^/]+)$/);
  if (request.method === "DELETE" && deleteMatch) {
    const id = deleteMatch[1];
    try {
      await query("DELETE FROM menu_items WHERE id = $1", [id]);
      return jsonResponse({ ok: true });
    } catch (e) {
      console.error(e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  return jsonResponse({ error: "Not found" }, 404);
}
