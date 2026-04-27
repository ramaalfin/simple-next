import React from 'react';

export const metadata = {
  title: 'Normalized Cache & Data Consistency',
  description: 'Materi mendalam tentang menjaga konsistensi data dengan Normalized Cache',
};

export default function NormalizedCachePage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Konsep: Normalized Cache
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Menjaga agar satu data yang muncul di banyak tempat selalu sinkron dan konsisten di seluruh aplikasi.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-red-600">Masalah: Data yang Tersebar (Fragmentasi)</h2>
        <p className="text-gray-700 mb-6 leading-relaxed border-l-4 border-red-200 pl-4">
          Bayangkan Anda mengubah nama profil Anda di halaman "Pengaturan". Namun, saat Anda kembali ke halaman "Beranda", nama profil lama masih muncul karena cache di halaman Beranda belum diperbarui. Inilah masalah <strong>Inkonsistensi Data</strong>.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Apa itu Normalisasi?</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Dalam Normalized Cache, data tidak disimpan berdasarkan URL request, melainkan disimpan sebagai kumpulan objek unik berdasarkan **ID**.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold text-sm mb-2">Cache Biasa (URL-based):</h4>
            <pre className="text-xs">
{`{
  "/api/users/1": { id: 1, name: "Budi" },
  "/api/posts/10": { id: 10, author: { id: 1, name: "Budi" } }
}`}
            </pre>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-bold text-sm mb-2 text-green-800">Normalized Cache (ID-based):</h4>
            <pre className="text-xs text-green-900">
{`{
  "User:1": { id: 1, name: "Budi" },
  "Post:10": { id: 10, authorRef: "User:1" }
}`}
            </pre>
          </div>
        </div>
        <p className="text-gray-700">
          Dengan normalisasi, jika kita mengubah <code>User:1</code>, semua komponen yang menampilkan user tersebut (di Beranda maupun di Post) akan terupdate seketika karena mereka mereferensikan objek yang sama.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Implementasi dengan Redux Toolkit</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Kita menggunakan <code>createEntityAdapter</code> untuk melakukan normalisasi otomatis.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

const usersAdapter = createEntityAdapter()

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    // Satu fungsi ini akan mengupdate satu user di manapun ia muncul!
    userUpdated: usersAdapter.updateOne,
  }
})`}
        </pre>
      </section>
    </main>
  );
}
