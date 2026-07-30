import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { rupiah } from "@/lib/mock-data";
import { Plus, Trash2, Search, PackageX, UtensilsCrossed } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/seller/menu")({
  head: () => ({
    meta: [
      { title: "Kelola Menu — Kantin Pintar" },
      { name: "description", content: "Kelola daftar menu tenant Anda." },
    ],
  }),
  component: SellerMenu,
});

const CATEGORIES = ["Makanan", "Minuman", "Snack", "Dessert", "Sehat"];

function SellerMenu() {
  const auth = useAuth();
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "Makanan", image_url: "", stock: "10",
  });

  const sellerId = auth.user?.id;

  const fetchMenus = async () => {
    if (!sellerId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/menu-items?seller_id=${sellerId}`);
      const data = await res.json();
      setMenus(Array.isArray(data) ? data : []);
    } catch { toast.error("Gagal memuat menu"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMenus(); }, [sellerId]);

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Nama, harga, dan kategori wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller_id: sellerId,
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          image_url: form.image_url,
          stock: Number(form.stock),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Menu berhasil ditambahkan!");
      setAddOpen(false);
      setForm({ name: "", description: "", price: "", category: "Makanan", image_url: "", stock: "10" });
      fetchMenus();
    } catch { toast.error("Gagal menambahkan menu"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus menu ini?")) return;
    await fetch(`/api/menu-items/${id}`, { method: "DELETE" });
    toast.success("Menu dihapus");
    fetchMenus();
  };

  const handleToggleSoldOut = async (id: string, current: boolean) => {
    await fetch(`/api/menu-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_sold_out: !current }),
    });
    toast.success(!current ? "Menu ditandai Sold Out" : "Menu kembali tersedia");
    fetchMenus();
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    await fetch(`/api/menu-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock }),
    });
    setMenus(prev => prev.map(m => m.id === id ? { ...m, stock: newStock } : m));
  };

  const filtered = menus.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold truncate">Menu Saya</h1>
          <p className="text-muted-foreground text-sm">Total {menus.length} menu</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 shrink-0"><Plus className="h-4 w-4" /> Tambah</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Tambah Menu Baru</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5"><Label>Nama Menu</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Nasi Goreng Spesial" /></div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-1.5"><Label>Harga (Rp)</Label><Input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="15000" /></div>
                <div className="space-y-1.5"><Label>Stok Awal</Label><Input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} placeholder="20" /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Kategori</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({...f, category: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Deskripsi</Label><Textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Deskripsi menu..." /></div>
              <div className="space-y-1.5"><Label>URL Gambar (opsional)</Label><Input value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} placeholder="https://..." /></div>
            </div>
            <DialogFooter><Button onClick={handleAdd} disabled={saving}>{saving ? "Menyimpan..." : "Simpan Menu"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari menu..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Memuat menu...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-16 text-center">
          <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">{search ? "Tidak ada menu yang cocok." : "Belum ada menu. Klik 'Tambah' untuk mulai!"}</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(m => (
            <Card key={m.id} className={`overflow-hidden group ${m.is_sold_out ? "opacity-70" : ""}`}>
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-4xl">🍽️</div>
                )}
                <Badge className={`absolute top-2 right-2 ${m.is_sold_out ? "bg-destructive" : m.stock <= 5 ? "bg-orange-500" : ""}`}>
                  {m.is_sold_out ? "Sold Out" : `Stok ${m.stock}`}
                </Badge>
              </div>
              <div className="p-4">
                <div className="text-xs text-muted-foreground">{m.category}</div>
                <div className="font-display font-bold truncate">{m.name}</div>
                <div className="mt-1 text-xs text-muted-foreground line-clamp-1">{m.description}</div>

                {/* Stock control */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Stok:</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleUpdateStock(m.id, m.stock - 1)} className="h-6 w-6 rounded border text-sm flex items-center justify-center hover:bg-muted">−</button>
                    <span className="w-8 text-center text-sm font-bold">{m.stock}</span>
                    <button onClick={() => handleUpdateStock(m.id, m.stock + 1)} className="h-6 w-6 rounded border text-sm flex items-center justify-center hover:bg-muted">+</button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="font-display font-bold text-primary">{rupiah(m.price)}</div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={m.is_sold_out ? "default" : "outline"}
                      className="h-7 text-xs gap-1"
                      onClick={() => handleToggleSoldOut(m.id, m.is_sold_out)}
                    >
                      <PackageX className="h-3 w-3" />
                      {m.is_sold_out ? "Tersedia" : "Sold Out"}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
