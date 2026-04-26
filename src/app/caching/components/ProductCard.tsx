import Image from 'next/image';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={product.title}>
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2" title={product.description}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">${product.price}</span>
          <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
