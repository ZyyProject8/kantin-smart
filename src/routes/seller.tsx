import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, ArrowLeft } from "lucide-react";
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
                <Badge variant="secondary" className="rounded-full">Warung Bu Sri</Badge>
                <span className="text-xs text-muted-foreground">Tenant Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://i.pravatar.cc/100?img=32" />
                  <AvatarFallback>BS</AvatarFallback>
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
