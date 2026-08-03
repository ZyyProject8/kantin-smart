import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Check, ArrowRight, Bell } from "lucide-react";
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
  { key: "pending", label: "Pesanan Baru", icon: Bell, color: "bg-primary/10 text-primary" },
  { key: "preparing", label: "Sedang Diproses", icon: ChefHat, color: "bg-warning/15 text-warning" },
  { key: "ready", label: "Siap Diambil", icon: Check, color: "bg-success/15 text-success" }
];

function SellerOrders() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  
  const sellerId = auth.user?.id;

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["seller_orders", sellerId],
    queryFn: async () => {
      const res = await fetch(`/api/orders?seller_id=${sellerId}`);
      if (!res.ok) throw new Error("Gagal mengambil pesanan");
      return res.json();
    },
    refetchInterval: 10000 // Refresh tiap 10 detik
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Gagal update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller_orders", sellerId] });
    },
    onError: (e: any) => {
      toast.error(e.message || "Gagal update status pesanan");
    }
  });

  const move = (id: string, next: string) => {
    mutation.mutate({ id, status: next });
    
    // Tampilkan label sukses yang ramah
    let label = "selesai";
    if (next === "preparing") label = "Sedang Diproses";
    if (next === "ready") label = "Siap Diambil";
    toast.success(`Pesanan dipindahkan ke: ${label}`);
  };

  const nextStatus = (s: string) => {
    // kita asumsikan 'pending' -> 'preparing' -> 'ready' -> 'completed'
    if (s === "pending" || s === "confirmed") return "preparing";
    if (s === "preparing") return "ready";
    if (s === "ready") return "completed";
    return null;
  };
  
  const getNextLabel = (s: string) => {
    if (s === "pending" || s === "confirmed") return "Proses Pesanan";
    if (s === "preparing") return "Tandai Siap Diambil";
    if (s === "ready") return "Selesaikan Pesanan";
    return "";
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded"></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="h-[400px] bg-muted/50 rounded-2xl"></div>
          <div className="h-[400px] bg-muted/50 rounded-2xl"></div>
          <div className="h-[400px] bg-muted/50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Kitchen Display</h1>
        <p className="text-muted-foreground text-sm">Kelola pesanan secara visual, kolom per status. Sinkron otomatis setiap 10 detik.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {columns.map(col => {
          // Anggap 'confirmed' sama dengan 'pending' di kitchen display
          const list = orders.filter((o: any) => 
            o.status === col.key || (col.key === "pending" && o.status === "confirmed")
          );
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
                {list.map((o: any) => (
                  <Card key={o.id} className="p-4 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div className="font-display font-bold">#{o.id.split('-')[0]}</div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-semibold">{o.buyer_name || "Siswa"}</div>
                    
                    <div className="mt-3 space-y-1">
                      {o.items?.map((it: any, i: number) => (
                        <div key={i} className="text-sm flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> 
                          <div>
                            {it.qty}x {it.name}
                            {it.selectedVariants && Object.keys(it.selectedVariants).length > 0 && (
                              <span className="text-muted-foreground text-xs ml-1">
                                ({Object.values(it.selectedVariants).join(', ')})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-2 text-xs text-muted-foreground border-t pt-2 border-dashed">
                      <span className="font-medium">{o.payment_method}</span> • Pickup: <span className="font-medium">{o.pickup_time || '-'}</span>
                    </div>

                    {nextStatus(o.status) && (
                      <Button 
                        size="sm" 
                        className="mt-4 w-full gap-1" 
                        onClick={() => move(o.id, nextStatus(o.status)!)}
                        disabled={mutation.isPending}
                      >
                        {getNextLabel(o.status)}
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
