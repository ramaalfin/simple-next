import React from 'react';

export const metadata = {
  title: 'Stale-While-Revalidate (SWR) Strategy',
  description: 'Materi mendalam tentang strategi caching SWR di Next.js',
};

export default function SWRStrategyPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Strategi: Stale-While-Revalidate (SWR)
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Strategi yang mengutamakan kecepatan dengan menyajikan data lama sambil memperbarui data di latar belakang.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Apa itu SWR?</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          SWR adalah strategi cache yang populer di mana browser pertama-tama menyajikan data lama yang sudah ada di cache (**Stale**), kemudian mengirimkan permintaan pengambilan data di latar belakang (**Revalidate**), dan terakhir menyajikan data terbaru tersebut.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
          <h4 className="font-bold text-blue-900 mb-2">Filosofi Utama:</h4>
          <p className="text-blue-800 text-sm">
            "Lebih baik menampilkan data lama daripada menampilkan layar loading kosong."
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Implementasi di Next.js (ISR)</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Next.js mengimplementasikan SWR pada tingkat halaman melalui <strong>Incremental Static Regeneration (ISR)</strong>.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`// src/app/products/page.tsx
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 } // Revalidate data maksimal setiap 60 detik
  });
  return res.json();
}

export default async function Page() {
  const products = await getProducts();
  // ... render products
}`}
        </pre>
        <p className="text-sm text-gray-500 italic">
          Keterangan: Jika user mengunjungi halaman ini setelah 60 detik, mereka tetap melihat data lama. Namun, Next.js akan memicu pengambilan data baru di background untuk user berikutnya.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Penggunaan Library SWR (Client Side)</h2>
        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`'use client'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)

  if (error) return <div>Gagal memuat</div>
  if (isLoading) return <div>Memuat...</div>
  
  return <div>Halo, {data.name}!</div>
}`}
        </pre>
      </section>
    </main>
  );
}
