import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, ShieldCheck, LogOut, ChevronRight, HelpCircle, User } from "lucide-react";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profil — Smart Kantin" },
      { name: "description", content: "Kelola profil dan preferensi Anda." },
      { property: "og:title", content: "Profil — Smart Kantin" },
      { property: "og:description", content: "Kelola profil dan preferensi Anda." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const auth = useAuth();
  const nav = useNavigate();
  const user = auth.user;
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  const handleLogout = () => {
    auth.logout();
    nav({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="p-6 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-bold truncate">{user?.name || "Pengguna"}</h2>
          <p className="text-sm text-muted-foreground truncate">{user?.email || "-"}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role || "-"}</p>
        </div>
        <Button variant="outline" size="sm">Edit</Button>
      </Card>

      <Card className="p-4">
        <h3 className="px-2 pb-2 text-xs uppercase tracking-wider text-muted-foreground">Akun</h3>
        <Row icon={User} label="Akun & Keamanan" />
        <Separator />
        <Row icon={ShieldCheck} label="Privasi" />
        <Separator />
        <Row icon={HelpCircle} label="Bantuan" />
      </Card>

      <Card className="p-4">
        <h3 className="px-2 pb-2 text-xs uppercase tracking-wider text-muted-foreground">Preferensi</h3>
        <ToggleRow icon={Bell} label="Notifikasi push" defaultChecked />
      </Card>

      <Button variant="outline" className="w-full gap-2 text-destructive" onClick={handleLogout}>
        <LogOut className="h-4 w-4" /> Keluar
      </Button>
    </div>
  );
}

function Row({ icon: Icon, label, value }: any) {
  return (
    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      {value && <span className="text-sm text-muted-foreground">{value}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function ToggleRow({ icon: Icon, label, defaultChecked }: any) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
