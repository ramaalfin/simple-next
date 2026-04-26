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

export async function ForceCacheSection({ apiUrl }: { apiUrl: string }) {
  const res = await fetch(`${apiUrl}/products?limit=4&skip=0`, {
    cache: 'force-cache'
  });
  const data: DummyJsonResponse = await res.json();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">1. Force Cache</h2>
        <p className="text-gray-600 mt-1"><code>{`fetch(..., { cache: 'force-cache' })`}</code></p>
        <p className="text-sm text-gray-500 mt-2">Data ini disimpan permanen. Tidak akan mengirim request ulang ke dummyjson meskipun halaman direfresh.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
