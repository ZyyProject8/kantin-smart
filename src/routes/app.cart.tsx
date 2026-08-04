import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { rupiah } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/cart")({
  head: () => ({
    meta: [
      { title: "Keranjang — Smart Kantin" },
      { name: "description", content: "Ringkasan pesanan Anda." },
      { property: "og:title", content: "Keranjang — Smart Kantin" },
      { property: "og:description", content: "Ringkasan pesanan Anda." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const auth = useAuth();
  const [note, setNote] = useState("");
  const items = auth.cartItems;

  const subtotal = items.reduce((s, i) => {
    const addonTotal = Array.isArray(i.addons) 
      ? i.addons.filter((a: any) => i.selectedAddons.includes(a.id)).reduce((sum: number, addon: any) => sum + addon.price, 0) 
      : 0;
    return s + (i.price + addonTotal) * i.qty;
  }, 0);
  const total = subtotal;

  if (!auth.user) {
    return (
      <div className="mx-auto max-w-md text-center py-20">
        <p className="text-muted-foreground">Silakan masuk terlebih dahulu untuk melihat keranjang.</p>
        <Link to="/login"><Button className="mt-6">Masuk</Button></Link>
      </div>
    );
  }

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
            <Card key={i.cartItemId} className="p-4 flex gap-4">
              <img src={i.image} alt={i.name} className="h-20 w-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">{i.tenant}</div>
                <div className="font-display font-semibold truncate">{i.name}</div>
                <div className="mt-1 font-display font-bold text-primary">{rupiah(i.price)}</div>
                {i.selectedVariants && Object.keys(i.selectedVariants).length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Varian: {Object.entries(i.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ")}
                  </div>
                )}
                {i.selectedAddons.length > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Tambahan: {Array.isArray(i.addons) ? i.addons.filter((a: any) => i.selectedAddons.includes(a.id)).map((a: any) => a.name).join(", ") : ""}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => auth.removeFromCart(i.cartItemId)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => auth.updateQty(i.cartItemId, Math.max(1, i.qty - 1))}><Minus className="h-3 w-3" /></Button>
                  <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => auth.updateQty(i.cartItemId, i.qty + 1)}><Plus className="h-3 w-3" /></Button>
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
            <div className="flex justify-between font-display text-lg font-bold"><span>Total</span><span className="text-primary">{rupiah(total)}</span></div>
          </div>
          <Link to="/app/checkout"><Button size="lg" className="w-full mt-6">Checkout</Button></Link>
        </Card>
      </div>
    </div>
  );
}
