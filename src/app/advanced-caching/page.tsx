import React from 'react';

export const metadata = {
  title: 'Advanced Caching & Sync Patterns',
  description: 'Materi tentang Normalized Cache, Optimistic Updates, WebSocket Sync, dan SWR di Next.js',
};

export default function AdvancedCachingPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Advanced Caching & Sync di Next.js
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Memahami strategi pengelolaan data tingkat lanjut untuk membangun aplikasi yang cepat, konsisten, dan reaktif secara real-time.
        </p>
      </div>

      {/* SECTION 1: SWR */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm">CORE</span>
          1. Stale-While-Revalidate (SWR)
        </h2>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
          <p className="text-blue-800 leading-relaxed">
            Ini bukan sekadar library, tapi adalah <strong>strategi dasar Next.js</strong>. Konsepnya: Sajikan data lama dari cache (Stale) secepat kilat, lalu perbarui di latar belakang (Revalidate).
          </p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <li className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h4 className="font-bold mb-1">ISR (Incremental Static Regeneration)</h4>
            <p className="text-sm text-gray-600">Menggunakan SWR untuk memperbarui halaman statis secara berkala tanpa build ulang.</p>
          </li>
          <li className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h4 className="font-bold mb-1">Next.js Data Cache</h4>
            <p className="text-sm text-gray-600">Fungsi <code>fetch</code> di Next.js 15 secara internal mengelola cache berbasis SWR.</p>
          </li>
        </ul>
      </section>

      {/* SECTION 2: OPTIMISTIC UPDATES */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm">UX</span>
          2. Optimistic Updates
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Tujuannya adalah menghilangkan persepsi "menunggu". Aplikasi memperbarui UI seolah-olah request sudah sukses.
        </p>
        <div className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`// Contoh Alur Optimistic Update di Server Action
'use client'

const [optimisticLikes, addOptimisticLike] = useOptimistic(
  likes,
  (state, newLike) => state + 1
);

async function handleLike() {
  addOptimisticLike(1); // UI berubah instan!
  await submitLikeToDB(); // Proses backend menyusul
}`}
        </div>
      </section>

      {/* SECTION 3: NORMALIZED CACHE */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm">DATA INTEGRITY</span>
          3. Normalized Cache
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Masalah di aplikasi besar: Jika Anda mengubah harga produk di halaman "Detail", harga produk yang sama di halaman "Promo" tidak berubah karena cache-nya terpisah (URL-based).
        </p>
        <div className="p-6 bg-white border border-purple-200 rounded-xl">
          <h4 className="font-bold text-purple-900 mb-2">Solusi Normalisasi:</h4>
          <p className="text-sm text-gray-600">
            Data disimpan berdasarkan <strong>Entity ID</strong> (misal: <code>Product:123</code>). Jika entity tersebut diupdate, semua komponen yang berlangganan pada ID tersebut akan terupdate otomatis di seluruh aplikasi. 
            <br /><br />
            Next.js biasanya menggunakan <strong>Apollo Client</strong> atau <strong>RTK Query Entity Adapter</strong> untuk menangani ini.
          </p>
        </div>
      </section>

      {/* SECTION 4: WEBSOCKET SYNC */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm">REAL-TIME</span>
          4. WebSocket Cache Sync
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Menjaga cache Next.js tetap "segar" dengan mendengarkan event dari server (Push Notification).
        </p>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 p-5 border border-gray-200 rounded-xl bg-gray-50">
            <h4 className="font-bold mb-2">Tanpa Sync:</h4>
            <p className="text-xs text-gray-500 italic">User harus refresh halaman atau menunggu durasi revalidasi (misal 60 detik) untuk melihat data baru.</p>
          </div>
          <div className="flex-1 p-5 border border-orange-200 rounded-xl bg-orange-50">
            <h4 className="font-bold text-orange-800 mb-2">Dengan WebSocket Sync:</h4>
            <p className="text-xs text-orange-700">Backend mengirim signal ⮕ Client memanggil <code>revalidatePath()</code> ⮕ Cache di-purge secara global ⮕ Semua user melihat data baru secara instan.</p>
          </div>
        </div>
      </section>

      {/* TABLE SUMMARY */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ringkasan Materi Advanced</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 border-b">Konsep</th>
                <th className="p-4 border-b">Relevansi di Next.js</th>
                <th className="p-4 border-b">Guna Utama</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b font-medium text-gray-900">SWR</td>
                <td className="p-4 border-b text-green-600 font-bold italic">Sangat Tinggi (Bawaan)</td>
                <td className="p-4 border-b text-gray-600 text-sm">Kecepatan akses data statis.</td>
              </tr>
              <tr>
                <td className="p-4 border-b font-medium text-gray-900">Optimistic Update</td>
                <td className="p-4 border-b text-blue-600 font-bold italic">Tinggi (Server Actions)</td>
                <td className="p-4 border-b text-gray-600 text-sm">Respon UI yang instan.</td>
              </tr>
              <tr>
                <td className="p-4 border-b font-medium text-gray-900">Normalized Cache</td>
                <td className="p-4 border-b text-purple-600 font-bold italic">Sedang (Library Eksternal)</td>
                <td className="p-4 border-b text-gray-600 text-sm">Konsistensi data lintas halaman.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-900">WebSocket Sync</td>
                <td className="p-4 text-orange-600 font-bold italic">Lanjutan (Integrasi)</td>
                <td className="p-4 text-gray-600 text-sm">Kesegaran data real-time.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
