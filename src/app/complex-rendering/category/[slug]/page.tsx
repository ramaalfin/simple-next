// Category detail page — ISR via 'use cache' + cacheLife('hours')
// Shows all products in a category. Revalidates every ~1 hour.

import { Suspense } from "react";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { getProductsByCategory } from "../../data";
import { ProductCard } from "../../components/ProductCard";
import { ProductGridSkeleton } from "../../components/ProductCardSkeleton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const displayName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${displayName} | Products`,
    description: `Browse ${displayName} products. Cached with ISR — revalidates every hour.`,
  };
}

// ─── Product grid — ISR (revalidate ~1h) ─────────────────────────────────────

async function CategoryProducts({ slug }: { slug: string }) {
  "use cache";
  cacheLife("hours");
  cacheTag("categories", `category-${slug}`);

  const data = await getProductsByCategory(slug);

  if (!data.products.length) {
    return (
      <p className="text-gray-500 py-12 text-center">
        No products found in this category.
      </p>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-500 mb-4">
        {data.total} products found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const displayName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-gray-800 font-medium">{displayName}</li>
        </ol>
      </nav>

      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
          {displayName}
        </h1>
        <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm rounded">
          <strong>ISR:</strong> This product grid is cached and revalidates in
          the background every ~1 hour via{" "}
          <code className="bg-blue-100 px-1 rounded font-mono text-xs">
            &apos;use cache&apos; + cacheLife(&apos;hours&apos;)
          </code>
          .
        </div>
      </div>

      {/* CategoryProducts has 'use cache' — included in the static shell */}
      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <CategoryProducts slug={slug} />
      </Suspense>
    </main>
  );
}
