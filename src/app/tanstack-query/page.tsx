import React from 'react';

export const metadata = {
  title: 'TanStack Query Dasar & Advanced',
  description: 'Materi tentang TanStack Query (React Query) untuk manajemen server state di Next.js',
};

export default function TanStackQueryPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Materi: TanStack Query (React Query)
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Pelajari cara mengelola <strong>Server State</strong> secara efisien, mulai dari caching otomatis hingga sinkronisasi data yang mulus antara backend dan antarmuka pengguna.
        </p>
      </div>

      {/* SECTION 1: INTRODUCTION */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Apa itu TanStack Query?</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          <strong>TanStack Query</strong> adalah library yang sangat powerful untuk mengelola pengambilan data (*data fetching*), caching, sinkronisasi, dan pembaruan server state di aplikasi web. Ia menghilangkan kebutuhan untuk mengelola status loading, error, dan data secara manual di Redux atau useState.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
          <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
            <h4 className="font-bold text-orange-800 mb-1">Query Keys</h4>
            <p className="text-orange-700 text-sm">Array unik (misal: <code>['products']</code>) sebagai ID untuk menyimpan data dalam cache.</p>
          </div>
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <h4 className="font-bold text-blue-800 mb-1">Stale While Revalidate</h4>
            <p className="text-blue-700 text-sm">Fitur di mana pengguna melihat data lama sementara library mengambil data baru di latar belakang.</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: READ OPERATIONS */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Implementasi CRUD: Membaca Data (Read)</h2>
        <p className="text-gray-700 mb-4 italic text-sm">Endpoint: https://dummyjson.com/products</p>
        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Pola Custom Hook untuk fetching produk
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get('https://dummyjson.com/products');
      return data.products;
    },
    staleTime: 5 * 60 * 1000, // Data dianggap segar selama 5 menit
  });
};`}
        </pre>
      </section>

      {/* SECTION 3: MUTATIONS (CUD) */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Mutasi Data: Create, Update, & Delete</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Untuk operasi yang mengubah data di server, kita menggunakan <code>useMutation</code>. Salah satu fitur terpentingnya adalah <strong>Query Invalidation</strong>, yang secara otomatis menyegarkan data statis setelah perubahan dilakukan.
        </p>

        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-8">
{`import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useProductMutations() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(\`https://dummyjson.com/products/\${id}\`),
    onSuccess: () => {
      // Memberitahu TanStack Query bahwa data 'products' sudah basi
      // Ini memicu refetch otomatis untuk semua komponen yang menampilkan produk
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return { deleteMutation };
}`}
          </pre>
      </section>

      {/* SECTION 4: COMPARISON TABLE */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Kapan Menggunakan TanStack Query?</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-800">
                <th className="p-4 border-b border-gray-200 font-semibold">Fitur</th>
                <th className="p-4 border-b border-gray-200 font-semibold">TanStack Query</th>
                <th className="p-4 border-b border-gray-200 font-semibold">Standard Redux (Thunk)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Caching</td>
                <td className="p-4 text-green-600 font-semibold">Otomatis & Canggih</td>
                <td className="p-4 text-gray-600 italic">Harus dikelola manual</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Auto-Refetch</td>
                <td className="p-4 text-green-600 font-semibold">Ya (saat window fokus/koneksi kembali)</td>
                <td className="p-4 text-gray-600 italic">Tidak ada</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Status UI</td>
                <td className="p-4 text-green-600 font-semibold">Terintegrasi (isLoading, isFetching, isError)</td>
                <td className="p-4 text-gray-600 italic">Harus buat variabel state manual</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Ukuran Boilerplate</td>
                <td className="p-4 text-blue-600 font-semibold">Sangat Minimal</td>
                <td className="p-4 text-gray-600 italic">Cukup Banyak</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SUMMARY */}
      <div className="bg-blue-900 text-blue-50 p-8 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold mb-4">Kesimpulan</h3>
        <p className="leading-relaxed opacity-90">
          TanStack Query adalah standar industri modern untuk menangani <strong>Server State</strong>. Jika aplikasi Anda lebih banyak melakukan interaksi dengan data dari API (seperti E-commerce atau Dashboard), library ini akan memotong jumlah baris kode Anda secara signifikan dibandingkan menggunakan Redux murni.
        </p>
      </div>
    </main>
  );
}
