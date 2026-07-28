import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { menus, rupiah } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Star, Clock, AlertCircle, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/menu/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Detail Menu — Kantin Pintar` },
      { name: "description", content: "Detail menu, harga, rating, dan pilihan tambahan." },
      { property: "og:title", content: `Detail Menu — Kantin Pintar` },
      { property: "og:description", content: "Detail menu, harga, rating, dan pilihan tambahan." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const m = menus.find(x => x.id === id) ?? menus[0];
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const nav = useNavigate();

  const addonTotal = m.addons.filter(a => selected.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const total = (m.price + addonTotal) * qty;

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/app" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <Card className="overflow-hidden p-0 shadow-soft">
          <img src={m.image} alt={m.name} className="w-full aspect-square object-cover" />
        </Card>

        <div>
          <div className="text-sm text-muted-foreground">{m.tenant}</div>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-extrabold">{m.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /> <b>{m.rating}</b> (128 ulasan)</span>
            <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" /> {m.prepTime}</span>
            <Badge variant={m.stock > 5 ? "secondary" : "destructive"}>Stok {m.stock}</Badge>
          </div>

          <div className="mt-6 font-display text-3xl font-extrabold text-primary">{rupiah(m.price)}</div>

          <p className="mt-4 text-muted-foreground leading-relaxed">{m.description}</p>

          <Card className="mt-6 p-4 flex items-start gap-3 border-warning/30 bg-warning/5">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold">Informasi alergen</div>
              <div className="text-muted-foreground">Mengandung: {m.allergens.join(", ")}</div>
            </div>
          </Card>

          <Separator className="my-6" />

          <h3 className="font-display font-bold">Tambahan</h3>
          <div className="mt-3 space-y-2">
            {m.addons.map(a => (
              <label key={a.id} className="flex cursor-pointer items-center justify-between rounded-xl border p-3 transition hover:border-primary/50">
                <div className="flex items-center gap-3">
                  <Checkbox checked={selected.includes(a.id)} onCheckedChange={(c) => setSelected(s => c ? [...s, a.id] : s.filter(x => x !== a.id))} />
                  <span className="text-sm font-medium">{a.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">+ {rupiah(a.price)}</span>
              </label>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <div className="font-display font-bold">Jumlah</div>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="outline" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-8 text-center font-display text-lg font-bold">{qty}</span>
              <Button size="icon" variant="outline" onClick={() => setQty(q => q + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border p-4">
            <div>
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-display text-2xl font-extrabold">{rupiah(total)}</div>
            </div>
            <Button size="lg" className="gap-2 flex-1 max-w-xs" onClick={() => { toast.success("Ditambahkan ke keranjang"); nav({ to: "/app/cart" }); }}>
              <ShoppingBag className="h-4 w-4" /> Tambah ke Keranjang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
