import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/app/pickup/$id")({
  head: () => ({
    meta: [
      { title: "QR Pickup — Kantin Pintar" },
      { name: "description", content: "Tunjukkan QR ini ke tenant untuk mengambil pesanan." },
      { property: "og:title", content: "QR Pickup — Kantin Pintar" },
      { property: "og:description", content: "Tunjukkan QR ini ke tenant untuk mengambil pesanan." },
    ],
  }),
  component: Pickup,
});

// SVG placeholder QR
function QRPlaceholder() {
  const cells = Array.from({ length: 21 * 21 }, () => Math.random() > 0.5);
  return (
    <svg viewBox="0 0 21 21" className="h-64 w-64">
      {cells.map((v, i) => v && (
        <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" fill="currentColor" />
      ))}
      {/* corner squares */}
      {[[0,0],[14,0],[0,14]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width="7" height="7" fill="currentColor" />
          <rect x={x+1} y={y+1} width="5" height="5" fill="white" />
          <rect x={x+2} y={y+2} width="3" height="3" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

function Pickup() {
  const { id } = Route.useParams();
  return (
    <div className="mx-auto max-w-md">
      <Link to="/app/tracking/$id" params={{ id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <Card className="mt-4 overflow-hidden">
        <div className="gradient-primary p-6 text-primary-foreground text-center">
          <div className="text-xs uppercase tracking-wider opacity-80">Kode Pickup</div>
          <div className="mt-1 font-display text-3xl font-extrabold">#{id}</div>
        </div>
        <div className="p-8 flex flex-col items-center">
          <div className="rounded-2xl border-2 border-dashed p-6 text-foreground">
            <QRPlaceholder />
          </div>
          <div className="mt-6 text-center">
            <div className="font-display text-2xl font-bold">Tunjukkan ke tenant</div>
            <p className="mt-2 text-sm text-muted-foreground">Warung Bu Sri · Blok A, Meja 3</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 w-full text-center text-sm">
            <div className="rounded-xl bg-muted p-3">
              <div className="text-xs text-muted-foreground">Estimasi Siap</div>
              <div className="font-display font-bold">12:15</div>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-display font-bold">Rp31.000</div>
            </div>
          </div>
          <Link to="/app/history" className="w-full">
            <Button className="w-full mt-6" size="lg">Selesai</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
