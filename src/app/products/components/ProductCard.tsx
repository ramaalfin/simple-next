import Image from "next/image";
import Link from "next/link";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full h-48 bg-gray-50">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-amber-500">
            <span>★</span>
            <span className="text-gray-600 font-medium">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
