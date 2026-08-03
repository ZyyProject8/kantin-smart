import { query } from "../../lib/db";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleAdminStatsApiRequest(request: Request) {
  const url = new URL(request.url);
  if (request.method !== "GET" || !url.pathname.startsWith("/api/admin-stats")) {
    return jsonResponse({ error: "Not found" }, 404);
  }

  try {
    // Total pengguna
    const usersRes = await query(`SELECT COUNT(*) FROM users`);
    const totalUsers = parseInt(usersRes.rows[0].count);

    // Total seller
    const sellersRes = await query(`SELECT COUNT(*) FROM users WHERE role = 'seller'`);
    const totalSellers = parseInt(sellersRes.rows[0].count);

    // Total siswa
    const studentsRes = await query(`SELECT COUNT(*) FROM users WHERE role IN ('siswa', 'customer')`);
    const totalStudents = parseInt(studentsRes.rows[0].count);

    // Total pesanan
    const ordersRes = await query(`SELECT COUNT(*) FROM orders`);
    const totalOrders = parseInt(ordersRes.rows[0].count);

    // Total pesanan pending/aktif
    const activeOrdersRes = await query(
      `SELECT COUNT(*) FROM orders WHERE status NOT IN ('completed', 'cancelled')`
    );
    const activeOrders = parseInt(activeOrdersRes.rows[0].count);

    // Total revenue (dari pesanan completed)
    const revenueRes = await query(
      `SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE status = 'completed'`
    );
    const totalRevenue = parseInt(revenueRes.rows[0].revenue || "0");

    // Total menu items
    const menusRes = await query(`SELECT COUNT(*) FROM menu_items`);
    const totalMenus = parseInt(menusRes.rows[0].count);

    // Chart data: transaksi 7 hari terakhir per hari
    const chartRes = await query(`
      SELECT
        TO_CHAR(DATE_TRUNC('day', created_at), 'Dy') AS day,
        DATE_TRUNC('day', created_at) AS date,
        COUNT(*) AS orders,
        COALESCE(SUM(total), 0) AS revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date ASC
    `);

    // Generate 7 hari terakhir, isi 0 jika tidak ada data
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const weekData: { day: string; value: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];

      const match = chartRes.rows.find((r: any) => {
        const rDate = new Date(r.date).toISOString().split('T')[0];
        return rDate === dateStr;
      });

      weekData.push({
        day: dayName,
        value: match ? parseInt(match.revenue) : 0,
        orders: match ? parseInt(match.orders) : 0,
      });
    }

    // Aktivitas terbaru: pesanan terbaru dari berbagai user
    const activitiesRes = await query(`
      SELECT
        o.id,
        o.status,
        o.total,
        o.created_at,
        u.name AS buyer_name
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    const activities = activitiesRes.rows.map((a: any) => {
      const statusLabel: Record<string, string> = {
        pending: "membuat pesanan baru",
        confirmed: "pesanan dikonfirmasi",
        preparing: "pesanan sedang dimasak",
        ready: "pesanan siap diambil",
        completed: "menyelesaikan pesanan",
        cancelled: "membatalkan pesanan",
      };
      const now = new Date();
      const createdAt = new Date(a.created_at);
      const diffMs = now.getTime() - createdAt.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHr = Math.floor(diffMs / 3600000);

      let timeAgo = "";
      if (diffMin < 1) timeAgo = "baru saja";
      else if (diffMin < 60) timeAgo = `${diffMin} mnt lalu`;
      else if (diffHr < 24) timeAgo = `${diffHr} jam lalu`;
      else timeAgo = `${Math.floor(diffHr / 24)} hari lalu`;

      return {
        id: a.id,
        user: a.buyer_name || "Pengguna",
        action: statusLabel[a.status] || "melakukan aktivitas",
        time: timeAgo,
        status: a.status,
      };
    });

    // Recent users (pendaftar baru)
    const recentUsersRes = await query(`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    return jsonResponse({
      totalUsers,
      totalSellers,
      totalStudents,
      totalOrders,
      activeOrders,
      totalRevenue,
      totalMenus,
      weekData,
      activities,
      recentUsers: recentUsersRes.rows,
    });
  } catch (e) {
    console.error("[admin-stats]", e);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}
