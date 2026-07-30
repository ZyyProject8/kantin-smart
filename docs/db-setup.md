# Database setup (Kantin Pintar)

Panduan singkat untuk menyiapkan database Postgres lokal untuk pengembangan.

Prereqs:
- Docker & Docker Compose

Langkah:

1. Jalankan Postgres menggunakan Docker Compose:

```bash
docker compose up -d
```

2. Tunggu container sehat lalu jalankan migration SQL:

```bash
# jalankan migration dari host (psql harus terpasang):
psql "postgres://kantin_user:kantin_pass@localhost:5432/kantin_db" -f db/migrations/001_init.sql

# Atau gunakan docker exec:
CONTAINER_ID=$(docker ps --filter "ancestor=postgres:15" -q)
docker exec -i $CONTAINER_ID psql -U kantin_user -d kantin_db < db/migrations/001_init.sql
```

3. Konfigurasi environment di frontend atau backend:
- Salin `.env.example` menjadi `.env` (backend) atau set `DATABASE_URL` di lingkungan hosting.

Catatan:
- Skema ini merupakan schema awal minimal untuk `users`, `sellers`, `menus`, `menu_items`, `orders`, `order_items`, dan `carts`.
- Untuk penggunaan Laravel di tahap selanjutnya, Anda dapat mengonversi SQL ini menjadi migration Laravel (Artisan migrations) atau gunakan database yang sama dan buat migration laravel baru.

Seed contoh

Saya juga menambahkan seed contoh pada `db/seeds/001_seed.sql` yang akan:

- Membuat extension `pgcrypto` (untuk `gen_random_uuid`).
- Menambahkan beberapa user contoh (`admin`, `seller`, `customer`).
- Menambahkan entri `sellers`, `menus`, dan `menu_items` dasar.

Jalankan seed dengan perintah:

```bash
# Dari host (psql terpasang):
psql "postgres://kantin_user:kantin_pass@localhost:5432/kantin_db" -f db/seeds/001_seed.sql

# Atau gunakan docker exec:
CONTAINER_ID=$(docker ps --filter "ancestor=postgres:15" -q)
docker exec -i $CONTAINER_ID psql -U kantin_user -d kantin_db < db/seeds/001_seed.sql
```

## API Menu

Endpoint `menus` sekarang tersedia melalui server:

- `GET /api/menus?sellerId=<sellerId>` — ambil daftar menu milik seller.
- `POST /api/menus` — buat menu baru dengan body JSON `{ sellerId, title, description }`.
- `GET /api/menus/<id>` — ambil detail menu berdasarkan ID.
- `DELETE /api/menus/<id>` — hapus menu.

---

Integrasi aplikasi (Node/TanStack) — langkah cepat

1. Install dependensi `pg` di project:

```bash
# npm
npm install pg

# bun
bun add pg

# or yarn
yarn add pg
```

2. Atur `DATABASE_URL` di environment (lihat `.env.example`). Pada pengembangan, set di environment runner atau salin ke `.env` untuk backend yang akan Anda gunakan.

3. Contoh minimal client berada di `src/lib/db.ts` (PG Pool) dan contoh server function CRUD untuk `menus` ada di `src/serverFns/menus.ts`.

4. Cara menjalankan (setelah `docker compose up -d` dan migration dijalankan):

```bash
# jalankan dev server frontend seperti biasa
npm run dev
```

Catatan keamanan:
- Jangan commit kredensial nyata ke repository. Gunakan secret manager / environment variables di deploy.

