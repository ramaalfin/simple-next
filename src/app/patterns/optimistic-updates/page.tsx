import React from 'react';

export const metadata = {
  title: 'Optimistic Updates di Next.js',
  description: 'Materi mendalam tentang teknik Optimistic Updates untuk UX yang instan',
};

export default function OptimisticUpdatesPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Teknik: Optimistic Updates
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Meningkatkan kepuasan pengguna dengan memberikan respon UI yang instan sebelum data benar-benar tersimpan di server.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Konsep Optimis</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Dalam aplikasi web biasa, saat Anda menekan tombol "Like", aplikasi akan mengirim request ke server dan menunggu jawaban sebelum mengubah tampilan tombol tersebut. Ini menyebabkan jeda (delay).
          <br /><br />
          <strong>Optimistic Updates</strong> bekerja dengan cara:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-8">
          <li>Pengguna melakukan aksi (misal: Like).</li>
          <li>Aplikasi <strong>segera</strong> mengubah UI (Like bertambah) seolah-olah sukses.</li>
          <li>Aplikasi mengirim request ke server di latar belakang.</li>
          <li>Jika server gagal, aplikasi akan membatalkan perubahan UI tersebut (**Rollback**).</li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Implementasi dengan Hook `useOptimistic`</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Next.js menyediakan hook khusus bernama <code>useOptimistic</code> untuk memudahkan pola ini.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`'use client'
import { useOptimistic } from 'react'

export function LikeButton({ initialLikes }) {
  // 1. Definisikan state optimis
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state, newLike) => state + 1
  )

  async function handleLikeAction() {
    // 2. Update UI secara instan
    addOptimisticLike(1)
    
    // 3. Panggil Server Action
    await submitLikeToDatabase()
  }

  return (
    <button onClick={handleLikeAction}>
      Like: {optimisticLikes}
    </button>
  )
}`}
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-orange-700">Penting: Penanganan Rollback</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Satu hal yang tidak boleh dilupakan adalah <strong>Rollback</strong>. Jika permintaan API gagal (misal: koneksi terputus), state optimis akan otomatis kembali ke state asli yang ada di server saat komponen di-render ulang dengan data asli.
        </p>
      </section>
    </main>
  );
}
