import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChefHat, ShoppingBag, PartyPopper, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "./__root";

export const Route = createFileRoute("/app/tracking/$id")({
  head: () => ({
    meta: [
      { title: "Tracking Pesanan — Smart Kantin" },
      { name: "description", content: "Pantau status pesanan Anda secara real-time." },
      { property: "og:title", content: "Tracking Pesanan — Smart Kantin" },
      { property: "og:description", content: "Pantau status pesanan Anda secara real-time." },
    ],
  }),
  component: Tracking,
});

const steps = [
  { key: "received", label: "Pesanan Diterima", desc: "Tenant sudah menerima pesananmu", icon: Check },
  { key: "cooking", label: "Sedang Dimasak", desc: "Chef sedang menyiapkan pesanan", icon: ChefHat },
  { key: "ready", label: "Siap Diambil", desc: "Sebutkan namamu di kasir tenant", icon: ShoppingBag },
  { key: "done", label: "Selesai", desc: "Selamat menikmati!", icon: PartyPopper },
];

// Durasi tiap tahap dalam detik (bisa disesuaikan)
const STEP_DURATIONS = [
  5,    // received → 5 detik
  30,   // cooking → 30 detik (mode percobaan)
  0,    // ready (menunggu user ambil)
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m} mnt ${s} dtk lagi`;
  return `${s} detik lagi`;
}

function Tracking() {
  const { id } = Route.useParams();
  const auth = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(STEP_DURATIONS[0]);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (currentIdx >= STEP_DURATIONS.length) return;
    const duration = STEP_DURATIONS[currentIdx];
    if (duration === 0) return;

    setSecondsLeft(duration);
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          const next = currentIdx + 1;
          setCurrentIdx(next);
          // Notifikasi saat pesanan siap diambil
          if (next === 2 && !notifiedRef.current) {
            notifiedRef.current = true;
            toast.success("🎉 Pesanan kamu sudah SIAP! Segera ambil ke tenant ya!", {
              duration: 8000,
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIdx]);

  const statusLabel = ["Pesanan Diterima", "Sedang dimasak...", "Siap Diambil! 🎉", "Selesai"][currentIdx] || "Selesai";
  const isActive = currentIdx < steps.length - 1;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground">Pesanan #{id}</div>
          <h1 className="mt-1 font-display text-3xl font-extrabold truncate">{statusLabel}</h1>
        </div>
        <Badge className={`shrink-0 border-none ${isActive ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {isActive ? "Aktif" : "Selesai"}
        </Badge>
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
                  {active && STEP_DURATIONS[i] > 0 && secondsLeft > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-primary font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                      Estimasi {formatTime(secondsLeft)}
                    </div>
                  )}
                  {i === 2 && done && (
                    <div className="mt-2 text-xs font-semibold text-green-600">✅ Sudah diambil</div>
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
          <div className="font-semibold">Risol Tenant</div>
          <div className="text-xs text-muted-foreground">Area Kantin Utama</div>
        </div>
      </Card>

      <div className="mt-4">
        {currentIdx === 2 && (
          <Card className="mb-4 p-5 border-primary/50 bg-primary/5 text-center">
            <div className="text-sm text-muted-foreground mb-1">Ambil pesanan atas nama:</div>
            <div className="font-display text-2xl font-bold text-primary">{auth.user?.name || "Pengguna"}</div>
          </Card>
        )}
        <Link to="/app">
          <Button size="lg" variant="outline" className="w-full">Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
}
