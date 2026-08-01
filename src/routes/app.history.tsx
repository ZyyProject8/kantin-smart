import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { rupiah } from "@/lib/mock-data";
import { useAuth } from "./__root";
import { Receipt, ShoppingBag, Clock } from "lucide-react";

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
  if (status === "selesai") return "secondary";
  if (status === "dibatalkan") return "destructive";
  return "default";
}

function statusLabel(status: string) {
  if (status === "selesai") return "Selesai";
  if (status === "dibatalkan") return "Dibatalkan";
  return "Diproses";
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
  const itemNames = o.items?.map((i: any) => i.name).join(", ") || "-";
  return (
    <Card className="p-5 flex items-start gap-4 transition hover:border-primary/50">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Receipt className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="font-display font-bold truncate">#{o.id}</div>
          <Badge variant={statusVariant(o.status)} className="text-[10px]">{statusLabel(o.status)}</Badge>
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground truncate">{itemNames}</div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{o.date}</span>
          <span className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" />{o.paymentMethod}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-display font-extrabold text-primary">{rupiah(o.total)}</div>
        {o.status === "diproses" && (
          <Link to="/app/tracking/$id" params={{ id: o.id }}>
            <button className="mt-1 text-xs text-primary hover:underline">Lacak</button>
          </Link>
        )}
      </div>
    </Card>
  );
}

function History() {
  const auth = useAuth();
  const orders = auth.orders;
  const done = orders.filter(o => o.status === "selesai" || o.status === "diproses");
  const cancelled = orders.filter(o => o.status === "dibatalkan");

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
            : orders.map(o => <OrderCard key={o.id} o={o} />)
          }
        </TabsContent>

        <TabsContent value="done" className="mt-6 space-y-3">
          {done.length === 0
            ? <EmptyState msg="Belum ada pesanan aktif atau selesai." />
            : done.map(o => <OrderCard key={o.id} o={o} />)
          }
        </TabsContent>

        <TabsContent value="cancel" className="mt-6 space-y-3">
          {cancelled.length === 0
            ? <EmptyState msg="Tidak ada pesanan yang dibatalkan." />
            : cancelled.map(o => <OrderCard key={o.id} o={o} />)
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}

