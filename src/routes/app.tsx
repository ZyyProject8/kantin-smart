import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { Logo } from "@/components/logo";
import { Home, Search, ShoppingBag, Clock, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const navItems = [
  { to: "/app", label: "Beranda", icon: Home, exact: true },
  { to: "/app/history", label: "Riwayat", icon: Clock, exact: false },
  { to: "/app/cart", label: "Keranjang", icon: ShoppingBag, exact: false },
  { to: "/app/profile", label: "Profil", icon: User, exact: false },
];

function AppLayout() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const nav = useNavigate();
  const auth = useAuth();

  if (!auth.user) {
    nav({ to: "/login" });
    return null;
  }

  return (
    <div className="min-h-screen bg-surface pb-24 md:pb-0">
      <header className="sticky top-0 z-30 glass border-b border-border/50">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8 min-w-0">
            <Logo />
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(n => {
                const active = n.exact ? pathname === n.to : pathname.startsWith(n.to) && n.to !== "/app";
                return (
                  <Link key={n.to} to={n.to} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <Link to="/app/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[10px]">{auth.cartItems.length}</Badge>
              </Button>
            </Link>
            <Link to="/app/profile">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://i.pravatar.cc/100?img=47" />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <main className="container-page py-6 md:py-10">
        <Outlet />
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-border/50 md:hidden">
        <div className="grid grid-cols-4">
          {navItems.map(n => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to) && n.to !== "/app";
            return (
              <Link key={n.to} to={n.to} className={`flex flex-col items-center gap-1 py-3 text-xs transition ${active ? "text-primary" : "text-muted-foreground"}`}>
                <n.icon className="h-5 w-5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
