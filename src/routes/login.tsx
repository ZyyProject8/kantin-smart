import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ArrowRight, Mail, Lock, GraduationCap, Store, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — Smart Kantin" },
      { name: "description", content: "Masuk ke akun Smart Kantin Anda." },
      { property: "og:title", content: "Masuk — Smart Kantin" },
      { property: "og:description", content: "Masuk ke akun Smart Kantin Anda." },
    ],
  }),
  component: Login,
});

type Role = "siswa" | "seller" | "admin";

function Login() {
  const nav = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Email dan kata sandi harus diisi.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk");
      }

      auth.login(data);
      toast.success(`Berhasil masuk sebagai ${data.name}!`);

      if (data.role === "admin") nav({ to: "/admin" });
      else if (data.role === "seller") nav({ to: "/seller" });
      else nav({ to: "/app" });
    } catch (err: any) {
      toast.error(err.message || "Email atau kata sandi salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-10 gradient-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <Logo className="[&_span]:text-primary-foreground [&_.gradient-primary]:bg-white/20" />
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight">
            Selamat datang kembali.
          </h2>
          <p className="mt-4 opacity-90">
            Menu favoritmu, tenant kesayangan, dan pesanan cepat — semua menunggumu.
          </p>
        </div>
        <div className="text-xs opacity-70">© 2026 Smart Kantin</div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col p-6 md:p-10">
        <div className="lg:hidden"><Logo /></div>
        <div className="flex-1 grid place-items-center">
          <Card className="w-full max-w-md p-8 shadow-soft border-none">
            <h1 className="font-display text-3xl font-bold">Masuk</h1>
            <p className="mt-1 text-sm text-muted-foreground">Gunakan akun yang telah terdaftar.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@sekolah.id"
                    className="pl-9 h-11"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Kata sandi</Label>
                  <a className="text-xs text-primary hover:underline" href="#">Lupa?</a>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="pl-9 h-11"
                  />
                </div>
              </div>
              <Button id="login-submit" type="submit" size="lg" disabled={isLoading} className="w-full gap-2 h-11">
                {isLoading ? "Masuk..." : <>Masuk <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Belum punya akun? <Link to="/register" className="font-semibold text-primary hover:underline">Daftar</Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
