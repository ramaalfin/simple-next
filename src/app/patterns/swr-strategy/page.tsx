import React from 'react';

export const metadata = {
  title: 'Materi: SWR Strategy',
  description: 'Materi tentang Stale-While-Revalidate di Next.js',
};

export default function SWRPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Stale-While-Revalidate (SWR)
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed italic">
          Strategi dasar di balik kecepatan dan keandalan caching di Next.js.
        </p>
      </div>

      <section className="mb-12">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Apa itu SWR?</h2>
          <p className="text-blue-800 leading-relaxed">
            SWR adalah strategi caching yang menyajikan data dari cache (Stale), kemudian melakukan pengambilan data baru di latar belakang (Revalidate) untuk memperbarui cache tersebut.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-5 border border-gray-200 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2">⚡ Keuntungan: Zero Latency</h4>
            <p className="text-sm text-gray-600">Pengguna mendapatkan konten secara instan karena data diambil dari cache lokal, bukan menunggu request jaringan.</p>
          </div>
          <div className="p-5 border border-gray-200 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2">🔄 Background Updates</h4>
            <p className="text-sm text-gray-600">Data tetap diperbarui tanpa pernah memblokir proses rendering atau membuat UI "hang".</p>
          </div>
        </div>
      </section>

      <div className="bg-gray-900 text-gray-100 p-8 rounded-2xl shadow-xl mt-8">
        <h3 className="text-xl font-bold mb-4 text-blue-400">Dimana SWR digunakan di Next.js?</h3>
        <ul className="list-disc list-inside space-y-3 opacity-90 text-sm">
          <li><strong>ISR (Incremental Static Regeneration):</strong> Mekanisme utama pembaruan halaman statis.</li>
          <li><strong>Data Cache:</strong> Manajemen fetch asinkron di Next.js 15.</li>
          <li><strong>SWR Library:</strong> Library besutan Vercel untuk fetching data di sisi klien.</li>
        </ul>
      </div>
    </main>
  );
}
