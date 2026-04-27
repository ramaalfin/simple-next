import React from 'react';

export const metadata = {
  title: 'Materi Zustand: State Management Ringan',
  description: 'Materi tentang Zustand untuk manajemen state global di Next.js',
};

export default function ZustandPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Materi: Zustand
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Pelajari <strong>Zustand</strong>, solusi <em>state-management</em> yang sangat ringan, cepat, dan menjadi primadona baru di ekosistem React sebagai alternatif tanpa-pusing dari Redux.
        </p>
      </div>

      {/* SECTION 1: INTRODUCTION */}
      <section className="mb-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl mb-8">
          <h2 className="text-2xl font-bold text-yellow-900 mb-2">1. Apa itu Zustand?</h2>
          <p className="text-yellow-800 leading-relaxed">
            Kata "Zustand" berarti "status" dalam bahasa Jerman. Ia adalah pustaka berbasis <em>hooks</em> yang menghilangkan hampir semua <em>boilerplate</em> yang biasa Anda temui di Redux. Tidak ada lagi istilah Action, Reducer, Dispatcher, atau bahkan Context Provider!
          </p>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-4">Mengapa Zustand Sangat Populer?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <span className="text-2xl mb-2 block">🐻</span>
            <h4 className="font-bold text-gray-900">Tanpa Provider</h4>
            <p className="text-sm text-gray-600 mt-2">State hidup di luar siklus React. Anda tidak perlu membungkus aplikasi dengan <code>&lt;Provider&gt;</code>.</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <span className="text-2xl mb-2 block">⚡</span>
            <h4 className="font-bold text-gray-900">Sangat Ringkas</h4>
            <p className="text-sm text-gray-600 mt-2">Anda hanya perlu mendefinisikan state dan aksi yang mengubahnya di satu tempat yang sama.</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <span className="text-2xl mb-2 block">🚀</span>
            <h4 className="font-bold text-gray-900">Performa Tinggi</h4>
            <p className="text-sm text-gray-600 mt-2">Zustand secara otomatis mengoptimalkan komponen agar tidak re-render jika data yang tidak digunakannya berubah.</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: BASIC STORE */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Membuat Store Dasar</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Membuat store di Zustand hanya membutuhkan pemanggilan fungsi <code>create</code>. Fungsi `set` digunakan untuk memperbarui state.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`import { create } from 'zustand';

// 1. Definisikan tipe untuk TypeScript (Opsional tapi disarankan)
interface CounterState {
  count: number;
  increase: () => void;
  reset: () => void;
}

// 2. Buat Store-nya
export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  
  // Fungsi untuk update state
  increase: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));`}
        </pre>
      </section>

      {/* SECTION 3: ASYNC FETCHING */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Fetching (Operasi Asinkron)</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Berbeda dengan Redux yang membutuhkan <code>createAsyncThunk</code>, di Zustand Anda bisa menggunakan fungsi <code>async/await</code> biasa di dalam store Anda.
        </p>

        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-8">
{`import { create } from 'zustand';
import axios from 'axios';

interface ProductStore {
  products: any[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,

  // Aksi Asinkron
  fetchProducts: async () => {
    set({ isLoading: true }); // Mulai loading
    try {
      const res = await axios.get('https://dummyjson.com/products');
      set({ products: res.data.products, isLoading: false }); // Sukses
    } catch (err) {
      set({ isLoading: false }); // Gagal
    }
  },
}));`}
          </pre>
      </section>

      {/* SECTION 4: USAGE IN COMPONENT */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Menggunakan Store di Komponen</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Gunakan hook yang telah dibuat dan pilih hanya state yang dibutuhkan agar komponen tidak re-render berlebihan.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`'use client';
import { useProductStore } from '@/store/productStore';
import { useEffect } from 'react';

export default function ProductList() {
  // Disarankan: Mengekstrak hanya state yang diperlukan
  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) return <p>Sedang memuat data...</p>;

  return <div>{products.length} produk ditemukan.</div>;
}`}
        </pre>
      </section>

      {/* SECTION 5: COMPARISON TABLE */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Kapan Menggunakan Zustand vs Redux?</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-800">
                <th className="p-4 border-b border-gray-200 font-semibold">Fitur</th>
                <th className="p-4 border-b border-gray-200 font-semibold">Zustand</th>
                <th className="p-4 border-b border-gray-200 font-semibold">Redux Toolkit</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Kurva Belajar</td>
                <td className="p-4 text-green-600 font-semibold">Sangat Mudah</td>
                <td className="p-4 text-red-600 italic">Lebih Curam</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Setup Awal (Boilerplate)</td>
                <td className="p-4 text-green-600 font-semibold">Bisa dalam 1 file kecil</td>
                <td className="p-4 text-gray-600 italic">Butuh Store, Slices, Provider</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Data Fetching API</td>
                <td className="p-4 text-gray-600 italic">Fungsi async biasa</td>
                <td className="p-4 text-green-600 font-semibold">RTK Query (Sangat Canggih)</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Cocok Untuk...</td>
                <td className="p-4 text-blue-600 font-semibold">Mayoritas aplikasi (Kecil - Menengah)</td>
                <td className="p-4 text-purple-600 font-semibold">Aplikasi Enterprise / Skala Besar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SUMMARY */}
      <div className="bg-indigo-900 text-indigo-50 p-8 rounded-2xl shadow-xl mt-8">
        <h3 className="text-xl font-bold mb-4">Tips Kombinasi Modern (The Golden Stack)</h3>
        <p className="leading-relaxed opacity-90">
          Di ekosistem React modern saat ini, banyak *engineer* sepakat pada kombinasi terbaik ini: Gunakan <strong>TanStack Query</strong> untuk mengurus semua data yang berasal dari server/API (karena fitur caching-nya yang canggih), lalu gunakan <strong>Zustand</strong> hanya untuk mengurus state global di browser pengguna (seperti <em>Dark Mode</em>, status Keranjang Belanja, atau Data Form antar langkah).
        </p>
      </div>
    </main>
  );
}
