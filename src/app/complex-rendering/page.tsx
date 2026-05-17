// Category listing page — ISR via 'use cache' + cacheLife('hours')
// Static shell is prerendered; categories revalidate every ~1 hour.

import { Suspense } from "react";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { getCategories } from "./data";
import { CategoryCard } from "./components/CategoryCard";
import { SearchBar } from "./components/SearchBar";

export const metadata = {
  title: "Products | Multi-Strategy Demo",
  description:
    "Browse products by category. Demonstrates ISR, SSR streaming, PPR, real-time inventory, and CSR search.",
};

// ─── Category list — ISR (revalidate ~1h) ────────────────────────────────────

async function CategoryList() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  const categories = await getCategories();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.slug} category={cat} />
      ))}
    </div>
  );
}

function CategoryListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-xl p-5 bg-white animate-pulse"
        >
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Static header — part of the prerendered shell */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          Products
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Multi-strategy rendering demo. Browse categories (ISR), view product
          details (SSR streaming), see related items (PPR), check live inventory
          (CSR), or search (CSR + server filtering).
        </p>

        {/* Strategy badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: "Category listing", strategy: "ISR 1h", color: "blue" },
            { label: "Product detail", strategy: "SSR streaming", color: "purple" },
            { label: "Related products", strategy: "PPR", color: "amber" },
            { label: "Inventory", strategy: "Real-time CSR", color: "green" },
            { label: "Search", strategy: "CSR + server filter", color: "pink" },
          ].map(({ label, strategy, color }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-${color}-50 text-${color}-700 border border-${color}-200`}
            >
              <span className="font-normal">{label}:</span>
              <span>{strategy}</span>
            </span>
          ))}
        </div>

        {/* Search entry point */}
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="h-10 w-full max-w-xl bg-gray-100 rounded-lg animate-pulse" />}>
            <SearchBar />
          </Suspense>
          <Link
            href="/complex-rendering/search"
            className="text-sm text-blue-600 hover:underline whitespace-nowrap"
          >
            Advanced search →
          </Link>
        </div>
      </div>

      {/* ISR category grid — cached in static shell, revalidates every ~1h */}
      <section aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          Browse by Category
        </h2>
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm rounded">
          <strong>ISR:</strong> Category list is cached and revalidates in the
          background every ~1 hour via{" "}
          <code className="bg-blue-100 px-1 rounded font-mono text-xs">
            &apos;use cache&apos; + cacheLife(&apos;hours&apos;)
          </code>
          .
        </div>
        {/* CategoryList has 'use cache' inside — it's part of the static shell */}
        <CategoryList />
      </section>
    </main>
  );
}
