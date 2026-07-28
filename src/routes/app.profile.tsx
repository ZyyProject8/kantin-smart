import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Moon, ShieldCheck, LogOut, ChevronRight, Wallet, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profil — Kantin Pintar" },
      { name: "description", content: "Kelola profil dan preferensi Anda." },
      { property: "og:title", content: "Profil — Kantin Pintar" },
      { property: "og:description", content: "Kelola profil dan preferensi Anda." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="p-6 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://i.pravatar.cc/100?img=47" />
          <AvatarFallback>DP</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-bold truncate">Dinda Puspita</h2>
          <p className="text-sm text-muted-foreground truncate">dinda@sekolah.id</p>
          <p className="text-xs text-muted-foreground">+62 812 3456 7890</p>
        </div>
        <Button variant="outline" size="sm">Edit</Button>
      </Card>

      <Card className="p-4">
        <h3 className="px-2 pb-2 text-xs uppercase tracking-wider text-muted-foreground">Akun</h3>
        <Row icon={Wallet} label="Saldo Kartu Pelajar" value="Rp125.000" />
        <Separator />
        <Row icon={ShieldCheck} label="Keamanan" />
        <Separator />
        <Row icon={HelpCircle} label="Bantuan" />
      </Card>

      <Card className="p-4">
        <h3 className="px-2 pb-2 text-xs uppercase tracking-wider text-muted-foreground">Preferensi</h3>
        <ToggleRow icon={Bell} label="Notifikasi push" defaultChecked />
        <Separator />
        <ToggleRow icon={Moon} label="Tema gelap" />
      </Card>

      <Link to="/">
        <Button variant="outline" className="w-full gap-2 text-destructive"><LogOut className="h-4 w-4" /> Keluar</Button>
      </Link>
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
