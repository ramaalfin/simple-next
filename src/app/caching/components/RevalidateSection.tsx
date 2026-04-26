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

export async function RevalidateSection({ apiUrl }: { apiUrl: string }) {
  const res = await fetch(`${apiUrl}/products?limit=4&skip=8`, {
    next: { revalidate: 60 } 
  });
  const data: DummyJsonResponse = await res.json();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">3. ISR (Revalidate 60s)</h2>
        <p className="text-gray-600 mt-1"><code>{`fetch(..., { next: { revalidate: 60 } })`}</code></p>
        <p className="text-sm text-gray-500 mt-2">Data di-cache selama 60 detik. Setelah 60 detik, request pertama akan menggunakan data lama sambil me-revalidate data baru di background.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
