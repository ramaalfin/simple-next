import React from 'react';

export const metadata = {
  title: 'WebSocket Cache Sync di Next.js',
  description: 'Materi mendalam tentang sinkronisasi cache real-time menggunakan WebSocket',
};

export default function WebSocketSyncPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Sinkronisasi: WebSocket Cache Sync
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Menjaga kesegaran data secara real-time di seluruh pengguna dengan memberitahu browser saat terjadi perubahan di server.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Kenapa WebSocket untuk Cache?</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Caching (terutama ISR) biasanya memiliki durasi tertentu (misal 60 detik). Selama durasi tersebut, user akan melihat data lama. Bagaimana jika kita ingin cache tersebut diperbarui **tepat saat** data di DB berubah?
          <br /><br />
          Disinilah peran WebSocket untuk mengirim sinyal "Pembaruan" dari server ke browser.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Alur Kerja (WorkFlow)</h2>
        <div className="space-y-4 text-gray-700">
          <div className="flex gap-4 p-4 border rounded-lg">
            <div className="font-bold text-blue-600">1. Event:</div>
            <p>Data di Database berubah (misal: stok barang berkurang).</p>
          </div>
          <div className="flex gap-4 p-4 border rounded-lg">
            <div className="font-bold text-blue-600">2. Push:</div>
            <p>Backend mengirim pesan via WebSocket (Pusher/Socket.io) ke Client.</p>
          </div>
          <div className="flex gap-4 p-4 border rounded-lg">
            <div className="font-bold text-blue-600">3. Sync:</div>
            <p>Client menerima pesan dan memanggil fungsi revalidasi.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Contoh Implementasi Sederhana</h2>
        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`// src/components/CacheSyncer.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { subscribeToChanges } from '@/lib/websocket'

export default function CacheSyncer() {
  const router = useRouter()

  useEffect(() => {
    // Dengarkan perubahan dari WebSocket
    const channel = subscribeToChanges('products')
    
    channel.on('updated', () => {
      // Memaksa Next.js untuk mengambil data terbaru tanpa full reload
      router.refresh()
    })

    return () => channel.unsubscribe()
  }, [router])

  return null // Komponen ini hanya sebagai listener di background
}`}
        </pre>
        <p className="text-sm text-gray-500 italic">
          Catatan: <code>router.refresh()</code> akan memicu pengambilan data Server Component yang baru di latar belakang dan melakukan re-render yang efisien.
        </p>
      </section>
    </main>
  );
}
