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
  tags?: string[];
};

const img = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=800&q=80`;

export const menus: MenuItem[] = [
  {
    id: "m1",
    name: "Nasi Ayam Geprek",
    tenant: "Warung Bu Sri",
    tenantId: "t1",
    price: 18000,
    rating: 4.8,
    image: img("1546069901-ba9599a7e63c"),
    category: "Nasi",
    description: "Nasi hangat dengan ayam geprek renyah, sambal bawang, dan lalapan segar.",
    stock: 24,
    prepTime: "10-15 mnt",
    allergens: ["Gluten"],
    addons: [
      { id: "a1", name: "Ekstra Sambal", price: 2000 },
      { id: "a2", name: "Telur Ceplok", price: 4000 },
      { id: "a3", name: "Es Teh Manis", price: 4000 },
    ],
    tags: ["Populer"],
  },
  {
    id: "m2",
    name: "Mie Ayam Bakso",
    tenant: "Mie Kang Asep",
    tenantId: "t2",
    price: 15000,
    rating: 4.7,
    image: img("1568901346375-23c9450c58cd"),
    category: "Mie",
    description: "Mie ayam kenyal dengan bakso sapi dan kuah kaldu gurih.",
    stock: 12,
    prepTime: "8-12 mnt",
    allergens: ["Gluten", "Kedelai"],
    addons: [
      { id: "a1", name: "Ekstra Bakso", price: 5000 },
      { id: "a2", name: "Pangsit Goreng", price: 4000 },
    ],
    tags: ["Baru"],
  },
  {
    id: "m3",
    name: "Es Kopi Susu Aren",
    tenant: "Kopi Kanti",
    tenantId: "t3",
    price: 12000,
    rating: 4.9,
    image: img("1461023058943-07fcbe16d735"),
    category: "Minuman",
    description: "Espresso, susu segar, dan gula aren cair. Perfect pick-me-up.",
    stock: 40,
    prepTime: "3-5 mnt",
    allergens: ["Susu"],
    addons: [
      { id: "a1", name: "Ekstra Shot", price: 4000 },
      { id: "a2", name: "Oat Milk", price: 5000 },
    ],
    tags: ["Favorit"],
  },
  {
    id: "m4",
    name: "Sate Ayam Madura",
    tenant: "Sate Pak Kumis",
    tenantId: "t4",
    price: 22000,
    rating: 4.6,
    image: img("1529563021893-cc83c992d75d"),
    category: "Nasi",
    description: "10 tusuk sate ayam bumbu kacang khas Madura, disajikan dengan lontong.",
    stock: 8,
    prepTime: "12-18 mnt",
    allergens: ["Kacang"],
    addons: [{ id: "a1", name: "Ekstra Lontong", price: 3000 }],
  },
  {
    id: "m5",
    name: "Salad Buah Segar",
    tenant: "Fresh Corner",
    tenantId: "t5",
    price: 14000,
    rating: 4.5,
    image: img("1490474418585-ba9bad8fd0ea"),
    category: "Sehat",
    description: "Campuran buah musiman dengan yoghurt madu dan granola.",
    stock: 15,
    prepTime: "2 mnt",
    allergens: ["Susu"],
    addons: [{ id: "a1", name: "Ekstra Granola", price: 3000 }],
    tags: ["Sehat"],
  },
  {
    id: "m6",
    name: "Roti Bakar Coklat Keju",
    tenant: "Snack Point",
    tenantId: "t6",
    price: 10000,
    rating: 4.4,
    image: img("1509440159596-0249088772ff"),
    category: "Snack",
    description: "Roti bakar dengan coklat leleh dan keju parut melimpah.",
    stock: 20,
    prepTime: "5 mnt",
    allergens: ["Gluten", "Susu"],
    addons: [{ id: "a1", name: "Ekstra Keju", price: 3000 }],
  },
];

export const categories = [
  { id: "c1", name: "Nasi", icon: "🍚" },
  { id: "c2", name: "Mie", icon: "🍜" },
  { id: "c3", name: "Minuman", icon: "🥤" },
  { id: "c4", name: "Snack", icon: "🍪" },
  { id: "c5", name: "Sehat", icon: "🥗" },
  { id: "c6", name: "Dessert", icon: "🍰" },
];

export const tenants = [
  { id: "t1", name: "Warung Bu Sri", rating: 4.8, orders: 1240, image: img("1552566626-52f8b828add9") },
  { id: "t2", name: "Mie Kang Asep", rating: 4.7, orders: 980, image: img("1555396273-367ea4eb4db5") },
  { id: "t3", name: "Kopi Kanti", rating: 4.9, orders: 2100, image: img("1445116572660-236099ec97a0") },
  { id: "t4", name: "Sate Pak Kumis", rating: 4.6, orders: 760, image: img("1600891964092-4316c288032e") },
];

export const orderHistory = [
  { id: "o1", date: "27 Jul 2026", tenant: "Warung Bu Sri", items: 2, total: 22000, status: "Selesai" },
  { id: "o2", date: "26 Jul 2026", tenant: "Kopi Kanti", items: 1, total: 12000, status: "Selesai" },
  { id: "o3", date: "24 Jul 2026", tenant: "Mie Kang Asep", items: 3, total: 45000, status: "Selesai" },
  { id: "o4", date: "22 Jul 2026", tenant: "Sate Pak Kumis", items: 1, total: 22000, status: "Dibatalkan" },
];

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
  { day: "Sen", value: 420 },
  { day: "Sel", value: 380 },
  { day: "Rab", value: 520 },
  { day: "Kam", value: 610 },
  { day: "Jum", value: 780 },
  { day: "Sab", value: 340 },
  { day: "Min", value: 290 },
];

export const kitchenOrders = [
  { id: "#K-2401", customer: "Dinda P.", items: ["Nasi Ayam Geprek", "Es Teh Manis"], status: "new", time: "2 mnt lalu" },
  { id: "#K-2402", customer: "Rizky A.", items: ["Mie Ayam Bakso"], status: "new", time: "3 mnt lalu" },
  { id: "#K-2403", customer: "Sarah M.", items: ["Es Kopi Susu Aren", "Roti Bakar"], status: "cooking", time: "6 mnt lalu" },
  { id: "#K-2404", customer: "Adi W.", items: ["Sate Ayam"], status: "cooking", time: "9 mnt lalu" },
  { id: "#K-2405", customer: "Fajar T.", items: ["Salad Buah Segar"], status: "ready", time: "12 mnt lalu" },
  { id: "#K-2406", customer: "Nina R.", items: ["Nasi Ayam Geprek"], status: "done", time: "20 mnt lalu" },
];

export const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
