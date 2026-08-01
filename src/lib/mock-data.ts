export type MenuItem = {
  id: string;
  name: string;
  tenant: string;
  tenantId: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  prepTime: string;
  allergens: string[];
  addons: { id: string; name: string; price: number }[];
  variants?: { id: string; name: string; options: string[]; required: boolean }[];
  tags?: string[];
};

const img = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=800&q=80`;

export const menus: MenuItem[] = [];

export const categories = [
  { id: "c1", name: "Nasi", icon: "🍚" },
  { id: "c2", name: "Mie", icon: "🍜" },
  { id: "c3", name: "Minuman", icon: "🥤" },
  { id: "c4", name: "Snack", icon: "🍪" },
  { id: "c5", name: "Sehat", icon: "🥗" },
  { id: "c6", name: "Dessert", icon: "🍰" },
];

export const tenants = [];

export const orderHistory = [];

export const testimonials = [
  { name: "Dinda P.", role: "Mahasiswa UI", text: "Nggak perlu antri lagi! Pesan dari kelas, langsung ambil. Life saver banget.", avatar: "https://i.pravatar.cc/100?img=47" },
  { name: "Rizky A.", role: "Pegawai Kantor", text: "Break makan siang jadi efisien. Suka fitur tracking dan QR pickup-nya.", avatar: "https://i.pravatar.cc/100?img=12" },
  { name: "Bu Sri", role: "Pemilik Tenant", text: "Order masuk rapi di kitchen display. Omzet naik 30% sejak pakai Kantin Pintar.", avatar: "https://i.pravatar.cc/100?img=32" },
];

export const faqs = [
  { q: "Apakah Kantin Pintar berbayar?", a: "Aplikasi gratis untuk pembeli. Tenant hanya membayar biaya administrasi kecil per transaksi sukses." },
  { q: "Bagaimana cara pengambilan pesanan?", a: "Tunjukkan QR Code pickup di aplikasi ke tenant. Cepat, tanpa antri." },
  { q: "Apakah bisa membayar tunai?", a: "Bisa. Kami mendukung pembayaran tunai, e-wallet, dan saldo kartu pelajar." },
  { q: "Bagaimana jika pesanan salah?", a: "Hubungi customer service in-app. Kami akan bantu proses refund dalam 1x24 jam." },
];

export const salesData = [
  { day: "Sen", value: 0 },
  { day: "Sel", value: 0 },
  { day: "Rab", value: 0 },
  { day: "Kam", value: 0 },
  { day: "Jum", value: 0 },
  { day: "Sab", value: 0 },
  { day: "Min", value: 0 },
];

export const kitchenOrders = [];

export const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
