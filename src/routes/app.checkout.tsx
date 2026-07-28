import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
      { title: "Checkout — Kantin Pintar" },
      { name: "description", content: "Konfirmasi pesanan Anda." },
      { property: "og:title", content: "Checkout — Kantin Pintar" },
      { property: "og:description", content: "Konfirmasi pesanan Anda." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const nav = useNavigate();
  const items = [menus[0], menus[2]];
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const total = subtotal + 1000;
  const [time, setTime] = useState("12:15");

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
            <RadioGroup defaultValue="ewallet" className="mt-4 space-y-2">
              {["Saldo Kartu Pelajar", "E-Wallet (Gopay/OVO)", "Tunai saat pengambilan"].map((m, i) => (
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
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{rupiah(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Biaya layanan</span><span>{rupiah(1000)}</span></div>
            <Separator className="my-3" />
            <div className="flex justify-between font-display text-xl font-extrabold"><span>Total</span><span className="text-primary">{rupiah(total)}</span></div>
          </div>
          <Button size="lg" className="w-full mt-6" onClick={() => { toast.success("Pesanan dikonfirmasi!"); nav({ to: "/app/tracking/$id", params: { id: "K-2410" } }); }}>
            Konfirmasi Pesanan
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Dengan menekan konfirmasi, Anda menyetujui S&K.</p>
        </Card>
      </div>
    </div>
  );
}
