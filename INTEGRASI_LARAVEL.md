# Integrasi Laravel untuk Kantin Pintar

Dokumen ini panduan menghubungkan frontend prototype Kantin Pintar ke backend Laravel.

## Status Saat Ini

- Frontend menggunakan **mock data** (`src/lib/mock-data.ts`).
- Struktur API client & service layer sudah disiapkan di `src/lib/api/`.
- Semua halaman tetap berjalan tanpa backend.

## Cara Menghubungkan ke Laravel

### 1. Konfigurasi Environment

Salin `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Isi variabel:

```env
VITE_API_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
```

Restart dev server agar perubahan `.env.local` terbaca.

### 2. Endpoint Laravel yang Perlu Dibuat

| Resource | Method | Endpoint | Keterangan |
|----------|--------|----------|------------|
| Auth login | POST | `/api/login` | Return `{ user, token }` |
| Auth register | POST | `/api/register` | Return `{ user, token }` |
| Auth user | GET | `/api/user` | Return user saat ini |
| Auth logout | POST | `/api/logout` | - |
| Menus | GET | `/api/menus` | List menu (paginated) |
| Menu detail | GET | `/api/menus/{id}` | Detail menu |
| Categories | GET | `/api/categories` | List kategori |
| Orders | GET | `/api/orders` | Riwayat pesanan user |
| Order detail | GET | `/api/orders/{id}` | Tracking pesanan |
| Create order | POST | `/api/orders` | Checkout |
| Update status | PATCH | `/api/orders/{id}/status` | Seller update status |
| Kitchen orders | GET | `/api/orders/kitchen` | Pesanan aktif dapur |
| Tenants | GET | `/api/tenants` | List tenant |
| Tenant detail | GET | `/api/tenants/{id}` | - |
| Tenant menus | GET | `/api/tenants/{id}/menus` | Menu per tenant |
| Tenant sales | GET | `/api/tenants/{id}/sales-summary` | Statistik penjualan |

### 3. Struktur Folder API Frontend

```text
src/lib/api/
├── client.ts       # fetch client + error handling
├── types.ts        # kontrak tipe data API
├── index.ts        # exports
└── services/
    ├── auth.service.ts
    ├── menu.service.ts
    ├── order.service.ts
    └── tenant.service.ts
```

### 4. Cara Menggunakan di Komponen

```tsx
import { useQuery } from "@tanstack/react-query";
import { getMenus, getCategories } from "@/lib/api";

function MenuPage() {
  const { data: menus } = useQuery({
    queryKey: ["menus"],
    queryFn: () => getMenus({ page: 1 }),
  });

  return <MenuList menus={menus?.data ?? []} />;
}
```

### 5. Autentikasi

Default client mengirim `Authorization: Bearer <token>` dari `localStorage.getItem("laravel_token")`.

Kamu bisa ganti ke:
- **Laravel Sanctum** (SPA cookie auth): hapus header Authorization, aktifkan `credentials: "include"` (sudah aktif).
- **Laravel Passport**: tetap pakai Bearer token.

### 6. Tips Migrasi

1. Pastikan Laravel mengizinkan CORS untuk origin frontend.
2. Sesuaikan field response di `src/lib/api/types.ts` jika nama kolom Laravel berbeda.
3. Ganti mock fallback di service modules dengan pemanggilan API nyata.
4. Untuk fitur seller/admin, tambahkan middleware role di Laravel.

### 7. Catatan TanStack Start

Jika nanti butuh server-side rendering (SSR) atau menyembunyikan secret API, pindahkan pemanggilan API ke `createServerFn` di `src/lib/*.functions.ts`. Saat ini semua service berjalan di browser agar prototype tetap sederhana.
