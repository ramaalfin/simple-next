# Caching di Next.js (App Router)

Berdasarkan dokumentasi resmi Next.js (https://nextjs.org/docs/app/getting-started/caching), Next.js memiliki mekanisme caching yang komprehensif untuk meningkatkan performa aplikasi dan mengurangi biaya server. Terdapat 4 lapisan (layer) caching utama dalam arsitektur App Router:

## 1. Request Memoization
- **Apa itu?** Menyimpan hasil fetch data dalam satu siklus render React.
- **Tujuan:** Mencegah pemanggilan fetch berulang kali untuk data yang sama di dalam komponen React Tree yang berbeda pada render yang sama.
- **Kapan terjadi:** Saat kita menggunakan fungsi `fetch` dengan URL dan opsi yang identik.
- **Durasi:** Berlangsung hanya selama proses render React berlangsung (per request).
- **Cara kerjanya:** Jika komponen A, B, dan C membutuhkan data user yang sama, kita bisa melakukan `fetch` di ketiga komponen tersebut tanpa khawatir akan ada 3 request jaringan. Next.js secara otomatis menyimpan request pertama di memori dan menggunakannya kembali untuk request selanjutnya dalam siklus render yang sama.

## 2. Data Cache
- **Apa itu?** Menyimpan hasil fetch data secara persisten di server.
- **Tujuan:** Menyimpan data lintas request pengguna dan deployment.
- **Kapan terjadi:** Saat kita menggunakan `fetch` di Server Components. Secara default, Next.js akan melakukan cache untuk semua request `fetch`.
- **Durasi:** Bertahan secara permanen (hingga di-revalidate secara manual atau otomatis).
- **Cara mengatur:**
  - `force-cache` (Default): Data di-cache permanen.
  - `no-store`: Melewati cache dan mengambil data baru pada setiap request (Dinamis).
  - `next: { revalidate: [seconds] }`: Mengambil data baru setiap rentang waktu tertentu (Incremental Static Regeneration / ISR).
  - `next: { tags: ['tag-name'] }`: Memberi tag pada cache untuk di-revalidate nanti secara spesifik (On-demand Revalidation).

## 3. Full Route Cache
- **Apa itu?** Menyimpan struktur HTML dan payload React Server Components (RSC) hasil render suatu halaman.
- **Tujuan:** Mengurangi beban rendering dan mengambil data secara instan saat navigasi.
- **Kapan terjadi:** Saat aplikasi di-build secara otomatis halaman dikategorikan menjadi *Static* atau *Dynamic*. Jika *Static*, rute di-cache.
- **Durasi:** Bertahan hingga data di-revalidate (via Data Cache) atau aplikasi di-deploy ulang.
- **Cara kerjanya:** Server tidak perlu me-render ulang halaman untuk setiap pengguna. Server langsung memberikan HTML dan payload RSC yang sudah disimpan.

## 4. Router Cache (Client-side)
- **Apa itu?** Menyimpan payload RSC yang memecah halaman untuk navigasi sisi klien (di browser).
- **Tujuan:** Mempercepat navigasi klien (tanpa muat ulang seluruh halaman), menyimpan status state React, dan menyediakan transisi yang mulus (seperti navigasi maju/mundur).
- **Kapan terjadi:** Saat pengguna berinteraksi di aplikasi dan menavigasi ke rute baru menggunakan komponen `<Link>` atau `useRouter`.
- **Durasi:** Berlangsung selama sesi browser pengguna. Akan hilang jika browser di-refresh secara paksa (hard refresh). Cache untuk halaman dinamis adalah 30 detik secara default, dan halaman statis adalah 5 menit.

---

## Ringkasan Implementasi dalam Kode

```typescript
// 1. Force Cache (Default) - Data Cache & Full Route Cache
// Mengambil data sekali dan menyimpannya selamanya sampai build ulang / revalidate
fetch('https://dummyjson.com/products', { cache: 'force-cache' });

// 2. Revalidate (ISR) - Memperbarui cache per interval waktu
// Mengambil data baru maksimal setiap 60 detik
fetch('https://dummyjson.com/products', { next: { revalidate: 60 } });

// 3. No Store (Dynamic) - Selalu ambil data baru
// Tidak menggunakan Data Cache (selalu fetch) dan membuat rute menjadi dinamis
fetch('https://dummyjson.com/products', { cache: 'no-store' });
```
