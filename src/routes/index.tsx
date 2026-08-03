import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/logo";
import { testimonials, faqs } from "@/lib/mock-data";
import {
  ArrowRight, QrCode, Clock, Sparkles, ShieldCheck, Smartphone, Star,
  ChefHat, ChartLine, ScanLine, ShoppingBag, Zap, HeartHandshake,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Kantin — Pesan Makan Kantin Tanpa Antri" },
      { name: "description", content: "Platform pemesanan makanan kantin untuk sekolah, kampus, dan perkantoran. Pesan dari kelas, ambil tanpa antri dengan QR pickup." },
      { property: "og:title", content: "Smart Kantin — Pesan Makan Kantin Tanpa Antri" },
      { property: "og:description", content: "Platform pemesanan makanan kantin untuk sekolah, kampus, dan perkantoran." },
    ],
  }),
  component: Landing,
});

function Nav() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#fitur" className="text-sm font-medium text-muted-foreground hover:text-foreground">Fitur</a>
          <a href="#cara" className="text-sm font-medium text-muted-foreground hover:text-foreground">Cara Kerja</a>
          <a href="#testi" className="text-sm font-medium text-muted-foreground hover:text-foreground">Testimoni</a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Masuk</Button></Link>
          <Link to="/register"><Button size="sm" className="gap-1">Daftar <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 md:py-24 lg:py-32">
        <div className="flex flex-col justify-center animate-fade-in">
          <Badge variant="secondary" className="mb-5 w-fit gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Baru · Siap Sambut Semester Baru!
          </Badge>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Jajan di kantin sekolah, <span className="text-primary">makin praktis.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Pesan jajan favoritmu dari kelas sebelum kehabisan! Bayar lebih gampang pakai QRIS, pantau status pesananmu, dan tinggal jemput makanan di tenant saat notifikasi siap berbunyi. Lebih santai, perut auto kenyang!
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/app"><Button size="lg" className="gap-2 shadow-glow">Pesan Sekarang <ArrowRight className="h-4 w-4" /></Button></Link>
            <a href="#cara"><Button size="lg" variant="outline">Lihat Cara Kerja</Button></a>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <div className="flex -space-x-2">
              {[47, 12, 32, 5].map(i => (
                <img key={i} src={`https://i.pravatar.cc/40?img=${i}`} alt="user" className="h-9 w-9 rounded-full border-2 border-background" />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1">
                {Array.from({length: 5}).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />)}
                <span className="ml-1 font-semibold">4.9/5</span>
              </div>
              <p className="text-muted-foreground">Dipakai 12.000+ pengguna</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-[3rem] gradient-primary opacity-10 blur-3xl" />
          <div className="grid grid-cols-6 grid-rows-6 gap-4 h-[520px]">
            <Card className="col-span-4 row-span-4 overflow-hidden p-0 shadow-glow">
              <img src="/image/risol.jpg" alt="menu" className="h-full w-full object-cover" />
            </Card>
            <Card className="col-span-2 row-span-2 flex flex-col justify-between p-4">
              <ScanLine className="h-6 w-6 text-primary" />
              <div>
                <div className="font-display text-2xl font-bold">2 mnt</div>
                <div className="text-xs text-muted-foreground">Rata-rata pickup</div>
              </div>
            </Card>
            <Card className="col-span-2 row-span-2 flex flex-col justify-between p-4 gradient-primary text-primary-foreground">
              <Zap className="h-6 w-6" />
              <div>
                <div className="font-display text-2xl font-bold">+30%</div>
                <div className="text-xs opacity-90">Omzet tenant</div>
              </div>
            </Card>
            <Card className="col-span-2 row-span-2 overflow-hidden p-0">
              <img src="/image/ayam.jpg" alt="makanan" className="h-full w-full object-cover" />
            </Card>
            <Card className="col-span-4 row-span-2 flex items-center gap-4 p-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold">Pesanan aman & tercatat</div>
                <div className="truncate text-xs text-muted-foreground">Refund otomatis jika ada kendala</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { icon: ShoppingBag, title: "Pilih Menu", desc: "Jelajahi menu dari berbagai tenant favorit di kantin sekolahmu." },
  { icon: QrCode, title: "Pembayaran Mudah", desc: "Pilih metode pembayaran yang kamu mau, bisa via QRIS atau bayar Tunai di kasir." },
  { icon: Smartphone, title: "Ambil Pesanan", desc: "Tunggu notifikasi pesanan siap, lalu sebutkan nama pesananmu ke tenant untuk mengambil makanan dengan tertib." },
];

function HowItWorks() {
  return (
    <section id="cara" className="py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full">Cara Kerja</Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Tiga langkah, satu perut kenyang.</h2>
          <p className="mt-3 text-muted-foreground">Alur pemesanan dirancang seramah mungkin untuk semua pengguna.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title} className="group relative overflow-hidden p-6 transition-all hover:-translate-y-1 hover:shadow-glow">
              <div className="absolute right-4 top-4 font-display text-6xl font-black text-muted/40">0{i+1}</div>
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: Clock, title: "Hemat Waktu", desc: "Pesan dari kelas, ambil di jam istirahat. Tidak buang waktu antri." },
  { icon: ChefHat, title: "Kitchen Display Modern", desc: "Tenant kelola pesanan dengan tampilan dapur yang rapi & efisien." },
  { icon: ChartLine, title: "Analitik untuk Tenant", desc: "Lihat menu terlaris, jam sibuk, dan pertumbuhan pendapatan real-time." },
  { icon: HeartHandshake, title: "Ramah Semua Pengguna", desc: "Dirancang untuk siswa, mahasiswa, pegawai, hingga admin sekolah." },
];

function Features() {
  return (
    <section id="fitur" className="border-y bg-surface py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div className="text-center md:text-left">
            <Badge className="bg-primary/10 text-primary border-none mb-4 px-4 py-1.5 text-sm">Keunggulan</Badge>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Kantin Kekinian, Khusus Buat Kamu yang Anti Ribet!
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Fokus pada pengalaman — bukan sekadar kasir digital. Semua orang, dari siswa sampai admin, mendapat interface yang jelas.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(f => (
              <Card key={f.title} className="p-5 transition-all hover:border-primary/50">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Preview() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page grid items-center gap-12 md:grid-cols-2">
        <div className="relative">
          <div className="absolute -inset-10 -z-10 rounded-full gradient-primary opacity-20 blur-3xl" />
          <div className="mx-auto aspect-[9/18] max-w-[280px] rounded-[2.5rem] border-8 border-foreground bg-foreground p-1 shadow-2xl">
            <div className="h-full w-full overflow-hidden rounded-[2rem] bg-background">
              <img src="/image/risol.jpg" alt="preview" className="h-1/2 w-full object-cover" />
              <div className="p-4">
                <div className="text-xs text-muted-foreground">Menu Populer</div>
                <div className="font-display text-lg font-bold">Risol Bites</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-display font-bold text-primary">Rp4.000</div>
                  <Link to="/app"><Button size="sm" className="h-8">+ Pesan</Button></Link>
                </div>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full gradient-primary" />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Sedang dimasak · 6 mnt</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Badge variant="secondary" className="mb-4 rounded-full">Preview Aplikasi</Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Terasa cepat. Terlihat premium.</h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Animasi halus, tipografi enak dibaca, dan hierarki visual yang jelas. Dibuat mobile-first untuk pengalaman di setiap layar.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
            {[
              { k: "12k+", v: "Pengguna" },
              { k: "80+", v: "Tenant" },
              { k: "230k", v: "Order" },
            ].map(s => (
              <div key={s.v}>
                <div className="font-display text-3xl font-extrabold text-gradient">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testi() {
  return (
    <section id="testi" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full">Testimoni</Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Disukai oleh pengguna nyata.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map(t => (
            <Card key={t.name} className="p-6">
              <div className="flex items-center gap-1 text-warning">
                {Array.from({length: 5}).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full" />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container-page max-w-3xl">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 rounded-full">FAQ</Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Pertanyaan yang sering diajukan</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i-${i}`}>
              <AccordionTrigger className="text-left font-display font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container-page pb-20">
      <div className="overflow-hidden rounded-3xl gradient-primary p-10 md:p-16 text-primary-foreground relative">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">Siap pesan makan hari ini?</h2>
            <p className="mt-2 opacity-90 max-w-lg">Bergabung dengan ribuan pengguna dan puluhan tenant yang sudah beralih ke Smart Kantin.</p>
          </div>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="gap-2">Mulai Sekarang <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-surface">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Smart Kantin — Platform digital pemesanan makanan kantin untuk sekolah, kampus, dan perkantoran modern.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold">Produk</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#fitur" className="hover:text-foreground">Fitur</a></li>
            <li><a href="#cara" className="hover:text-foreground">Cara Kerja</a></li>
            <li><Link to="/app" className="hover:text-foreground">Aplikasi Pembeli</Link></li>
            <li><Link to="/seller" className="hover:text-foreground">Untuk Tenant</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold">Perusahaan</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Tentang</li>
            <li>Karier</li>
            <li>Kontak</li>
            <li><Link to="/admin" className="hover:text-foreground">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © 2026 Smart Kantin. Dibuat dengan sepenuh hati untuk kantin Indonesia.
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Preview />
        <Testi />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
