# CraftByHanifa — Official Web Platform & Admin Studio

> Platform e-commerce souvenir kerajinan tangan, lilin aromaterapi premium (_scented soy candle_), dan workshop studio kreatif yang terintegrasi dengan database Supabase, sistem katalog interaktif, dynamic SEO, dan panel manajemen admin yang aman.

---

## 🌟 Fitur Utama

### 1. Pengalaman Pengunjung (Public Website)

- **Katalog Produk Interaktif**: Menampilkan koleksi lilin aromaterapi, hampers pernikahan, resin craft, dan merchandise custom dengan filter kategori dan pencarian real-time.
- **Rincian Produk Lengkap & SEO-Optimized (`/produk/[id]`)**: Halaman produk dinamis dengan URL ramah search engine, OpenGraph metadata, JSON-LD Schema (`Product`), galeri foto, pilihan varian aroma/ukuran, dan kalkulasi checkout WhatsApp otomatis.
- **Workshop Studio Lilin Aromaterapi (`/workshop`)**: Presentasi paket kelas, rincian kurikulum modul pembelajaran, 4 langkah alur reservasi, galeri dokumentasi foto, dan informasi promosi/event terbaru.
- **Performa Tinggi & Desain Responsif**: Desain mobile-first dengan micro-animasi modern, tipografi elegan (Cormorant Garamond & Plus Jakarta Sans), dan load cepat.

### 2. Panel Admin Terpadu (`/admin`)

- **Dashboard Manajemen Produk**: Tambah, ubah, atau hapus produk beserta varian harga, stok, foto, dan opsi kustom tanpa reload halaman.
- **Manajemen Workshop Studio**: Kontrol menyeluruh untuk paket kelas, materi kurikulum, alur reservasi, dan berita/promosi event.
- **Galeri Dokumentasi & Banner Hero**: Upload foto kegiatan studio langsung ke cloud storage dengan fitur kompresi otomatis di sisi browser.
- **Pengaturan Kontak & Jam Operasional**: Update informasi WhatsApp admin, nomor telepon, alamat studio, dan integrasi Google Maps secara instan.

---

## 🛡️ Arsitektur Keamanan (Enterprise-Grade Security)

1. **Autentikasi Session HMAC-SHA256**:
   - Cookie sesi admin `admin_session` bertipe `HttpOnly`, `SameSite=Lax`, dan `Secure` (pada production).
   - Ditandatangani menggunakan HMAC-SHA256 dengan secret server (`ADMIN_SESSION_SECRET`).
   - Verifikasi token menggunakan perbandingan _constant-time_ (`crypto.timingSafeEqual`) untuk mencegah _timing attack_.
2. **Serverless Persistent Rate Limiting**:
   - Proteksi brute-force login persisten lintas instance serverless (Vercel) yang tersimpan di Supabase `site_content` (`rl_[ip]`) dengan L1 memory cache.
   - Penguncian akun otomatis selama 15 menit setelah 5 kali kegagalan berturut-turut.
3. **Fail-Fast Zod Schema Validation**:
   - Seluruh payload pada endpoint `/api/store` divalidasi secara ketat menggunakan Zod (`ProductSchema`, `BannerSchema`, `ContactSchema`, `SiteContentSchema`) sebelum operasi database dieksekusi.
4. **Content-Security-Policy (CSP) & Security Headers**:
   - Header keamanan HTTP lengkap: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, dan `Permissions-Policy`.
   - Allowlist gambar `next.config.ts` dibatasi secara ketat hanya untuk domain Supabase Storage proyek dan sumber terpercaya.
5. **Proteksi CSRF**:
   - Validasi kecocokan `Origin` dan `Host` pada setiap mutasi data sensitif di API.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org) & [React 19](https://react.dev)
- **Bahasa**: [TypeScript 5](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Database & Storage**: [Supabase](https://supabase.com) (PostgreSQL & Object Storage)
- **Validasi Data**: [Zod](https://zod.dev)
- **Unit Testing**: [Vitest](https://vitest.dev)
- **Kompresi Gambar**: Canvas/OffscreenCanvas (client-side) & [Sharp](https://sharp.pixelplumbing.com) (asset pipeline)
- **Ikonografi**: [Lucide React](https://lucide.dev) & Iconify

---

## 📁 Struktur Direktori

```plaintext
CraftByHanifa/
├── app/
│   ├── (public)/              # Rute publik (katalog produk dinamis, workshop, dll)
│   │   └── produk/[id]/       # Halaman produk SEO-friendly dengan metadata & JSON-LD
│   ├── admin/                 # Panel admin terproteksi
│   │   ├── banner/            # Manajemen banner carousel beranda
│   │   ├── kontak/            # Pengaturan profil brand & media sosial
│   │   ├── produk/            # Manajemen katalog produk & varian
│   │   └── workshop/          # Manajemen paket, kurikulum, & berita workshop
│   ├── api/                   # Serverless API endpoints
│   │   ├── auth/              # Endpoint login, logout, & verifikasi sesi
│   │   ├── store/             # API data sinkronisasi utama dengan validasi Zod
│   │   └── upload/            # API upload berkas ke Supabase Storage
│   ├── error.tsx              # Global error boundary (branded)
│   ├── loading.tsx            # Global skeleton loader
│   ├── not-found.tsx          # 404 page branded CraftByHanifa
│   ├── robots.ts              # Aturan crawler Googlebot
│   └── sitemap.ts             # XML sitemap otomatis untuk SEO
├── components/
│   ├── admin/                 # Komponen modular admin (produk, workshop, dsb)
│   └── ...                    # Komponen UI publik (Navbar, Footer, Hero, Produk)
├── lib/
│   ├── auth/                  # Utilitas sesi HMAC, CSRF, & verifikasi origin
│   ├── validations/           # Skema validasi Zod (Product, Banner, Contact, Content)
│   ├── imageCompressor.ts     # Utilitas kompresi gambar client-side
│   └── supabaseClient.ts      # Inisialisasi Supabase client & admin
├── tests/                     # Test suite unit testing
│   ├── security.test.ts       # Pengujian HMAC token & proteksi keamanan
│   └── validations.test.ts    # Pengujian skema validasi Zod
└── public/
    └── images/                # Aset visual lokal teroptimasi (< 2.5MB total)
```

---

## ⚙️ Variabel Lingkungan (.env.local)

Buat berkas `.env.local` di root proyek:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_SESSION_SECRET=a-very-strong-secret-key-at-least-32-characters-long
```

---

## 🗄️ Skema Database Supabase

Pastikan tabel dan storage bucket berikut telah dibuat pada database Supabase Anda:

### 1. Tabel PostgreSQL

- **`products`**: ID (`text`), Nama (`text`), Harga (`numeric`), Stok (`integer`), Gambar (`text`), Varian (`jsonb`), Kategori (`text`), dsb.
- **`banners`**: ID (`text`), Judul (`text`), Subjudul (`text`), Foto (`text`), Urutan (`integer`), Status Aktif (`boolean`).
- **`contact_info`**: ID (`text`), Nama (`text`), WhatsApp (`text`), Email (`text`), Alamat (`text`), dsb.
- **`site_content`**: Kunci seksi (`section_key`), Judul (`text`), Konten (`text` / `jsonb`), Waktu update (`timestamptz`). Digunakan untuk data dinamis workshop, galeri, berita, dan persistensi rate limiting.

### 2. Storage Buckets (Public Read Access)

- `products`: Penyimpanan foto katalog produk.
- `banners`: Penyimpanan banner promosi carousel.
- `gallery`: Penyimpanan foto kegiatan studio dan poster event workshop.

---

## 🚀 Skrip Pengembang

| Perintah         | Deskripsi                                                       |
| ---------------- | --------------------------------------------------------------- |
| `npm run dev`    | Menjalankan local development server di `http://localhost:3000` |
| `npm run build`  | Menjalankan kompilasi produksi Next.js untuk deployment         |
| `npm run start`  | Menjalankan server aplikasi Next.js mode produksi               |
| `npm run lint`   | Memeriksa seluruh kode menggunakan ESLint                       |
| `npm test`       | Menjalankan seluruh test suite unit testing menggunakan Vitest  |
| `npm run format` | Melakukan formatting kode menggunakan Prettier                  |

---

## 📄 Lisensi

Hak Cipta © 2026 **CraftByHanifa**. Hak cipta dilindungi undang-undang.
