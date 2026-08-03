import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { rupiah } from "@/lib/mock-data";
import { useAuth } from "./__root";
import { Receipt, ShoppingBag, Clock, ChevronDown, ChevronUp, MapPin, CreditCard } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/history")({
  head: () => ({
    meta: [
      { title: "Riwayat Pesanan — Smart Kantin" },
      { name: "description", content: "Lihat semua riwayat pemesanan Anda." },
      { property: "og:title", content: "Riwayat Pesanan — Smart Kantin" },
      { property: "og:description", content: "Lihat semua riwayat pemesanan Anda." },
    ],
  }),
  component: History,
});

function statusVariant(status: string) {
  if (status === "completed") return "secondary";
  if (status === "cancelled") return "destructive";
  return "default";
}

function statusLabel(status: string) {
  if (status === "completed") return "Selesai";
  if (status === "cancelled") return "Dibatalkan";
  if (status === "pending") return "Menunggu";
  if (status === "confirmed") return "Dikonfirmasi";
  if (status === "preparing") return "Dimasak";
  if (status === "ready") return "Siap Diambil";
  return "Diproses";
}

function statusColor(status: string) {
  if (status === "completed") return "text-success";
  if (status === "cancelled") return "text-destructive";
  return "text-primary";
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-muted mb-4">
        <Receipt className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">{msg}</p>
      <Link to="/app"><Button className="mt-6">Mulai Pesan</Button></Link>
    </div>
  );
}

function OrderCard({ o }: { o: any }) {
  const [expanded, setExpanded] = useState(false);
  const itemNames = o.items?.map((i: any) => i.name).join(", ") || "-";

  // Hitung subtotal tiap item
  const itemsWithTotal = (o.items ?? []).map((i: any) => ({
    ...i,
    subtotal: (i.price ?? 0) * (i.qty ?? 1),
  }));

  return (
    <Card className={`overflow-hidden transition hover:border-primary/50 ${expanded ? "border-primary/40" : ""}`}>
      {/* Header row */}
      <div className="p-5 flex items-start gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 ${statusColor(o.status)}`}>
          <Receipt className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-display font-bold truncate">#{o.id.slice(-8).toUpperCase()}</div>
            <Badge variant={statusVariant(o.status)} className="text-[10px]">{statusLabel(o.status)}</Badge>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground truncate">{itemNames}</div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{o.date}</span>
            <span className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" />{o.paymentMethod}</span>
          </div>
        </div>
        <div className="text-right shrink-0 flex flex-col items-end gap-1">
          <div className="font-display font-extrabold text-primary">{rupiah(o.total)}</div>
          {o.status === "diproses" && (
            <Link to="/app/tracking/$id" params={{ id: o.id }}>
              <button className="text-xs text-primary hover:underline">Lacak →</button>
            </Link>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-1 flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            {expanded ? <><ChevronUp className="h-3 w-3" /> Sembunyikan</> : <><ChevronDown className="h-3 w-3" /> Lihat Nota</>}
          </button>
        </div>
      </div>

      {/* Nota / Detail */}
      {expanded && (
        <div className="border-t bg-muted/30 px-5 py-4 space-y-4">
          {/* Rincian item */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Rincian Pesanan</h4>
            <div className="space-y-2">
              {itemsWithTotal.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-base shrink-0">🍽️</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{item.name}</div>
                    {item.selectedVariants && Object.values(item.selectedVariants).length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {Object.values(item.selectedVariants).join(", ")}
                      </div>
                    )}
                    {item.selectedAddons?.length > 0 && (
                      <div className="text-xs text-muted-foreground">+ {item.selectedAddons.join(", ")}</div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground">{item.qty}× {rupiah(item.price ?? 0)}</div>
                    <div className="text-sm font-bold">{rupiah(item.subtotal)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed" />

          {/* Info tambahan */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4 shrink-0" />
              <div>
                <div className="font-medium text-foreground">Pembayaran</div>
                <div>{o.paymentMethod || "-"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <div>
                <div className="font-medium text-foreground">Pickup</div>
                <div>{o.pickupTime || "-"}</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed" />

          {/* Total summary */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({o.items?.length ?? 0} item)</span>
              <span>{rupiah(o.total)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Biaya layanan</span>
              <span className="text-success">Gratis</span>
            </div>
            <div className="flex justify-between font-display font-extrabold text-base pt-1 border-t">
              <span>Total Bayar</span>
              <span className="text-primary">{rupiah(o.total)}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function History() {
  const auth = useAuth();
  const userId = auth.user?.id;

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`/api/orders?user_id=${userId}`);
      if (!res.ok) throw new Error("Gagal mengambil data pesanan");
      return res.json();
    },
    enabled: !!userId,
    refetchInterval: 15000 // Auto-refresh setiap 15 detik
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center text-destructive">
        <p>Gagal memuat riwayat pesanan.</p>
      </div>
    );
  }

  // Pemetaan status:
  // "done" tab: diproses (pending, confirmed, preparing, ready) dan selesai (completed)
  // "cancel" tab: dibatalkan (cancelled)
  const done = orders.filter((o: any) => o.status !== "cancelled");
  const cancelled = orders.filter((o: any) => o.status === "cancelled");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold">Riwayat Pesanan</h1>
      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">Semua ({orders.length})</TabsTrigger>
          <TabsTrigger value="done">Aktif & Selesai ({done.length})</TabsTrigger>
          <TabsTrigger value="cancel">Dibatalkan ({cancelled.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-3">
          {orders.length === 0
            ? <EmptyState msg="Belum ada pesanan. Yuk mulai pesan!" />
            : orders.map((o: any) => <OrderCard key={o.id} o={{
                ...o,
                date: new Date(o.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
                paymentMethod: o.payment_method,
                pickupTime: o.pickup_time
              }} />)
          }
        </TabsContent>

        <TabsContent value="done" className="mt-6 space-y-3">
          {done.length === 0
            ? <EmptyState msg="Belum ada pesanan aktif atau selesai." />
            : done.map((o: any) => <OrderCard key={o.id} o={{
                ...o,
                date: new Date(o.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
                paymentMethod: o.payment_method,
                pickupTime: o.pickup_time
              }} />)
          }
        </TabsContent>

        <TabsContent value="cancel" className="mt-6 space-y-3">
          {cancelled.length === 0
            ? <EmptyState msg="Tidak ada pesanan yang dibatalkan." />
            : cancelled.map((o: any) => <OrderCard key={o.id} o={{
                ...o,
                date: new Date(o.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
                paymentMethod: o.payment_method,
                pickupTime: o.pickup_time
              }} />)
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}
