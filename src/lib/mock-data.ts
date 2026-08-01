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

export const tenants: any[] = [];

export const orderHistory: any[] = [];

export const testimonials = [
  { name: "Dinda P.", role: "Siswa SMA", text: "Bisa pesan dari kelas saat mau jam istirahat. Nanti pas ke kantin tinggal sebut nama, makanan udah siap!", avatar: "https://i.pravatar.cc/100?img=47" },
  { name: "Pak Rizky", role: "Guru", text: "Jam istirahat yang singkat jadi lebih efisien. Fitur live tracking status pesanannya sangat membantu.", avatar: "https://i.pravatar.cc/100?img=12" },
  { name: "Bu Sri", role: "Pemilik Tenant", text: "Order masuk rapi di aplikasi. Gak pusing lagi ngingetin siswa yang pesen, omzet juga makin bagus.", avatar: "https://i.pravatar.cc/100?img=32" },
];

export const faqs = [
  { q: "Apakah Smart Kantin berbayar?", a: "Aplikasi gratis untuk pembeli. Kami tidak membebankan biaya pelayanan apa pun ke siswa." },
  { q: "Bagaimana cara pengambilan pesanan?", a: "Tunggu status pesanan berubah menjadi 'Siap Diambil'. Setelah itu sebutkan nama pesananmu ke tenant untuk mengambil." },
  { q: "Apa saja metode pembayarannya?", a: "Kami saat ini hanya mendukung dua metode: pembayaran via QRIS dan pembayaran Tunai langsung di kasir tenant." },
  { q: "Bagaimana jika pesanan salah atau batal?", a: "Pesanan masih bisa dibatalkan dari aplikasi selama tenant belum mulai memasak pesananmu." },
];

export const salesData: any[] = [
  { day: "Sen", value: 0 },
  { day: "Sel", value: 0 },
  { day: "Rab", value: 0 },
  { day: "Kam", value: 0 },
  { day: "Jum", value: 0 },
  { day: "Sab", value: 0 },
  { day: "Min", value: 0 },
];

export const kitchenOrders: any[] = [];

export const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
