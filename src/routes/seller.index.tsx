import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { rupiah } from "@/lib/mock-data";
import { TrendingUp, ShoppingBag, Wallet, Package, ArrowUpRight, UtensilsCrossed } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./__root";

export const Route = createFileRoute("/seller/")({
  head: () => ({
    meta: [
      { title: "Dashboard Penjual — Smart Kantin" },
      { name: "description", content: "Statistik penjualan tenant Anda." },
      { property: "og:title", content: "Dashboard Penjual — Smart Kantin" },
      { property: "og:description", content: "Statistik penjualan tenant Anda." },
    ],
  }),
  component: SellerDash,
});

function SellerDash() {
  const auth = useAuth();
  const sellerId = auth.user?.id;

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!sellerId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/seller-stats?seller_id=${sellerId}`);
      if (!res.ok) throw new Error("Gagal mengambil data statistik");
      const data = await res.json();
      setStats(data);
    } catch (e: any) {
      setError(e.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchStats();
    // Auto-refresh setiap 15 detik agar sinkron dengan pesanan masuk
    const interval = setInterval(() => {
      fetchStats();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 11) return "Selamat pagi";
    if (h < 15) return "Selamat siang";
    if (h < 18) return "Selamat sore";
    return "Selamat malam";
  };

  const userName = auth.user?.name?.split(" ")[0] ?? "Tenant";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold">{greeting()}, {userName} 👋</h1>
        <p className="text-muted-foreground">Ini ringkasan penjualan hari ini.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-5 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-muted mb-4" />
              <div className="h-3 w-24 bg-muted rounded mb-2" />
              <div className="h-6 w-16 bg-muted rounded" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center text-destructive">
          <p className="font-semibold">{error}</p>
          <button onClick={fetchStats} className="mt-3 text-sm text-primary underline">Coba lagi</button>
        </Card>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              icon={Wallet}
              label="Pendapatan Hari Ini"
              value={rupiah(stats?.pendapatan_hari_ini ?? 0)}
              trend={stats?.total_pesanan_hari_ini > 0 ? "Hari ini" : "Belum ada"}
            />
            <StatCard
              icon={ShoppingBag}
              label="Total Pesanan"
              value={String(stats?.total_pesanan_hari_ini ?? 0)}
              trend={stats?.total_pesanan_hari_ini > 0 ? "Hari ini" : "Belum ada"}
            />
            <StatCard
              icon={TrendingUp}
              label="Rata-rata Order"
              value={rupiah(Math.round(stats?.rata_rata_order ?? 0))}
              trend="Per transaksi"
            />
            <StatCard
              icon={Package}
              label="Stok Menipis"
              value={String(stats?.stok_menipis ?? 0)}
              trend={Number(stats?.stok_menipis) > 0 ? "Perlu diisi" : "Aman"}
              trendType={Number(stats?.stok_menipis) > 0 ? "warn" : "good"}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Grafik penjualan mingguan */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg">Penjualan Mingguan</h3>
                  <p className="text-xs text-muted-foreground">7 hari terakhir</p>
                </div>
                <Badge variant="secondary" className="rounded-full">Real-time</Badge>
              </div>
              <div className="mt-6 h-72">
                <ResponsiveContainer>
                  <LineChart data={stats?.sales_weekly ?? []}>
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="oklch(0.58 0.19 258)" />
                        <stop offset="100%" stopColor="oklch(0.5 0.22 268)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }}
                      formatter={(value: any) => [rupiah(Number(value)), "Pendapatan"]}
                    />
                    <Line type="monotone" dataKey="value" stroke="url(#g)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Menu terlaris */}
            <Card className="p-6">
              <h3 className="font-display font-bold text-lg">Menu Terlaris</h3>
              <div className="mt-4 space-y-3">
                {(stats?.menu_terlaris ?? []).length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-muted-foreground gap-2">
                    <UtensilsCrossed className="h-8 w-8" />
                    <p className="text-sm">Belum ada data penjualan</p>
                  </div>
                ) : (
                  (stats?.menu_terlaris ?? []).map((m: any, i: number) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-sm">{i + 1}</div>
                      {m.image_url ? (
                        <img src={m.image_url} alt={m.name} className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg">🍽️</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.total_terjual} terjual</div>
                      </div>
                      <div className="text-sm font-display font-bold">{rupiah(m.price)}</div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Pesanan terbaru */}
          <Card className="p-6">
            <h3 className="font-display font-bold text-lg">Pesanan Terbaru</h3>
            <div className="mt-4 space-y-2">
              {(stats?.pesanan_terbaru ?? []).length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">Belum ada pesanan hari ini.</div>
              ) : (
                (stats?.pesanan_terbaru ?? []).map((o: any) => (
                  <div key={o.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                      #{o.id.slice(-4).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{o.customer_name ?? "Pembeli"}</div>
                      <div className="text-xs text-muted-foreground truncate">{o.items_summary ?? "-"}</div>
                    </div>
                    <div className="text-sm font-display font-bold text-primary">{rupiah(o.total)}</div>
                    <Badge
                      variant={
                        o.status === "completed" ? "default"
                        : o.status === "cancelled" ? "destructive"
                        : "secondary"
                      }
                      className="capitalize shrink-0"
                    >
                      {o.status === "pending" ? "Menunggu"
                       : o.status === "confirmed" ? "Dikonfirmasi"
                       : o.status === "preparing" ? "Dimasak"
                       : o.status === "ready" ? "Siap Diambil"
                       : o.status === "completed" ? "Selesai"
                       : "Dibatalkan"}
                    </Badge>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(o.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, trendType = "good" }: any) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant={trendType === "warn" ? "destructive" : "secondary"} className="text-[10px] gap-0.5">
          {trendType === "good" && <ArrowUpRight className="h-3 w-3" />}
          {trend}
        </Badge>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-extrabold">{value}</div>
    </Card>
  );
}
