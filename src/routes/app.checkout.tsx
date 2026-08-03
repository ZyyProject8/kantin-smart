import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./__root";
import type { Order } from "./__root";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { menus, rupiah } from "@/lib/mock-data";
import { ArrowLeft, ShoppingBag, MapPin, Clock, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/app/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Smart Kantin" },
      { name: "description", content: "Konfirmasi pesanan Anda." },
      { property: "og:title", content: "Checkout — Smart Kantin" },
      { property: "og:description", content: "Konfirmasi pesanan Anda." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const nav = useNavigate();
  const auth = useAuth();
  const [time, setTime] = useState("12:15");
  const [paymentMethod, setPaymentMethod] = useState("QRIS");

  const items = auth.cartItems;
  const subtotal = items.reduce((s, i) => {
    const menu = menus.find((menu) => menu.id === i.id);
    const addonTotal = menu ? menu.addons.filter((a) => i.selectedAddons.includes(a.id)).reduce((sum, addon) => sum + addon.price, 0) : 0;
    return s + (i.price + addonTotal) * i.qty;
  }, 0);
  const total = subtotal;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!items.length) {
      toast.error("Keranjang kosong. Tambahkan menu terlebih dahulu.");
      return;
    }
    
    if (!auth.user) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Ambil seller_id dari item pertama (asumsi 1 order = 1 seller, atau fallback ke seller_id dari item mana pun)
      const sellerId = items[0]?.seller_id || null;
      
      const payload = {
        user_id: auth.user.id,
        seller_id: sellerId,
        items: items,
        total,
        payment_method: paymentMethod,
        pickup_time: time
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Gagal membuat pesanan");
      }

      const data = await res.json();
      
      auth.clearCart();
      toast.success(`Pesanan dikonfirmasi! Bayar via ${paymentMethod}`);
      nav({ to: "/app/tracking/$id", params: { id: data.id } });
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!auth.user) {
    return (
      <div className="mx-auto max-w-md text-center py-20">
        <p className="text-muted-foreground">Silakan masuk terlebih dahulu untuk checkout.</p>
        <Link to="/login"><Button className="mt-6">Masuk</Button></Link>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-md text-center py-20">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-muted">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold">Keranjang kosong</h2>
        <p className="mt-2 text-muted-foreground text-sm">Pilih menu dulu sebelum lanjut pembayaran.</p>
        <Link to="/app"><Button className="mt-6">Jelajahi Menu</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke keranjang
      </Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold">Checkout</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-display font-bold flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-primary" /> Ringkasan Pesanan</h3>
            <div className="mt-4 space-y-3">
              {items.map(i => (
                <div key={i.id} className="flex gap-3 items-center">
                  <img src={i.image} className="h-12 w-12 rounded-lg object-cover" alt={i.name} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{i.name}</div>
                    <div className="text-xs text-muted-foreground">{i.tenant}</div>
                  </div>
                  <div className="text-sm font-semibold">{rupiah(i.price)}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Metode Pengambilan</h3>
            <RadioGroup defaultValue="pickup" className="mt-4 grid gap-3 sm:grid-cols-2">
              <Label className="cursor-pointer flex items-start gap-3 rounded-xl border p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value="pickup" />
                <div>
                  <div className="font-semibold">Ambil Sendiri</div>
                  <div className="text-xs text-muted-foreground">Pickup di tenant</div>
                </div>
              </Label>
              <Label className="cursor-pointer flex items-start gap-3 rounded-xl border p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value="dinein" />
                <div>
                  <div className="font-semibold">Makan di Tempat</div>
                  <div className="text-xs text-muted-foreground">Dibawakan ke meja</div>
                </div>
              </Label>
            </RadioGroup>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-bold flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Waktu Pengambilan</h3>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {["12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45"].map(t => (
                <button key={t} onClick={() => setTime(t)} className={`rounded-lg border py-2 text-sm font-medium transition ${time === t ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50"}`}>{t}</button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-bold flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" /> Metode Pembayaran</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-4 space-y-2">
              {["QRIS", "Tunai"].map((m, i) => (
                <Label key={i} className="cursor-pointer flex items-center gap-3 rounded-xl border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                  <RadioGroupItem value={m} />
                  <span className="text-sm font-medium">{m}</span>
                </Label>
              ))}
            </RadioGroup>
          </Card>
        </div>

        <Card className="p-5 h-fit sticky top-24">
          <h3 className="font-display font-bold">Total Bayar</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between font-display text-xl font-extrabold"><span>Total</span><span className="text-primary">{rupiah(total)}</span></div>
          </div>
          <Button size="lg" className="w-full mt-6" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Konfirmasi Pesanan"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Dengan menekan konfirmasi, Anda menyetujui S&K.</p>
        </Card>
      </div>
    </div>
  );
}
