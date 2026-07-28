import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { salesData, menus, kitchenOrders, rupiah } from "@/lib/mock-data";
import { TrendingUp, ShoppingBag, Wallet, Package, ArrowUpRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/seller/")({
  head: () => ({
    meta: [
      { title: "Dashboard Penjual — Kantin Pintar" },
      { name: "description", content: "Statistik penjualan tenant Anda." },
      { property: "og:title", content: "Dashboard Penjual — Kantin Pintar" },
      { property: "og:description", content: "Statistik penjualan tenant Anda." },
    ],
  }),
  component: SellerDash,
});

function SellerDash() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Halo, Bu Sri 👋</h1>
        <p className="text-muted-foreground">Ini ringkasan penjualan hari ini.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Wallet} label="Pendapatan Hari Ini" value="Rp1.245.000" trend="+12%" />
        <StatCard icon={ShoppingBag} label="Total Pesanan" value="42" trend="+8%" />
        <StatCard icon={TrendingUp} label="Rata-rata Order" value="Rp29.600" trend="+3%" />
        <StatCard icon={Package} label="Stok Menipis" value="2" trend="Perhatian" trendType="warn" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg">Penjualan Mingguan</h3>
              <p className="text-xs text-muted-foreground">7 hari terakhir</p>
            </div>
            <Badge variant="secondary" className="rounded-full">+18% WoW</Badge>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer>
              <LineChart data={salesData}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="oklch(0.58 0.19 258)" />
                    <stop offset="100%" stopColor="oklch(0.5 0.22 268)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Line type="monotone" dataKey="value" stroke="url(#g)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-bold text-lg">Menu Terlaris</h3>
          <div className="mt-4 space-y-3">
            {menus.slice(0, 4).map((m, i) => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-sm">{i+1}</div>
                <img src={m.image} alt={m.name} className="h-10 w-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{40 - i * 6} terjual</div>
                </div>
                <div className="text-sm font-display font-bold">{rupiah(m.price)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-display font-bold text-lg">Pesanan Terbaru</h3>
        <div className="mt-4 space-y-2">
          {kitchenOrders.slice(0, 4).map(o => (
            <div key={o.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                {o.id.slice(-2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{o.id} · {o.customer}</div>
                <div className="text-xs text-muted-foreground truncate">{o.items.join(", ")}</div>
              </div>
              <Badge variant="secondary" className="capitalize">{o.status}</Badge>
              <span className="text-xs text-muted-foreground shrink-0">{o.time}</span>
            </div>
          ))}
        </div>
      </Card>
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
