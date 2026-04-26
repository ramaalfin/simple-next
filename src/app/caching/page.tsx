import { Suspense } from 'react';
import { ForceCacheSection } from './components/ForceCacheSection';
import { NoStoreSection } from './components/NoStoreSection';
import { RevalidateSection } from './components/RevalidateSection';
import { Timestamp } from './components/Timestamp';

export default function CachingPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Implementasi Caching Next.js
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Halaman ini mengambil data dengan 3 strategi berbeda.
          </p>
          <div className="mt-4 inline-block bg-white border border-gray-200 rounded-lg px-6 py-3 shadow-sm">
            <p className="text-gray-700">
              Cangkang halaman (Shell) selesai dimuat di browser pada: <strong className="text-indigo-600"><Timestamp /></strong>
            </p>
            <p className="text-sm text-gray-500 mt-1 max-w-xl mx-auto">
              Halaman ini menggunakan <code>&lt;Suspense&gt;</code> untuk membungkus data dinamis (no-store), sehingga 
              bagian yang dinamis tidak memblokir proses rendering seluruh halaman. Waktu di komponen No Store adalah waktu dari server.
            </p>
          </div>
        </div>

        {/* Section 1: Force Cache */}
        <ForceCacheSection apiUrl={apiUrl} />

        {/* Section 2: No Store */}
        <Suspense fallback={
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center min-h-[300px]">
            <p className="text-gray-500 font-medium animate-pulse">Memuat data dinamis...</p>
          </div>
        }>
          <NoStoreSection apiUrl={apiUrl} />
        </Suspense>

        {/* Section 3: Revalidate (ISR) */}
        <RevalidateSection apiUrl={apiUrl} />

      </div>
    </div>
  );
}
