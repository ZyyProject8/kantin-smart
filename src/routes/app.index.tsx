import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rupiah } from "@/lib/mock-data";
import { Search, Sparkles, UtensilsCrossed, Coffee, ShoppingCart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Beranda — Smart Kantin" },
      { name: "description", content: "Menu populer, tenant favorit, dan rekomendasi untukmu." },
      { property: "og:title", content: "Beranda — Smart Kantin" },
      { property: "og:description", content: "Menu populer, tenant favorit, dan rekomendasi untukmu." },
    ],
  }),
  component: BuyerHome,
});

type Tab = "semua" | "makanan" | "minuman";

function BuyerHome() {
  const auth = useAuth();
  const nav = useNavigate();
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("semua");

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/menu-items");
      const data = await res.json();
      setMenus(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMenus(); }, [fetchMenus]);

  const filtered = menus.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.description || "").toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeTab === "makanan") return m.category !== "Minuman";
    if (activeTab === "minuman") return m.category === "Minuman";
    return true;
  });

  const handleAddToCart = (m: any) => {
    if (m.is_sold_out || m.stock <= 0) {
      toast.error("Menu ini sudah habis / Sold Out");
      return;
    }
    if (m.variants && m.variants.length > 0) {
      nav({ to: "/app/menu/$id", params: { id: m.id } });
      return;
    }
    // Build a compatible menu object for addToCart
    const menuItem = {
      id: m.id,
      name: m.name,
      price: m.price,
      image: m.image_url || "",
      tenant: m.seller_name || "Tenant",
      tenantId: m.seller_id || "",
      category: m.category,
      description: m.description || "",
      stock: m.stock,
      rating: 0,
      prepTime: "",
      allergens: [],
      addons: [],
    };
    auth.addToCart(menuItem as any, 1, [], {});
    toast.success(`${m.name} ditambahkan ke keranjang!`);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 11) return "Selamat pagi";
    if (h < 15) return "Selamat siang";
    if (h < 18) return "Selamat sore";
    return "Selamat malam";
  };

  const userName = auth.user?.name?.split(" ")[0] || "Kamu";

  return (
    <div className="space-y-10">
      {/* Greeting + search */}
      <section>
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">{greeting()},</p>
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">
            Mau makan apa hari ini, {userName}? 👋
          </h1>
        </div>
        <div className="mt-6 relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari menu atau kategori..."
            className="h-12 pl-11 rounded-xl bg-background"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("semua")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeTab === "semua" ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            Semua Menu
          </button>
          <button
            onClick={() => setActiveTab("makanan")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeTab === "makanan" ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            <UtensilsCrossed className="h-4 w-4" /> Makanan
          </button>
          <button
            onClick={() => setActiveTab("minuman")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeTab === "minuman" ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            <Coffee className="h-4 w-4" /> Minuman
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-16 text-center">
            <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground font-semibold">
              {search ? `Tidak ada menu "${search}"` : "Belum ada menu tersedia"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? "Coba kata kunci lain." : "Tenant belum menambahkan menu. Coba lagi nanti!"}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(m => (
              <Card key={m.id} className={`overflow-hidden group transition hover:shadow-md ${m.is_sold_out || m.stock <= 0 ? "opacity-60" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {m.image_url ? (
                    <Link to="/app/menu/$id" params={{ id: m.id }}>
                      <img src={m.image_url} alt={m.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                    </Link>
                  ) : (
                    <Link to="/app/menu/$id" params={{ id: m.id }} className="h-full w-full flex items-center justify-center text-5xl">
                      {m.category === "Minuman" ? "🥤" : m.category === "Snack" ? "🍪" : m.category === "Dessert" ? "🍰" : m.category === "Sehat" ? "🥗" : "🍽️"}
                    </Link>
                  )}
                  {(m.is_sold_out || m.stock <= 0) && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Badge className="bg-destructive text-white text-sm px-3 py-1">Sold Out</Badge>
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-black/50 text-white border-none">{m.category}</Badge>
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground">{m.seller_name || "Tenant"}</div>
                  <div className="font-display font-bold truncate mt-0.5">{m.name}</div>
                  {m.description && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{m.description}</div>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="font-display font-bold text-primary text-lg">{rupiah(m.price)}</div>
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={m.is_sold_out || m.stock <= 0}
                      onClick={() => handleAddToCart(m)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {m.is_sold_out || m.stock <= 0 ? "Habis" : "Tambah"}
                    </Button>
                  </div>
                  {!m.is_sold_out && m.stock > 0 && m.stock <= 5 && (
                    <p className="text-xs text-orange-500 mt-1 font-medium">⚠️ Sisa {m.stock} porsi</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
