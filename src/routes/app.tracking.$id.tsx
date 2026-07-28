import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChefHat, ShoppingBag, PartyPopper, QrCode, MapPin } from "lucide-react";

export const Route = createFileRoute("/app/tracking/$id")({
  head: () => ({
    meta: [
      { title: "Tracking Pesanan — Kantin Pintar" },
      { name: "description", content: "Pantau status pesanan Anda secara real-time." },
      { property: "og:title", content: "Tracking Pesanan — Kantin Pintar" },
      { property: "og:description", content: "Pantau status pesanan Anda secara real-time." },
    ],
  }),
  component: Tracking,
});

const steps = [
  { key: "received", label: "Pesanan Diterima", desc: "Tenant sudah menerima pesananmu", icon: Check },
  { key: "cooking", label: "Sedang Dimasak", desc: "Chef sedang menyiapkan pesanan", icon: ChefHat },
  { key: "ready", label: "Siap Diambil", desc: "Tunjukkan QR pickup di tenant", icon: ShoppingBag },
  { key: "done", label: "Selesai", desc: "Selamat menikmati!", icon: PartyPopper },
];

function Tracking() {
  const { id } = Route.useParams();
  const currentIdx = 1;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground">Pesanan #{id}</div>
          <h1 className="mt-1 font-display text-3xl font-extrabold truncate">Sedang dimasak...</h1>
        </div>
        <Badge className="shrink-0 gradient-primary text-primary-foreground border-none">Aktif</Badge>
      </div>

      <Card className="mt-6 p-6 md:p-8">
        <div className="relative space-y-6">
          {steps.map((s, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition ${done || active ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[40px] mt-2 ${done ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className={`font-display font-bold ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                  {active && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-primary font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                      Estimasi 6 menit lagi
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="mt-6 p-5 flex items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold">Warung Bu Sri</div>
          <div className="text-xs text-muted-foreground">Blok A, Meja 3 · Kantin Utama</div>
        </div>
      </Card>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link to="/app/pickup/$id" params={{ id }}>
          <Button size="lg" className="w-full gap-2"><QrCode className="h-4 w-4" /> Tampilkan QR Pickup</Button>
        </Link>
        <Link to="/app">
          <Button size="lg" variant="outline" className="w-full">Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
}
