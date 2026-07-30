import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { salesData } from "@/lib/mock-data";
import { Users, Store, Wallet, ShoppingBag, ArrowUpRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Admin — Kantin Pintar" },
      { name: "description", content: "Ringkasan operasional platform Kantin Pintar." },
      { property: "og:title", content: "Dashboard Admin — Kantin Pintar" },
      { property: "og:description", content: "Ringkasan operasional platform Kantin Pintar." },
    ],
  }),
  component: AdminDash,
});

const activities = [
  { user: "Bu Sri", action: "Menambahkan menu baru", time: "2 mnt lalu", avatar: 32 },
  { user: "Rizky A.", action: "Melakukan pesanan #K-2405", time: "5 mnt lalu", avatar: 12 },
  { user: "Kopi Kanti", action: "Menandai pesanan selesai", time: "10 mnt lalu", avatar: 5 },
  { user: "Admin", action: "Memverifikasi tenant baru", time: "1 jam lalu", avatar: 47 },
];

function AdminDash() {
  const auth = useAuth();
  const nav = useNavigate();

  if (!auth.user) {
    nav({ to: "/login" });
    return null;
  }

  if (auth.user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="max-w-md text-center p-8">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-destructive/10 text-destructive mb-6">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="font-display text-2xl font-bold">Akses Ditolak</h1>
          <p className="mt-3 text-muted-foreground">Halaman ini hanya dapat diakses oleh Admin. Harap login dengan akun Admin terlebih dahulu.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/login"><button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Ganti Akun (Login)</button></Link>
            <Link to="/"><button className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium">Kembali ke Beranda</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="glass border-b sticky top-0 z-30">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <Badge variant="secondary" className="rounded-full">Admin</Badge>
          </div>
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Ke Situs
          </Link>
        </div>
      </header>

      <main className="container-page py-8 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Dashboard Admin</h1>
          <p className="text-muted-foreground">Ringkasan operasional platform per hari ini.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Stat icon={Wallet} label="Total Transaksi" value="Rp42.8jt" trend="+18%" />
          <Stat icon={Store} label="Total Tenant" value="84" trend="+3" />
          <Stat icon={Users} label="Total Pengguna" value="12.4k" trend="+412" />
          <Stat icon={ShoppingBag} label="Total Order" value="230.5k" trend="+7%" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">Transaksi Mingguan</h3>
                <p className="text-xs text-muted-foreground">7 hari terakhir</p>
              </div>
              <Badge variant="secondary" className="rounded-full">+22%</Badge>
            </div>
            <div className="mt-6 h-72">
              <ResponsiveContainer>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.58 0.19 258)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="oklch(0.58 0.19 258)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                  <Area type="monotone" dataKey="value" stroke="oklch(0.58 0.19 258)" strokeWidth={3} fill="url(#ag)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold text-lg">Order per Hari</h3>
            <div className="mt-6 h-72">
              <ResponsiveContainer>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                  <Bar dataKey="value" fill="oklch(0.58 0.19 258)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-display font-bold text-lg">Aktivitas Terbaru</h3>
          <div className="mt-4 space-y-2">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition">
                <Avatar className="h-9 w-9"><AvatarImage src={`https://i.pravatar.cc/40?img=${a.avatar}`} /><AvatarFallback>U</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm"><b>{a.user}</b> <span className="text-muted-foreground">{a.action}</span></div>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value, trend }: any) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant="secondary" className="text-[10px] gap-0.5"><ArrowUpRight className="h-3 w-3" />{trend}</Badge>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-extrabold">{value}</div>
    </Card>
  );
}
