import { createFileRoute, Link } from "@tanstack/react-router";
import { menus, rupiah } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/cart")({
  head: () => ({
    meta: [
      { title: "Keranjang — Kantin Pintar" },
      { name: "description", content: "Ringkasan pesanan Anda." },
      { property: "og:title", content: "Keranjang — Kantin Pintar" },
      { property: "og:description", content: "Ringkasan pesanan Anda." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const [items, setItems] = useState([
    { ...menus[0], qty: 1 },
    { ...menus[2], qty: 2 },
  ]);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const service = 1000;
  const total = subtotal + service;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-20">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-muted">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold">Keranjang kosong</h2>
        <p className="mt-2 text-muted-foreground text-sm">Ayo mulai pilih menu favoritmu.</p>
        <Link to="/app"><Button className="mt-6">Jelajahi Menu</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/app" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Lanjut belanja
      </Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold">Keranjang</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          {items.map(i => (
            <Card key={i.id} className="p-4 flex gap-4">
              <img src={i.image} alt={i.name} className="h-20 w-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">{i.tenant}</div>
                <div className="font-display font-semibold truncate">{i.name}</div>
                <div className="mt-1 font-display font-bold text-primary">{rupiah(i.price)}</div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => setItems(list => list.filter(x => x.id !== i.id))} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setItems(list => list.map(x => x.id === i.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}><Minus className="h-3 w-3" /></Button>
                  <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setItems(list => list.map(x => x.id === i.id ? { ...x, qty: x.qty + 1 } : x))}><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
            </Card>
          ))}

          <Card className="p-4">
            <label className="text-sm font-semibold">Catatan untuk tenant</label>
            <Textarea placeholder="Contoh: nasi setengah, tidak pedas..." className="mt-2" />
          </Card>
        </div>

        <Card className="p-5 h-fit sticky top-24">
          <h3 className="font-display font-bold">Ringkasan</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{rupiah(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Biaya layanan</span><span>{rupiah(service)}</span></div>
            <Separator className="my-3" />
            <div className="flex justify-between font-display text-lg font-bold"><span>Total</span><span className="text-primary">{rupiah(total)}</span></div>
          </div>
          <Link to="/app/checkout"><Button size="lg" className="w-full mt-6">Checkout</Button></Link>
        </Card>
      </div>
    </div>
  );
}
