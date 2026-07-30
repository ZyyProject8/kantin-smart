import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — Kantin Pintar" },
      { name: "description", content: "Masuk ke akun Kantin Pintar Anda." },
      { property: "og:title", content: "Masuk — Kantin Pintar" },
      { property: "og:description", content: "Masuk ke akun Kantin Pintar Anda." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState("dinda@sekolah.id");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Email dan kata sandi harus diisi.");
      return;
    }

    auth.login({ name: "Dinda Puspita", email, role: "Siswa" });
    toast.success("Berhasil masuk!");
    nav({ to: "/app" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 gradient-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <Logo className="[&_span]:text-primary-foreground [&_.gradient-primary]:bg-white/20" />
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight">Selamat datang kembali.</h2>
          <p className="mt-4 opacity-90">Menu favoritmu, tenant kesayangan, dan pesanan cepat — semua menunggumu.</p>
        </div>
        <div className="text-xs opacity-70">© 2026 Kantin Pintar</div>
      </div>

      <div className="flex flex-col p-6 md:p-10">
        <div className="lg:hidden"><Logo /></div>
        <div className="flex-1 grid place-items-center">
          <Card className="w-full max-w-md p-8 shadow-soft border-none">
            <h1 className="font-display text-3xl font-bold">Masuk</h1>
            <p className="mt-1 text-sm text-muted-foreground">Gunakan akun Anda untuk melanjutkan.</p>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@sekolah.id" className="pl-9 h-11" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Kata sandi</Label>
                  <a className="text-xs text-primary hover:underline" href="#">Lupa?</a>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kata sandi" className="pl-9 h-11" />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full gap-2 h-11">Masuk <ArrowRight className="h-4 w-4" /></Button>
            </form>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">atau</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <Button variant="outline" size="lg" className="w-full h-11">Masuk dengan Google</Button>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Belum punya akun? <Link to="/register" className="font-semibold text-primary hover:underline">Daftar</Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
