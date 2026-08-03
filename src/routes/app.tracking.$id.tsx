import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChefHat, ShoppingBag, PartyPopper, MapPin, X } from "lucide-react";
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

import { useQuery } from "@tanstack/react-query";

const steps = [
  { key: "pending", label: "Pesanan Diterima", desc: "Menunggu konfirmasi tenant", icon: Check },
  { key: "confirmed", label: "Dikonfirmasi", desc: "Pesanan segera disiapkan", icon: Check },
  { key: "preparing", label: "Sedang Dimasak", desc: "Chef sedang menyiapkan pesanan", icon: ChefHat },
  { key: "ready", label: "Siap Diambil", desc: "Sebutkan namamu di kasir tenant", icon: ShoppingBag },
  { key: "completed", label: "Selesai", desc: "Selamat menikmati!", icon: PartyPopper },
];

function Tracking() {
  const { id } = Route.useParams();
  const auth = useAuth();
  const nav = useNavigate();
  const notifiedRef = useRef(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Pesanan tidak ditemukan");
      return res.json();
    },
    refetchInterval: 5000 // Auto refresh tiap 5 detik
  });

  const isCancelled = order?.status === "cancelled";
  
  // Hitung step index berdasarkan status DB
  let currentIdx = 0;
  if (order?.status) {
    currentIdx = steps.findIndex(s => s.key === order.status);
    if (currentIdx === -1) currentIdx = 0;
  }

  useEffect(() => {
    if (order?.status === "ready" && !notifiedRef.current) {
      notifiedRef.current = true;
      toast.success("🎉 Pesanan kamu sudah SIAP! Segera ambil ke tenant ya!", { duration: 8000 });
    }
  }, [order?.status]);

  const handleCancel = async () => {
    if (currentIdx >= 2) { // preparing, ready, completed
      toast.error("Pesanan sudah dimasak, tidak bisa dibatalkan lagi.");
      return;
    }
    
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Gagal membatalkan pesanan");
      toast.success("Pesanan berhasil dibatalkan.");
      nav({ to: "/app/history" });
    } catch (e: any) {
      toast.error(e.message || "Gagal membatalkan pesanan");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl text-center py-20 animate-pulse">
        Memuat status pesanan...
      </div>
    );
  }

  const statusLabel = isCancelled
    ? "Pesanan Dibatalkan"
    : (steps[currentIdx]?.label || "Menunggu");
  const isActive = !isCancelled && currentIdx < steps.length - 1;

  if (isCancelled) {
    return (
      <div className="mx-auto max-w-3xl text-center py-20">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-destructive/10 text-destructive mb-6">
          <X className="h-10 w-10" />
        </div>
        <h1 className="font-display text-3xl font-extrabold">Pesanan Dibatalkan</h1>
        <p className="mt-3 text-muted-foreground">Pesanan #{id.split('-')[0]} telah dibatalkan. Kamu bisa pesan menu lain kapan saja!</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/app"><Button>Pesan Lagi</Button></Link>
          <Link to="/app/history"><Button variant="outline">Lihat Riwayat</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground">Pesanan #{id.split('-')[0]}</div>
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
                  {i === 3 && done && (
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
          <div className="font-semibold">Tenant Kantin</div>
          <div className="text-xs text-muted-foreground">Area Kantin Utama</div>
        </div>
      </Card>

      <div className="mt-4 space-y-3">
        {currentIdx === 3 && (
          <Card className="p-5 border-primary/50 bg-primary/5 text-center">
            <div className="text-sm text-muted-foreground mb-1">Ambil pesanan atas nama:</div>
            <div className="font-display text-2xl font-bold text-primary">{auth.user?.name || "Pengguna"}</div>
          </Card>
        )}
        <Link to="/app">
          <Button size="lg" variant="outline" className="w-full">Kembali ke Beranda</Button>
        </Link>
        {currentIdx < 2 && (
          <Button size="lg" variant="destructive" className="w-full gap-2" onClick={handleCancel}>
            <X className="h-4 w-4" /> Batalkan Pesanan
          </Button>
        )}
      </div>
    </div>
  );
}

