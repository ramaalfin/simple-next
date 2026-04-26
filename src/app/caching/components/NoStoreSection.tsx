import { ProductCard } from './ProductCard';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

interface DummyJsonResponse {
  products: Product[];
}

export async function NoStoreSection({ apiUrl }: { apiUrl: string }) {
  const res = await fetch(`${apiUrl}/products?limit=4&skip=4`, {
    cache: 'no-store'
  });
  const data: DummyJsonResponse = await res.json();
  
  // Karena kita memanggil new Date() SETELAH fetch(no-store), ini aman 
  // karena Next.js sudah menganggap route ini opt-in ke dynamic rendering.
  const timestamp = new Date().toLocaleTimeString();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">2. No Store (Dynamic)</h2>
            <p className="text-gray-600 mt-1"><code>{`fetch(..., { cache: 'no-store' })`}</code></p>
            <p className="text-sm text-gray-500 mt-2">Data ini selalu baru. Next.js melakukan fetch secara *real-time* ke API pada setiap request halaman.</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2 self-start sm:self-auto">
            <p className="text-xs text-indigo-800 font-medium">Di-render ulang pada:</p>
            <p className="text-indigo-600 font-bold">{timestamp}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
