import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./__root";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Daftar — Kantin Pintar" },
      { name: "description", content: "Buat akun Kantin Pintar dalam 30 detik." },
      { property: "og:title", content: "Daftar — Kantin Pintar" },
      { property: "og:description", content: "Buat akun Kantin Pintar dalam 30 detik." },
    ],
  }),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const auth = useAuth();
  const [name, setName] = useState("Dinda P.");
  const [email, setEmail] = useState("dinda@sekolah.id");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("siswa");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Semua bidang harus diisi.");
      return;
    }
    auth.login({ name, email, role });
    toast.success("Akun berhasil dibuat!");
    nav({ to: "/app" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10 order-2 lg:order-1">
        <Logo />
        <div className="flex-1 grid place-items-center">
          <Card className="w-full max-w-md p-8 shadow-soft border-none">
            <h1 className="font-display text-3xl font-bold">Buat akun</h1>
            <p className="mt-1 text-sm text-muted-foreground">Gratis. Hanya butuh 30 detik.</p>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Nama lengkap</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label>Peran</Label>
                  <Select value={role} onValueChange={(value) => setRole(value)}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="siswa">Siswa / Mahasiswa</SelectItem>
                      <SelectItem value="pegawai">Pegawai</SelectItem>
                      <SelectItem value="tenant">Penjual Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="nama@sekolah.id" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>Nomor HP</Label>
                <Input type="tel" placeholder="0812xxxxxxxx" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>Kata sandi</Label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Minimal 8 karakter" className="h-11" />
              </div>
              <Button type="submit" size="lg" className="w-full gap-2 h-11">Daftar <ArrowRight className="h-4 w-4" /></Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sudah punya akun? <Link to="/login" className="font-semibold text-primary hover:underline">Masuk</Link>
            </p>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-between p-10 gradient-primary text-primary-foreground relative overflow-hidden order-1 lg:order-2">
        <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="text-right text-xs opacity-70">Gratis · Tanpa kartu kredit</div>
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight">Bergabunglah dengan 12.000+ pengguna.</h2>
          <p className="mt-4 opacity-90">Kantin sekolah dan kampus se-Indonesia mempercayakan alur pemesanan mereka pada kami.</p>
        </div>
        <div className="text-xs opacity-70">© 2026 Kantin Pintar</div>
      </div>
    </div>
  );
}
