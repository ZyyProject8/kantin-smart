import { query } from "../../lib/db";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleSellerStatsApiRequest(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // GET /api/seller-stats?seller_id=xxx
  if (request.method === "GET" && pathname === "/api/seller-stats") {
    const sellerId = url.searchParams.get("seller_id");
    if (!sellerId) {
      return jsonResponse({ error: "seller_id is required" }, 400);
    }

    try {
      // Pendapatan & total pesanan hari ini
      const todayRes = await query(
        `SELECT
           COALESCE(SUM(total), 0) AS pendapatan_hari_ini,
           COUNT(*) AS total_pesanan_hari_ini
         FROM orders
         WHERE seller_id = $1
           AND DATE(created_at) = CURRENT_DATE
           AND status != 'cancelled'`,
        [sellerId]
      );

      // Rata-rata nilai order hari ini
      const avgRes = await query(
        `SELECT COALESCE(AVG(total), 0) AS rata_rata_order
         FROM orders
         WHERE seller_id = $1
           AND DATE(created_at) = CURRENT_DATE
           AND status != 'cancelled'`,
        [sellerId]
      );

      // Stok menipis (stok <= 5)
      const stokRes = await query(
        `SELECT COUNT(*) AS stok_menipis
         FROM menu_items
         WHERE seller_id = $1 AND stock <= 5 AND is_sold_out = false`,
        [sellerId]
      );

      // Penjualan 7 hari terakhir
      const weekRes = await query(
        `SELECT
           TO_CHAR(gs.day, 'Dy') AS day,
           COALESCE(SUM(o.total), 0) AS value
         FROM generate_series(
           CURRENT_DATE - INTERVAL '6 days',
           CURRENT_DATE,
           '1 day'::INTERVAL
         ) AS gs(day)
         LEFT JOIN orders o
           ON DATE(o.created_at) = gs.day::date
           AND o.seller_id = $1
           AND o.status != 'cancelled'
         GROUP BY gs.day
         ORDER BY gs.day ASC`,
        [sellerId]
      );

      // Pesanan terbaru
      const ordersRes = await query(
        `SELECT
           o.id,
           o.total,
           o.status,
           o.created_at,
           u.name AS customer_name,
           (
             SELECT STRING_AGG(mi.name, ', ')
             FROM order_items oi
             JOIN menu_items mi ON mi.id = oi.menu_item_id
             WHERE oi.order_id = o.id
           ) AS items_summary
         FROM orders o
         LEFT JOIN users u ON u.id = o.user_id
         WHERE o.seller_id = $1
         ORDER BY o.created_at DESC
         LIMIT 5`,
        [sellerId]
      );

      // Menu terlaris (berdasarkan order_items)
      const topMenuRes = await query(
        `SELECT
           mi.id,
           mi.name,
           mi.image_url,
           mi.price,
           COALESCE(SUM(oi.quantity), 0) AS total_terjual
         FROM menu_items mi
         LEFT JOIN order_items oi ON oi.menu_item_id = mi.id
         LEFT JOIN orders o ON o.id = oi.order_id AND o.status != 'cancelled'
         WHERE mi.seller_id = $1
         GROUP BY mi.id, mi.name, mi.image_url, mi.price
         ORDER BY total_terjual DESC
         LIMIT 4`,
        [sellerId]
      );

      return jsonResponse({
        pendapatan_hari_ini: Number(todayRes.rows[0]?.pendapatan_hari_ini ?? 0),
        total_pesanan_hari_ini: Number(todayRes.rows[0]?.total_pesanan_hari_ini ?? 0),
        rata_rata_order: Number(avgRes.rows[0]?.rata_rata_order ?? 0),
        stok_menipis: Number(stokRes.rows[0]?.stok_menipis ?? 0),
        sales_weekly: weekRes.rows,
        pesanan_terbaru: ordersRes.rows,
        menu_terlaris: topMenuRes.rows,
      });
    } catch (e) {
      console.error(e);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  }

  return jsonResponse({ error: "Not found" }, 404);
}
