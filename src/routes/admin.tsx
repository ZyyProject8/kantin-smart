import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { salesData, rupiah } from "@/lib/mock-data";
import { Users, Store, Wallet, ShoppingBag, ArrowUpRight, ArrowLeft, ShieldCheck, Plus, Trash2, LayoutDashboard, UtensilsCrossed, LogOut } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Admin — Smart Kantin" },
      { name: "description", content: "Ringkasan operasional platform Smart Kantin." },
      { property: "og:title", content: "Dashboard Admin — Smart Kantin" },
      { property: "og:description", content: "Ringkasan operasional platform Smart Kantin." },
    ],
  }),
  component: AdminDash,
});

const CATEGORIES = ["Makanan", "Minuman", "Snack", "Dessert", "Sehat"];

function AdminDash() {
  const auth = useAuth();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<"dashboard" | "menus">("dashboard");
  const [menus, setMenus] = useState<any[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "Makanan", image_url: "", stock: "10" });
  const [saving, setSaving] = useState(false);

  if (!auth.user) { nav({ to: "/login" }); return null; }

  if (auth.user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="max-w-md text-center p-8">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-destructive/10 text-destructive mb-6">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="font-display text-2xl font-bold">Akses Ditolak</h1>
          <p className="mt-3 text-muted-foreground">Halaman ini hanya dapat diakses oleh Admin.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/login"><button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Ganti Akun (Login)</button></Link>
            <Link to="/"><button className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium">Kembali ke Beranda</button></Link>
          </div>
        </div>
      </div>
    );
  }

  const fetchMenus = async () => {
    setLoadingMenus(true);
    try {
      const res = await fetch("/api/menu-items");
      const data = await res.json();
      setMenus(Array.isArray(data) ? data : []);
    } catch { toast.error("Gagal memuat menu"); }
    finally { setLoadingMenus(false); }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => { if (activeTab === "menus") fetchMenus(); }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus menu ini?")) return;
    await fetch(`/api/menu-items/${id}`, { method: "DELETE" });
    toast.success("Menu dihapus");
    fetchMenus();
  };

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.category) { toast.error("Nama, harga, dan kategori wajib diisi"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller_id: auth.user!.id,
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

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-card">
        <div className="p-6 border-b">
          <Logo />
          <Badge variant="secondary" className="mt-2 rounded-full">Admin</Badge>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("menus")}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === "menus" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <UtensilsCrossed className="h-4 w-4" /> Kelola Menu
          </button>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={() => { auth.logout(); nav({ to: "/login" }); }}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="glass border-b sticky top-0 z-30 lg:hidden">
          <div className="container-page flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo />
              <Badge variant="secondary" className="rounded-full">Admin</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant={activeTab === "dashboard" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("dashboard")}>Dashboard</Button>
              <Button variant={activeTab === "menus" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("menus")}>Menu</Button>
            </div>
          </div>
        </header>

        <main className="container-page py-8 space-y-8">
          {activeTab === "dashboard" && <DashboardView auth={auth} />}
          {activeTab === "menus" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-extrabold">Kelola Menu</h1>
                  <p className="text-muted-foreground">Semua menu dari seluruh tenant ({menus.length} menu)</p>
                </div>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="gap-2"><Plus className="h-4 w-4" /> Tambah Menu</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Tambah Menu Baru</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-1.5"><Label>Nama Menu</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Nasi Goreng Spesial" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5"><Label>Harga (Rp)</Label><Input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="15000" /></div>
                        <div className="space-y-1.5"><Label>Stok</Label><Input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} placeholder="20" /></div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Kategori</Label>
                        <Select value={form.category} onValueChange={v => setForm(f => ({...f, category: v}))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5"><Label>Deskripsi</Label><Textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Deskripsi menu..." /></div>
                      <div className="space-y-1.5"><Label>URL Gambar</Label><Input value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} placeholder="https://..." /></div>
                    </div>
                    <DialogFooter><Button onClick={handleAdd} disabled={saving}>{saving ? "Menyimpan..." : "Simpan Menu"}</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {loadingMenus ? (
                <div className="text-center py-16 text-muted-foreground">Memuat menu...</div>
              ) : menus.length === 0 ? (
                <Card className="p-16 text-center">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Belum ada menu. Tenant bisa tambah menu dari dashboard mereka, atau klik "Tambah Menu" di atas.</p>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {menus.map(m => (
                    <Card key={m.id} className="overflow-hidden group">
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
                        <div className="text-xs text-muted-foreground">{m.category} · {m.seller_name || "Admin"}</div>
                        <div className="font-display font-bold truncate mt-0.5">{m.name}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="font-display font-bold text-primary">{rupiah(m.price)}</div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(m.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardView({ auth }: { auth: any }) {
  const activities = [
    { user: "Bu Sri", action: "Menambahkan menu baru", time: "2 mnt lalu", avatar: 32 },
    { user: "Rizky A.", action: "Melakukan pesanan #K-2405", time: "5 mnt lalu", avatar: 12 },
    { user: "Kopi Kanti", action: "Menandai pesanan selesai", time: "10 mnt lalu", avatar: 5 },
    { user: "Admin", action: "Memverifikasi tenant baru", time: "1 jam lalu", avatar: 47 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Dashboard Admin</h1>
        <p className="text-muted-foreground">Selamat datang, {auth.user?.name}. Ringkasan operasional platform per hari ini.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={Wallet} label="Total Transaksi" value="Rp42.8jt" trend="+18%" />
        <Stat icon={Store} label="Total Tenant" value="84" trend="+3" />
        <Stat icon={Users} label="Total Pengguna" value="12.4k" trend="+412" />
        <Stat icon={ShoppingBag} label="Total Order" value="230.5k" trend="+7%" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg">Transaksi Mingguan</h3>
              <p className="text-xs text-muted-foreground">7 hari terakhir</p>
            </div>
            <Badge variant="secondary" className="rounded-full">+22%</Badge>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.19 258)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.58 0.19 258)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="value" stroke="oklch(0.58 0.19 258)" strokeWidth={3} fill="url(#ag)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-bold text-lg">Order per Hari</h3>
          <div className="mt-6 h-72">
            <ResponsiveContainer>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Bar dataKey="value" fill="oklch(0.58 0.19 258)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-display font-bold text-lg">Aktivitas Terbaru</h3>
        <div className="mt-4 space-y-2">
          {activities.map((a, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition">
              <Avatar className="h-9 w-9"><AvatarImage src={`https://i.pravatar.cc/40?img=${a.avatar}`} /><AvatarFallback>U</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm"><b>{a.user}</b> <span className="text-muted-foreground">{a.action}</span></div>
              </div>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value, trend }: any) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant="secondary" className="text-[10px] gap-0.5"><ArrowUpRight className="h-3 w-3" />{trend}</Badge>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-extrabold">{value}</div>
    </Card>
  );
}
