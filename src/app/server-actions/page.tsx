import React from 'react';

export const metadata = {
  title: 'Materi Server Actions: RHF & Zod',
  description: 'Materi tentang Next.js Server Actions dikombinasikan dengan React Hook Form dan Zod',
};

export default function ServerActionsPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Materi: Server Actions di Next.js
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Pelajari paradigma baru mutasi data di React. Jalankan kode backend secara langsung dari komponen UI tanpa perlu membuat endpoint API manual.
        </p>
      </div>

      {/* SECTION 1: INTRODUCTION */}
      <section className="mb-12">
        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl mb-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-2">1. Era Baru Mutasi Data</h2>
          <p className="text-purple-800 leading-relaxed">
            Secara historis, jika Anda ingin mengirim data form ke server, Anda harus membuat sebuah rute API (misal: <code>/api/submit</code>), lalu menggunakan <code>fetch()</code> atau <code>axios</code> di komponen klien untuk mengirim data JSON ke URL tersebut.
            <br /><br />
            Dengan <strong>Server Actions</strong> (menggunakan <em>directive</em> <code>'use server'</code>), Anda cukup memanggil fungsi backend seolah-olah itu adalah fungsi JavaScript biasa!
          </p>
        </div>
      </section>

      {/* SECTION 2: THE MODERN STACK */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. The Modern Form Stack: RHF + Zod + Server Actions</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Meskipun Server Actions hebat secara mandiri (menggunakan API <code>FormData</code> bawaan browser), namun di dunia nyata kita membutuhkan validasi input yang presisi dan UI yang reaktif. Kombinasi industri terbaik saat ini adalah:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
            <h4 className="font-bold text-blue-600 text-lg mb-2">1. React Hook Form</h4>
            <p className="text-sm text-gray-600">Manajemen form di sisi klien berkinerja tinggi tanpa menyebabkan re-render yang tidak perlu.</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
            <h4 className="font-bold text-emerald-600 text-lg mb-2">2. Zod</h4>
            <p className="text-sm text-gray-600">Mendefinisikan skema validasi tipe data secara kuat (Type-safe) yang bisa dipakai di klien & server.</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
            <h4 className="font-bold text-purple-600 text-lg mb-2">3. Server Action</h4>
            <p className="text-sm text-gray-600">Fungsi backend murni yang berjalan aman di server untuk menyimpan data ke database (DB).</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: CODE EXAMPLE */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">3. Contoh Implementasi Lengkap</h2>
        
        <div className="space-y-8">
          {/* BAGIAN A: SERVER */}
          <div className="relative">
            <div className="absolute -left-4 top-4 w-1 h-full bg-purple-300 rounded-full"></div>
            <h3 className="text-lg font-bold text-purple-800 mb-2">Bagian A: Server (actions.ts)</h3>
            <p className="text-sm text-gray-600 mb-3">Definisikan Skema Zod dan buat fungsi backend. Tipe yang dihasilkan Zod akan digunakan di Client.</p>
            <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-md">
{`'use server';

import { z } from 'zod';

// 1. Skema Validasi Universal
export const productSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  price: z.number().min(1, "Harga wajib diisi"),
});

export type ProductInput = z.infer<typeof productSchema>;

// 2. Fungsi Backend Murni (Tidak terekspos di browser)
export async function submitProduct(data: ProductInput) {
  // Validasi lapis 2 di sisi server (Sangat Penting!)
  const parsed = productSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, error: 'Validasi server gagal!' };
  }

  try {
    // Lakukan operasi Database, misal: await db.product.create(...)
    console.log("Data aman, menyimpan ke DB:", parsed.data);
    
    // (Opsional) Beri tahu Next.js agar memperbarui halaman cache
    // revalidatePath('/products');

    return { success: true, message: 'Produk berhasil ditambahkan!' };
  } catch (error) {
    return { success: false, error: 'Terjadi kesalahan sistem.' };
  }
}`}
            </pre>
          </div>

          {/* BAGIAN B: CLIENT */}
          <div className="relative">
            <div className="absolute -left-4 top-4 w-1 h-full bg-blue-300 rounded-full"></div>
            <h3 className="text-lg font-bold text-blue-800 mb-2">Bagian B: Client Component (Form UI)</h3>
            <p className="text-sm text-gray-600 mb-3">Gunakan <code>useForm</code> dengan <code>zodResolver</code>, dan panggil <code>submitProduct</code> di fungsi onSubmit.</p>
            <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-md">
{`'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductInput, submitProduct } from './actions';

export default function ProductForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema), // Hubungkan RHF dengan Zod
  });

  const onSubmit = async (data: ProductInput) => {
    // 1. Di titik ini, RHF menjamin data sudah valid sesuai Skema Zod
    // 2. Panggil Server Action! (Tipe data 'data' aman end-to-end)
    const result = await submitProduct(data);
    
    if (result.success) alert(result.message);
    else alert(result.error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Judul Produk</label>
        <input {...register('title')} className="border p-2 w-full" />
        {errors.title && <span className="text-red-500">{errors.title.message}</span>}
      </div>

      <div>
        <label>Harga</label>
        <input type="number" {...register('price', { valueAsNumber: true })} />
        {errors.price && <span className="text-red-500">{errors.price.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Memproses...' : 'Simpan Backend'}
      </button>
    </form>
  );
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <div className="bg-emerald-900 text-emerald-50 p-8 rounded-2xl shadow-xl mt-8">
        <h3 className="text-xl font-bold mb-4">Mengapa ini adalah Standar Emas (Gold Standard)?</h3>
        <p className="leading-relaxed opacity-90 mb-4">
          Pendekatan ini memberikan Anda tiga lapisan kesempurnaan:
        </p>
        <ul className="list-disc list-inside space-y-2 opacity-90">
          <li><strong>User Experience (UX):</strong> Kesalahan ketik dicegat seketika di browser oleh RHF tanpa menunggu server.</li>
          <li><strong>Developer Experience (DX):</strong> End-to-End Type Safety. Anda mendefinisikan bentuk data satu kali di Zod, dan tipe itu otomatis dikenali dari input form HTML hingga masuk ke Database.</li>
          <li><strong>Security:</strong> Karena Zod divalidasi dua kali (di RHF Client dan di fungsi Server Action), server tidak mungkin kebobolan data sampah meskipun pengguna mematikan JavaScript di browser.</li>
        </ul>
      </div>
    </main>
  );
}
