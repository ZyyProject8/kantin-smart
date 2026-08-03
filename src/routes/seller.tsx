import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { Logo } from "@/components/logo";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, ArrowLeft, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/seller")({
  component: SellerLayout,
});

const items = [
  { to: "/seller", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/seller/menu", label: "Menu", icon: UtensilsCrossed, exact: false },
  { to: "/seller/orders", label: "Pesanan", icon: ClipboardList, exact: false },
];

function SellerLayout() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const auth = useAuth();
  const nav = useNavigate();

  if (!auth.user) {
    nav({ to: "/login" });
    return null;
  }

  if (auth.user.role !== "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="max-w-md text-center p-8">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-destructive/10 text-destructive mb-6">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="font-display text-2xl font-bold">Akses Ditolak</h1>
          <p className="mt-3 text-muted-foreground">Halaman ini hanya dapat diakses oleh Penjual/Tenant. Harap login dengan akun Penjual terlebih dahulu.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/login"><button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Ganti Akun (Login)</button></Link>
            <Link to="/"><button className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium">Kembali ke Beranda</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="grid md:grid-cols-[240px_1fr]">
        <aside className="hidden md:flex flex-col border-r bg-background p-4 h-screen sticky top-0">
          <Logo />
          <nav className="mt-8 space-y-1">
            {items.map(n => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-1">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
              <Settings className="h-4 w-4" /> Pengaturan
            </button>
            <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Situs
            </Link>
          </div>
        </aside>

        <div>
          <header className="glass border-b sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 h-16">
              <div className="md:hidden"><Logo /></div>
              <div className="hidden md:flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">{auth.user.name}</Badge>
                <span className="text-xs text-muted-foreground">Tenant Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{auth.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <nav className="flex md:hidden overflow-x-auto border-t px-2">
              {items.map(n => {
                const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
                return (
                  <Link key={n.to} to={n.to} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
                    <n.icon className="h-4 w-4" /> {n.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <main className="p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
