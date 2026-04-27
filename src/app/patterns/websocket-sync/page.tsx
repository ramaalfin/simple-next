import React from 'react';

export const metadata = {
  title: 'Materi: WebSocket Cache Sync',
  description: 'Materi tentang Sinkronisasi Cache via WebSocket di Next.js',
};

export default function WebSocketSyncPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl text-left">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          WebSocket Cache Sync
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed italic">
          Sinkronisasi data real-time secara instan tanpa menunggu waktu revalidasi.
        </p>
      </div>

      <section className="mb-12 text-left">
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl mb-8">
          <h2 className="text-2xl font-bold text-orange-900 mb-2">Kenapa Dibutuhkan?</h2>
          <p className="text-orange-800 leading-relaxed">
            Untuk data yang sangat kritis (seperti stok barang atau harga saham), menunggu 60 detik (ISR) terlalu lama. Kita butuh data terupdate <strong>detik itu juga</strong> saat backend berubah.
          </p>
        </div>

        <div className="relative border-l-2 border-orange-200 ml-4 pl-8 space-y-8">
          <div className="relative">
            <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm"></span>
            <h4 className="font-bold text-gray-900">1. Trigger di Backend</h4>
            <p className="text-sm text-gray-600">Saat data di DB berubah, backend mengirim pesan via WebSocket.</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm"></span>
            <h4 className="font-bold text-gray-900">2. Client Listener</h4>
            <p className="text-sm text-gray-600">Browser menerima pesan tersebut secara real-time.</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm"></span>
            <h4 className="font-bold text-gray-900">3. Global Cache Invalidation</h4>
            <p className="text-sm text-gray-600">Client memicu <code>revalidatePath()</code> untuk membersihkan cache global secara instan.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
