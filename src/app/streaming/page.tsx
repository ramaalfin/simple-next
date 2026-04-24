import { Suspense } from "react";
import Image from "next/image";
import { fetchProductsWithDelay } from "@/lib/api";

// Loading skeleton component
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border border-zinc-200 rounded-lg p-6 dark:border-zinc-700 animate-pulse"
        >
          <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-700 rounded-md mb-4" />
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded mb-4" />
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
      ))}
    </div>
  );
}

// Product display component
async function ProductsSection() {
  const products = await fetchProductsWithDelay(2000); // 2 second delay to simulate heavy payload

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {products.map((product: any) => (
        <div
          key={product.id}
          className="border border-zinc-200 rounded-lg p-6 hover:shadow-lg transition-shadow dark:border-zinc-700 dark:bg-zinc-900"
        >
          {product.images && product.images.length > 0 && (
            <Image
              src={product.images[0]}
              alt={product.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-black dark:text-zinc-50">
              ${product.price}
            </span>
            {product.rating && (
              <span className="text-sm">⭐ {product.rating.toFixed(1)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Stats component for header
async function StatsSection() {
  const products = await fetchProductsWithDelay(1500); // 1.5 second delay

  const totalPrice = products.reduce((sum: number, p: any) => sum + p.price, 0);
  const avgRating = (
    products.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) /
    products.length
  ).toFixed(1);

  return (
    <div className="grid grid-cols-3 gap-4 mb-8 w-full">
      <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-6">
        <p className="text-zinc-600 dark:text-zinc-300 text-sm font-medium">
          Total Products
        </p>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {products.length}
        </p>
      </div>
      <div className="bg-green-100 dark:bg-green-900 rounded-lg p-6">
        <p className="text-zinc-600 dark:text-zinc-300 text-sm font-medium">
          Total Value
        </p>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
          ${totalPrice.toFixed(0)}
        </p>
      </div>
      <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-6">
        <p className="text-zinc-600 dark:text-zinc-300 text-sm font-medium">
          Avg Rating
        </p>
        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
          {avgRating}
        </p>
      </div>
    </div>
  );
}

// Stats skeleton
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8 w-full">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-zinc-200 dark:bg-zinc-700 rounded-lg p-6 h-32 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function StreamingPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-6xl flex-col py-12 px-6 bg-white dark:bg-black">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Streaming with Suspense
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Each section streams independently as data loads. Simulating heavy
            payloads and network latency.
          </p>
        </div>

        {/* Stats Section with Suspense */}
        <Suspense fallback={<StatsSkeleton />}>
          <StatsSection />
        </Suspense>

        <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-6">
          Products
        </h2>

        {/* Products Section with Suspense */}
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsSection />
        </Suspense>
      </main>
    </div>
  );
}
