import { createFileRoute, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { menus, categories, tenants, orderHistory, rupiah } from "@/lib/mock-data";
import { Search, SlidersHorizontal, Star, Clock, TrendingUp, Flame, Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Beranda — Kantin Pintar" },
      { name: "description", content: "Menu populer, tenant favorit, dan rekomendasi untukmu." },
      { property: "og:title", content: "Beranda — Kantin Pintar" },
      { property: "og:description", content: "Menu populer, tenant favorit, dan rekomendasi untukmu." },
    ],
  }),
  component: BuyerHome,
});

function BuyerHome() {
  const populer = menus.slice(0, 4);
  const terbaru = menus.slice(2, 6);
  const rekomendasi = menus.slice(1, 5);

  return (
    <div className="space-y-10">
      {/* Greeting + search */}
      <section>
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">Selamat siang,</p>
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">Mau makan apa hari ini, Dinda? 👋</h1>
        </div>
        <div className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari menu atau tenant..." className="h-12 pl-11 rounded-xl bg-background" />
          </div>
          <Button size="lg" variant="outline" className="h-12 gap-2"><SlidersHorizontal className="h-4 w-4" /> Filter</Button>
        </div>
      </section>

      {/* Promo banner */}
      <section className="relative overflow-hidden rounded-3xl gradient-primary p-6 md:p-10 text-primary-foreground">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid gap-4 md:grid-cols-[2fr_1fr] items-center">
          <div>
            <Badge className="bg-white/20 text-primary-foreground border-none rounded-full mb-3"><Sparkles className="h-3 w-3 mr-1" /> Promo Jumat</Badge>
            <h2 className="font-display text-2xl md:text-4xl font-extrabold leading-tight">Diskon 20% <br />semua menu minuman!</h2>
            <p className="mt-2 opacity-90 text-sm">Berlaku hari ini hingga pukul 17:00.</p>
            <Button variant="secondary" className="mt-4">Ambil Promo</Button>
          </div>
          <div className="hidden md:block text-8xl text-center">🥤</div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <SectionHeader title="Kategori" />
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map(c => (
            <Card key={c.id} className="flex flex-col items-center gap-2 p-4 cursor-pointer transition hover:-translate-y-0.5 hover:border-primary/50">
              <div className="text-3xl">{c.icon}</div>
              <div className="text-xs font-medium">{c.name}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Menu populer */}
      <section>
        <SectionHeader title="Menu Populer" icon={<Flame className="h-5 w-5 text-destructive" />} action="Lihat semua" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {populer.map(m => <MenuCard key={m.id} m={m} />)}
        </div>
      </section>

      {/* Tenant favorit */}
      <section>
        <SectionHeader title="Tenant Favorit" icon={<Star className="h-5 w-5 text-warning" />} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tenants.map(t => (
            <Card key={t.id} className="overflow-hidden group cursor-pointer transition hover:-translate-y-0.5">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={t.image} alt={t.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="font-display font-bold truncate">{t.name}</div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {t.rating}</span>
                  <span>{t.orders}+ order</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Menu terbaru */}
      <section>
        <SectionHeader title="Menu Terbaru" icon={<Sparkles className="h-5 w-5 text-primary" />} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {terbaru.map(m => <MenuCard key={m.id} m={m} />)}
        </div>
      </section>

      {/* Rekomendasi */}
      <section>
        <SectionHeader title="Rekomendasi Untukmu" icon={<TrendingUp className="h-5 w-5 text-success" />} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rekomendasi.map(m => <MenuCard key={m.id} m={m} />)}
        </div>
      </section>

      {/* Riwayat singkat */}
      <section>
        <SectionHeader title="Riwayat Terakhir" icon={<Clock className="h-5 w-5 text-muted-foreground" />} action="Semua riwayat" actionTo="/app/history" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {orderHistory.slice(0, 2).map(o => (
            <Card key={o.id} className="p-4 flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary font-display font-bold">
                {o.tenant.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{o.tenant}</div>
                <div className="text-xs text-muted-foreground">{o.date} · {o.items} item</div>
              </div>
              <div className="text-right">
                <div className="font-display font-bold">{rupiah(o.total)}</div>
                <Badge variant={o.status === "Selesai" ? "secondary" : "destructive"} className="mt-1 text-[10px]">{o.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, icon, action, actionTo }: { title: string; icon?: React.ReactNode; action?: string; actionTo?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-display text-xl font-bold">{title}</h2>
      </div>
      {action && (actionTo ? (
        <Link to={actionTo} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          {action} <ChevronRight className="h-3 w-3" />
        </Link>
      ) : (
        <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          {action} <ChevronRight className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
}

function MenuCard({ m }: { m: typeof menus[number] }) {
  return (
    <Link to="/app/menu/$id" params={{ id: m.id }}>
      <Card className="overflow-hidden group cursor-pointer transition hover:-translate-y-1 hover:shadow-glow h-full">
        <div className="relative aspect-square overflow-hidden">
          <img src={m.image} alt={m.name} className="h-full w-full object-cover transition group-hover:scale-105" />
          {m.tags?.[0] && (
            <Badge className="absolute left-2 top-2 rounded-full bg-background/95 text-foreground border-none">{m.tags[0]}</Badge>
          )}
        </div>
        <div className="p-3">
          <div className="text-[11px] text-muted-foreground">{m.tenant}</div>
          <div className="font-display font-semibold truncate">{m.name}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="font-display font-bold text-primary">{rupiah(m.price)}</div>
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-warning text-warning" /> {m.rating}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
