import React from 'react';

export const metadata = {
  title: 'Materi: Optimistic Updates',
  description: 'Materi tentang Optimistic Updates di Next.js',
};

export default function OptimisticUpdatesPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Optimistic Updates
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed italic">
          Teknik UI untuk menghilangkan kesan "menunggu" pada pengguna.
        </p>
      </div>

      <section className="mb-12">
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl mb-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">Bagaimana Cara Kerjanya?</h2>
          <p className="text-emerald-800 leading-relaxed">
            Kita memperbarui UI secara instan seolah-olah operasi server sudah sukses. Jika ternyata gagal, kita mengembalikan (rollback) UI ke status semula.
          </p>
        </div>

        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`// Contoh Alur useOptimistic di Next.js
const [optimisticState, addOptimistic] = useOptimistic(
  state,
  (currentState, newValue) => {
    // Logika update UI seketika
    return [...currentState, newValue];
  }
);`}
        </pre>
      </section>

      <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50">
        <h4 className="font-bold text-gray-900 mb-2">Contoh Nyata:</h4>
        <p className="text-sm text-gray-600">
          Saat Anda menekan tombol "Like" di Instagram, angka bertambah seketika. Instagram tidak menunggu server menjawab "Ya, Like berhasil" untuk mengubah angka tersebut. Itulah Optimistic Update.
        </p>
      </div>
    </main>
  );
}
