import { fetchProductById } from "@/lib/api";
import Image from "next/image";
import { Suspense } from "react";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProductById(id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            width={500}
            height={500}
            className="rounded-lg object-contain"
            priority
          />
        ) : product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={500}
            height={500}
            className="rounded-lg object-contain"
            priority
          />
        ) : null}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            {product.title}
          </h1>
          {product.brand && (
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Brand: <span className="font-semibold">{product.brand}</span>
            </p>
          )}
        </div>

        <div className="border-t border-b border-zinc-200 dark:border-zinc-700 py-4">
          <p className="text-3xl font-bold text-black dark:text-zinc-50">
            ${product.price}
          </p>
          {product.discountPercentage > 0 && (
            <p className="text-red-600 font-semibold mt-2">
              {product.discountPercentage}% OFF
            </p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
            Description
          </h3>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {product.description}
          </p>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-4">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-4xl py-8 px-6 bg-white dark:bg-black">
        <a
          href="/rsc"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          ← Back to Products
        </a>

        <Suspense fallback={<div className="animate-pulse h-96 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />}>
          <ProductDetail params={params} />
        </Suspense>
      </main>
    </div>
  );
}
