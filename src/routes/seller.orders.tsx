import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { kitchenOrders as initial } from "@/lib/mock-data";
import { ChefHat, Check, ArrowRight, Bell } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/seller/orders")({
  head: () => ({
    meta: [
      { title: "Pesanan Masuk — Smart Kantin" },
      { name: "description", content: "Kitchen display untuk mengelola pesanan tenant." },
      { property: "og:title", content: "Pesanan Masuk — Smart Kantin" },
      { property: "og:description", content: "Kitchen display untuk mengelola pesanan tenant." },
    ],
  }),
  component: SellerOrders,
});

const columns = [
  { key: "new", label: "Pesanan Baru", icon: Bell, color: "bg-primary/10 text-primary" },
  { key: "cooking", label: "Sedang Diproses", icon: ChefHat, color: "bg-warning/15 text-warning" },
  { key: "ready", label: "Siap Diambil", icon: Check, color: "bg-success/15 text-success" },
  { key: "done", label: "Selesai", icon: Check, color: "bg-muted text-muted-foreground" },
];

function SellerOrders() {
  const [orders, setOrders] = useState(initial);

  const move = (id: string, next: string) => {
    setOrders(list => list.map(o => o.id === id ? { ...o, status: next } : o));
    toast.success(`Pesanan ${id} → ${columns.find(c => c.key === next)?.label}`);
  };

  const nextStatus = (s: string) => ({ new: "cooking", cooking: "ready", ready: "done" } as const)[s as "new" | "cooking" | "ready"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Kitchen Display</h1>
        <p className="text-muted-foreground text-sm">Kelola pesanan secara visual, kolom per status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map(col => {
          const list = orders.filter(o => o.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`grid h-8 w-8 place-items-center rounded-lg ${col.color}`}><col.icon className="h-4 w-4" /></div>
                  <h3 className="font-display font-bold">{col.label}</h3>
                </div>
                <Badge variant="secondary">{list.length}</Badge>
              </div>
              <div className="space-y-3 min-h-[300px] rounded-2xl bg-muted/50 p-3">
                {list.map(o => (
                  <Card key={o.id} className="p-4 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div className="font-display font-bold">{o.id}</div>
                      <span className="text-xs text-muted-foreground">{o.time}</span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{o.customer}</div>
                    <div className="mt-3 space-y-1">
                      {o.items.map((it: any, i: number) => (
                        <div key={i} className="text-sm flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {it}
                        </div>
                      ))}
                    </div>
                    {nextStatus(o.status) && (
                      <Button size="sm" className="mt-4 w-full gap-1" onClick={() => move(o.id, nextStatus(o.status)!)}>
                        Pindah ke {columns.find(c => c.key === nextStatus(o.status))?.label}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </Card>
                ))}
                {list.length === 0 && (
                  <div className="grid place-items-center py-10 text-xs text-muted-foreground">Kosong</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
