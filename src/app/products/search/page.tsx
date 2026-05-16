// Search page — CSR with server-side filtering
// The search form is a client component. On submit, it navigates to this page
// with ?q=... searchParams is a runtime API, so it must be read inside a
// component that is wrapped in <Suspense> — never directly in the page body.

import { Suspense } from "react";
import Link from "next/link";
import { searchProducts } from "../data";
import { ProductCard } from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton";
import { SearchBar } from "../components/SearchBar";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "Search Products",
  description: "Search the product catalog.",
};

// ─── Dynamic content — reads searchParams inside Suspense ────────────────────
// All runtime data access (searchParams) lives here, not in the page component.

async function SearchContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <>
      {/* Heading depends on query — inside Suspense so it can read searchParams */}
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
        {query ? `Results for "${query}"` : "Search Products"}
      </h1>

      {/* CSR search bar — client component handles form state and navigation */}
      <Suspense
        fallback={
          <div className="h-10 w-full max-w-xl bg-gray-100 rounded-lg animate-pulse" />
        }
      >
        <SearchBar />
      </Suspense>

      <div className="mt-4 p-3 bg-pink-50 border-l-4 border-pink-400 text-pink-700 text-sm rounded">
        <strong>CSR + Server Filtering:</strong> The search bar is a{" "}
        <code className="bg-pink-100 px-1 rounded font-mono text-xs">
          &apos;use client&apos;
        </code>{" "}
        component. On submit it navigates to{" "}
        <code className="bg-pink-100 px-1 rounded font-mono text-xs">
          /products/search?q=...
        </code>
        . The server reads{" "}
        <code className="bg-pink-100 px-1 rounded font-mono text-xs">
          searchParams
        </code>{" "}
        and runs the filter server-side, streaming results back.
      </div>

      <div className="mt-6">
        {query ? (
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <SearchResults query={query} />
          </Suspense>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-4">🛍️</p>
            <p className="text-lg font-medium">
              Enter a search term to find products
            </p>
            <p className="text-sm mt-2">
              Try &ldquo;laptop&rdquo;, &ldquo;phone&rdquo;, or
              &ldquo;beauty&rdquo;
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Server-side search results ───────────────────────────────────────────────
// No 'use cache' — results depend on the query (runtime input)

async function SearchResults({ query }: { query: string }) {
  const data = await searchProducts(query);

  if (!data.products.length) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl mb-2">🔍</p>
        <p className="text-gray-600 font-medium">
          No products found for &ldquo;{query}&rdquo;
        </p>
        <p className="text-gray-400 text-sm mt-1">Try a different search term.</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-500 mb-4">
        {data.total} result{data.total !== 1 ? "s" : ""} for &ldquo;{query}
        &rdquo;
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

// ─── Page — static shell, no runtime data access ──────────────────────────────
// The page component itself has no searchParams access. The static shell
// (breadcrumb, layout) is prerendered. SearchContent streams in at request time.

export default function SearchPage({ searchParams }: PageProps) {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Static breadcrumb — part of the prerendered shell */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/products"
              className="hover:text-blue-600 transition-colors"
            >
              Products
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-gray-800 font-medium">Search</li>
        </ol>
      </nav>

      <div className="mb-6 border-b pb-6">
        {/* SearchContent reads searchParams — must be inside Suspense */}
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-9 bg-gray-200 rounded w-64 animate-pulse" />
              <div className="h-10 w-full max-w-xl bg-gray-100 rounded-lg animate-pulse" />
            </div>
          }
        >
          <SearchContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
