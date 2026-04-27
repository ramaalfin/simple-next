import React from 'react';

export const metadata = {
  title: 'Kombinasi Zustand & TanStack Query',
  description: 'Materi tentang cara menggabungkan Zustand dan TanStack Query di Next.js',
};

export default function ZustandTanstackPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Materi: Kombinasi Zustand & TanStack Query
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Sering dijuluki sebagai <strong>"The Golden Stack"</strong> di ekosistem React modern. Pelajari cara menggabungkan kedua library ini untuk menghasilkan arsitektur aplikasi yang sangat bersih, cepat, dan terukur.
        </p>
      </div>

      {/* SECTION 1: PEMISAHAN STATE */}
      <section className="mb-12">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl mb-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">1. Konsep Utama: Pemisahan State</h2>
          <p className="text-indigo-800 leading-relaxed mb-4">
            Rahasia utama dari kombinasi ini adalah memahami bahwa tidak semua data itu sama. Di aplikasi web modern, data dibagi menjadi dua kubu:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <h4 className="font-bold text-indigo-700 flex items-center gap-2">
                ☁️ Server State (TanStack Query)
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                Data yang aslinya berada di database (backend). Butuh proses <em>fetching</em>, <em>caching</em>, dan bisa usang (stale).
                <br /><strong className="text-gray-800">Contoh:</strong> Daftar produk, detail user, riwayat transaksi.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <h4 className="font-bold text-indigo-700 flex items-center gap-2">
                💻 Client State (Zustand)
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                Data yang murni ada di dalam browser pengguna. Sinkron, instan, dan hilang jika browser ditutup.
                <br /><strong className="text-gray-800">Contoh:</strong> Keranjang belanja, filter lokal, mode Gelap/Terang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CONTOH ARSITEKTUR */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Contoh Kasus: Aplikasi E-Commerce</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Mari kita buat skenario di mana kita mengambil daftar produk dari <code>dummyjson.com</code> (Server State) dan membiarkan pengguna menambahkannya ke Keranjang Belanja (Client State).
        </p>

        <div className="space-y-6">
          {/* LANGKAH A */}
          <div className="relative">
            <div className="absolute -left-4 top-4 w-1 h-full bg-blue-200 rounded-full"></div>
            <h3 className="text-lg font-bold text-blue-800 mb-2">Langkah A: Buat Client State (Zustand)</h3>
            <p className="text-sm text-gray-600 mb-3">Zustand HANYA menyimpan barang yang dimasukkan ke keranjang, tidak menyimpan semua daftar produk.</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono shadow-md">
{`import { create } from 'zustand';

interface CartStore {
  items: any[];
  addToCart: (product: any) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addToCart: (product) => set((state) => ({ items: [...state.items, product] })),
}));`}
            </pre>
          </div>

          {/* LANGKAH B */}
          <div className="relative">
            <div className="absolute -left-4 top-4 w-1 h-full bg-orange-200 rounded-full"></div>
            <h3 className="text-lg font-bold text-orange-800 mb-2">Langkah B: Tangani Server State (TanStack Query)</h3>
            <p className="text-sm text-gray-600 mb-3">TanStack Query bertugas berkomunikasi dengan backend, menangani loading, caching, dan error.</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono shadow-md">
{`import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get('https://dummyjson.com/products');
      return res.data.products;
    },
  });
};`}
            </pre>
          </div>

          {/* LANGKAH C */}
          <div className="relative">
            <div className="absolute -left-4 top-4 w-1 h-full bg-green-200 rounded-full"></div>
            <h3 className="text-lg font-bold text-green-800 mb-2">Langkah C: Gabungkan di Antarmuka (UI)</h3>
            <p className="text-sm text-gray-600 mb-3">Di komponen React, kita cukup memanggil kedua <em>hooks</em> tersebut. Kode UI menjadi sangat deklaratif dan rapi.</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono shadow-md">
{`'use client';

import { useProducts } from '@/api/productsApi';
import { useCartStore } from '@/store/cartStore';

export default function ShoppingPage() {
  // 1. Ambil data dari server (TanStack Query)
  const { data: products, isLoading } = useProducts();
  
  // 2. Ambil fungsi interaksi klien (Zustand)
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);

  if (isLoading) return <p>Memuat produk dari server...</p>;

  return (
    <div>
      <header>
        <h2>Keranjang Anda: {cartItems.length} barang</h2>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {products?.map((product) => (
          <div key={product.id} className="card p-4 border rounded">
            <h3>{product.title}</h3>
            <button 
              onClick={() => addToCart(product)}
              className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
            >
              Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* SECTION 3: KESIMPULAN */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mengapa Pendekatan Ini Sangat Kuat?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 border border-gray-200 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-2">🛡️ Tidak Ada Data Ganda</h4>
            <p className="text-sm text-gray-600">Zustand tidak perlu menyimpan salinan dari daftar produk API. Ia murni hanya mengurus logika keranjang.</p>
          </div>
          <div className="p-5 border border-gray-200 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-2">🚀 Optimasi Spesifik</h4>
            <p className="text-sm text-gray-600">TanStack Query mengurus cache network agar tidak fetch berulang, sementara Zustand mengurus komponen agar tidak render berlebih.</p>
          </div>
          <div className="p-5 border border-gray-200 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-2">🧹 Clean Architecture</h4>
            <p className="text-sm text-gray-600">Kode jaringan terisolasi di file API, dan logika status lokal terisolasi di file Store. Sangat mudah di-maintain.</p>
          </div>
        </div>
      </section>

    </main>
  );
}
