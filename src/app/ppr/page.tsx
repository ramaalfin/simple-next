import { Suspense } from "react";
import Image from "next/image";
import { fetchProductsWithDelay } from "@/lib/api";
import { TimestampDisplay } from "./components/TimeDisplay";

// Skeleton for trending products
function TrendingProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="border border-zinc-200 rounded-lg p-4 dark:border-zinc-700 animate-pulse"
        >
          <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-700 rounded-md mb-3" />
          <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
      ))}
    </div>
  );
}

// Dynamic trending products section
async function TrendingProducts() {
  const products = await fetchProductsWithDelay(2000);
  const trending = products.slice(5, 9);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {trending.map((product: any) => (
        <div
          key={product.id}
          className="border border-zinc-200 rounded-lg p-4 hover:shadow-md transition-shadow dark:border-zinc-700 dark:bg-zinc-900"
        >
          {product.images && product.images.length > 0 && (
            <Image
              src={product.images[0]}
              alt={product.title}
              width={200}
              height={150}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
          )}
          <h4 className="text-sm font-semibold text-black dark:text-zinc-50 mb-1 line-clamp-2">
            {product.title}
          </h4>
          <p className="text-xs font-bold text-black dark:text-zinc-50">
            ${product.price}
          </p>
        </div>
      ))}
    </div>
  );
}

// Static build timestamp using the "use cache" directive
async function BuildTimestamp() {
  "use cache";
  return (
    <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center mt-2">
      Build Timestamp: {new Date().toISOString()}
    </p>
  );
}

export default function PPRPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-6xl flex-col py-12 px-6 bg-white dark:bg-black">
        {/* Static Header - Prerendered at build time */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Partial Prerendering (PPR)
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            This page demonstrates Next.js Partial Prerendering where static
            content is prerendered at build time, and dynamic content streams in
            at request time.
          </p>
          <TimestampDisplay />
        </div>

        {/* Static Section Info */}
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
            📌 How Partial Prerendering Works
          </h3>
          <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
            <li>
              <strong>Static Content:</strong> Header, footer, and layout are
              prerendered at build time
            </li>
            <li>
              <strong>Dynamic Sections:</strong> Wrapped in Suspense, they
              render on-demand at request time
            </li>
            <li>
              <strong>Performance:</strong> Combines speed of static generation
              with freshness of dynamic content
            </li>
            <li>
              <strong>Streaming:</strong> Dynamic sections appear as they load,
              providing a responsive experience
            </li>
          </ul>
        </div>

        {/* Trending Section - Dynamic */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-6">
            🔥 Trending Now (Dynamic - Renders at request time)
          </h2>
          <Suspense fallback={<TrendingProductsSkeleton />}>
            <TrendingProducts />
          </Suspense>
        </div>

        {/* Static Footer */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
            ✓ This footer is prerendered at build time (static content). Refresh
            the page to see the static timestamp update only when the page is
            rebuilt.
          </p>
          <BuildTimestamp />
        </div>
      </main>
    </div>
  );
}
