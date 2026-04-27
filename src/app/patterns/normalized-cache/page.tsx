import React from 'react';

export const metadata = {
  title: 'Materi: Normalized Cache',
  description: 'Materi tentang Normalized Cache di Next.js',
};

export default function NormalizedCachePage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Normalized Cache
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed italic">
          Menjaga konsistensi data global di aplikasi skala besar.
        </p>
      </div>

      <section className="mb-12">
        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl mb-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-2">Masalah: Redundansi Data</h2>
          <p className="text-purple-800 leading-relaxed">
            Tanpa normalisasi, satu data yang sama (misal: Produk A) bisa tersimpan di banyak tempat cache yang berbeda. Jika salah satu diupdate, yang lain tidak akan ikut berubah.
          </p>
        </div>

        <div className="p-6 border border-purple-200 rounded-2xl bg-white shadow-sm">
          <h4 className="font-bold text-purple-900 mb-3">Solusi Normalisasi:</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Setiap entitas unik (seperti User atau Produk) hanya disimpan satu kali berdasarkan <strong>ID</strong> uniknya. Semua bagian aplikasi hanya "merujuk" ke ID tersebut.
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-xs font-mono text-gray-500">
            {`{ "Product:101": { "name": "Sepatu", "price": 500 } }`}
          </div>
        </div>
      </section>

      <p className="text-gray-500 text-sm mt-8">
        *Biasanya diimplementasikan menggunakan library seperti Apollo Client atau Redux Entity Adapter.
      </p>
    </main>
  );
}
