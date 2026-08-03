import { query } from "../../lib/db";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleOrdersApiRequest(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // ─── POST /api/orders — buat pesanan baru ─────────────────────────────────
  if (request.method === "POST" && pathname === "/api/orders") {
    try {
      const body = await request.json() as any;
      const { user_id, seller_id, items, total, payment_method, pickup_time } = body;

      if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        return jsonResponse({ error: "user_id dan items wajib diisi" }, 400);
      }

      // Buat order
      const orderRes = await query(
        `INSERT INTO orders (user_id, seller_id, total, status, payment_method, pickup_time)
         VALUES ($1, $2, $3, 'pending', $4, $5)
         RETURNING *`,
        [user_id, seller_id || null, total || 0, payment_method || "QRIS", pickup_time || null]
      );
      const order = orderRes.rows[0];

      // Insert order items + kurangi stok
      for (const item of items) {
        // Insert order item
        await query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price, name, image_url, selected_variants, selected_addons)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            order.id,
            item.id,
            item.qty ?? 1,
            item.price ?? 0,
            item.name ?? "",
            item.image ?? "",
            JSON.stringify(item.selectedVariants ?? {}),
            JSON.stringify(item.selectedAddons ?? []),
          ]
        );

        // Kurangi stok
        await query(
          `UPDATE menu_items SET stock = GREATEST(stock - $1, 0) WHERE id = $2`,
          [item.qty ?? 1, item.id]
        );
      }

      return jsonResponse({ id: order.id, status: order.status }, 201);
    } catch (e) {
      console.error("[orders POST]", e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  // ─── GET /api/orders — list pesanan (by user_id atau seller_id) ───────────
  if (request.method === "GET" && pathname === "/api/orders") {
    try {
      const userId = url.searchParams.get("user_id");
      const sellerId = url.searchParams.get("seller_id");

      let rows;
      if (userId) {
        // Pesanan milik siswa
        const res = await query(
          `SELECT
             o.*,
             u.name AS buyer_name,
             (
               SELECT JSON_AGG(
                 JSON_BUILD_OBJECT(
                   'id', oi.menu_item_id,
                   'name', oi.name,
                   'qty', oi.quantity,
                   'price', oi.price,
                   'image', oi.image_url,
                   'selectedVariants', oi.selected_variants,
                   'selectedAddons', oi.selected_addons
                 )
               )
               FROM order_items oi WHERE oi.order_id = o.id
             ) AS items
           FROM orders o
           LEFT JOIN users u ON u.id = o.user_id
           WHERE o.user_id = $1
           ORDER BY o.created_at DESC`,
          [userId]
        );
        rows = res.rows;
      } else if (sellerId) {
        // Pesanan masuk ke tenant
        const res = await query(
          `SELECT
             o.*,
             u.name AS buyer_name,
             (
               SELECT JSON_AGG(
                 JSON_BUILD_OBJECT(
                   'id', oi.menu_item_id,
                   'name', oi.name,
                   'qty', oi.quantity,
                   'price', oi.price,
                   'image', oi.image_url,
                   'selectedVariants', oi.selected_variants,
                   'selectedAddons', oi.selected_addons
                 )
               )
               FROM order_items oi WHERE oi.order_id = o.id
             ) AS items
           FROM orders o
           LEFT JOIN users u ON u.id = o.user_id
           WHERE o.seller_id = $1
             AND o.status NOT IN ('completed', 'cancelled')
           ORDER BY o.created_at DESC`,
          [sellerId]
        );
        rows = res.rows;
      } else {
        return jsonResponse({ error: "user_id atau seller_id diperlukan" }, 400);
      }

      return jsonResponse(rows);
    } catch (e) {
      console.error("[orders GET]", e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  // ─── GET /api/orders/:id — detail satu pesanan ────────────────────────────
  const getMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
  if (request.method === "GET" && getMatch) {
    try {
      const res = await query(
        `SELECT
           o.*,
           u.name AS buyer_name,
           (
             SELECT JSON_AGG(
               JSON_BUILD_OBJECT(
                 'id', oi.menu_item_id,
                 'name', oi.name,
                 'qty', oi.quantity,
                 'price', oi.price,
                 'image', oi.image_url,
                 'selectedVariants', oi.selected_variants,
                 'selectedAddons', oi.selected_addons
               )
             )
             FROM order_items oi WHERE oi.order_id = o.id
           ) AS items
         FROM orders o
         LEFT JOIN users u ON u.id = o.user_id
         WHERE o.id = $1`,
        [getMatch[1]]
      );
      if (res.rows.length === 0) return jsonResponse({ error: "Not found" }, 404);
      return jsonResponse(res.rows[0]);
    } catch (e) {
      console.error("[orders GET/:id]", e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  // ─── PATCH /api/orders/:id — update status (tenant) ──────────────────────
  const patchMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
  if (request.method === "PATCH" && patchMatch) {
    try {
      const body = await request.json() as any;
      const { status } = body;
      const validStatuses = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];
      if (!status || !validStatuses.includes(status)) {
        return jsonResponse({ error: "Status tidak valid" }, 400);
      }
      const res = await query(
        `UPDATE orders SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`,
        [status, patchMatch[1]]
      );
      if (res.rows.length === 0) return jsonResponse({ error: "Not found" }, 404);
      return jsonResponse(res.rows[0]);
    } catch (e) {
      console.error("[orders PATCH]", e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  // ─── DELETE /api/orders/:id — batalkan pesanan (siswa) ────────────────────
  const deleteMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
  if (request.method === "DELETE" && deleteMatch) {
    try {
      const res = await query(
        `UPDATE orders SET status = 'cancelled', updated_at = now()
         WHERE id = $1 AND status IN ('pending', 'confirmed')
         RETURNING *`,
        [deleteMatch[1]]
      );
      if (res.rows.length === 0) {
        return jsonResponse({ error: "Pesanan tidak ditemukan atau tidak bisa dibatalkan" }, 400);
      }
      return jsonResponse({ ok: true });
    } catch (e) {
      console.error("[orders DELETE]", e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  return jsonResponse({ error: "Not found" }, 404);
}
