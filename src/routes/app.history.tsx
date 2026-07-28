import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderHistory, rupiah } from "@/lib/mock-data";
import { Receipt } from "lucide-react";

export const Route = createFileRoute("/app/history")({
  head: () => ({
    meta: [
      { title: "Riwayat Pesanan — Kantin Pintar" },
      { name: "description", content: "Lihat semua riwayat pemesanan Anda." },
      { property: "og:title", content: "Riwayat Pesanan — Kantin Pintar" },
      { property: "og:description", content: "Lihat semua riwayat pemesanan Anda." },
    ],
  }),
  component: History,
});

function History() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold">Riwayat Pesanan</h1>
      <Tabs defaultValue="all" className="mt-4">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="done">Selesai</TabsTrigger>
          <TabsTrigger value="cancel">Dibatalkan</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 space-y-3">
        {orderHistory.map(o => (
          <Card key={o.id} className="p-5 flex items-center gap-4 transition hover:border-primary/50 cursor-pointer">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Receipt className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-display font-bold truncate">{o.tenant}</div>
                <Badge variant={o.status === "Selesai" ? "secondary" : "destructive"} className="text-[10px]">{o.status}</Badge>
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{o.date} · {o.items} item · #{o.id.toUpperCase()}</div>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold text-primary">{rupiah(o.total)}</div>
              <button className="text-xs text-muted-foreground hover:text-foreground">Detail</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
