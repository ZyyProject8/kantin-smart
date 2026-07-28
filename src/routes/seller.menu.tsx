import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { menus, rupiah } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/seller/menu")({
  head: () => ({
    meta: [
      { title: "Kelola Menu — Kantin Pintar" },
      { name: "description", content: "Kelola daftar menu tenant Anda." },
      { property: "og:title", content: "Kelola Menu — Kantin Pintar" },
      { property: "og:description", content: "Kelola daftar menu tenant Anda." },
    ],
  }),
  component: SellerMenu,
});

function SellerMenu() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold truncate">Menu Saya</h1>
          <p className="text-muted-foreground text-sm">Total {menus.length} menu</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 shrink-0"><Plus className="h-4 w-4" /> Tambah</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Tambah Menu Baru</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5"><Label>Nama menu</Label><Input placeholder="Nasi Goreng Spesial" /></div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-1.5"><Label>Harga</Label><Input type="number" placeholder="15000" /></div>
                <div className="space-y-1.5"><Label>Stok</Label><Input type="number" placeholder="20" /></div>
              </div>
              <div className="space-y-1.5"><Label>Deskripsi</Label><Textarea placeholder="Deskripsi menu..." /></div>
            </div>
            <DialogFooter><Button>Simpan Menu</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari menu..." className="pl-9" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menus.map(m => (
          <Card key={m.id} className="overflow-hidden group">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={m.image} alt={m.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              <Badge className={`absolute top-2 right-2 ${m.stock > 5 ? "" : "bg-destructive"}`}>Stok {m.stock}</Badge>
            </div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground">{m.category}</div>
              <div className="font-display font-bold truncate">{m.name}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="font-display font-bold text-primary">{rupiah(m.price)}</div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
