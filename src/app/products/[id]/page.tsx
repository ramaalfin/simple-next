// Product detail page — SSR streaming (fresh data on every request)
// Reviews and inventory stream in independently via Suspense.
// Related products use PPR (cached static shell + dynamic slot).

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { getProductDetail, getRelatedProducts } from "../data";
import { ReviewCard } from "../components/ReviewCard";
import { InventoryBadge } from "../components/InventoryBadge";
import { ProductCard } from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/ProductCardSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const product = await getProductDetail(id);
    return {
      title: `${product.title} | Products`,
      description: product.description,
    };
  } catch {
    return { title: "Product | Products" };
  }
}

// ─── Reviews section — SSR streaming (fresh, no cache) ───────────────────────

async function ReviewsSection({ productId }: { productId: string }) {
  const product = await getProductDetail(productId);

  if (!product.reviews?.length) {
    return (
      <p className="text-gray-500 text-sm">No reviews yet for this product.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {product.reviews.map((review, i) => (
        <ReviewCard key={i} review={review} />
      ))}
    </div>
  );
}

// ─── Related products — PPR (cached static shell) ────────────────────────────

async function RelatedProducts({
  category,
  excludeId,
}: {
  category: string;
  excludeId: number;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag("related-products", `related-${category}`);

  const related = await getRelatedProducts(category, excludeId);

  if (!related.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {related.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border border-gray-100 rounded-lg p-4 bg-gray-50 animate-pulse">
          <div className="flex justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mb-1" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
// The page itself is NOT cached — it fetches fresh product data on every request
// and streams in the reviews and related products independently.

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductDetail(id);

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link
              href={`/products/category/${product.category}`}
              className="hover:text-blue-600 transition-colors capitalize"
            >
              {product.category}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-gray-800 font-medium line-clamp-1">{product.title}</li>
        </ol>
      </nav>

      {/* Strategy banner */}
      <div className="mb-6 p-3 bg-purple-50 border-l-4 border-purple-400 text-purple-700 text-sm rounded">
        <strong>SSR Streaming:</strong> Product info is fetched fresh on every
        request (no cache). Reviews stream in independently via{" "}
        <code className="bg-purple-100 px-1 rounded font-mono text-xs">
          &lt;Suspense&gt;
        </code>
        . Related products use{" "}
        <strong>PPR</strong> (cached static shell).
      </div>

      {/* Product hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="flex flex-col gap-3">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>
          {/* Thumbnail strip */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.slice(0, 5).map((img, i) => (
                <div
                  key={i}
                  className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                >
                  <Image
                    src={img}
                    alt={`${product.title} image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-blue-500 font-medium uppercase tracking-wide mb-1">
              {product.brand} · {product.category}
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {product.title}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-amber-500">★</span>
              <span className="font-semibold text-gray-700">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-gray-400">
                ({product.reviews?.length ?? 0} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xl text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Real-time inventory — client-side polling */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              Live Inventory
            </p>
            <InventoryBadge productId={product.id} />
            <p className="text-xs text-gray-400 mt-1">
              Polls every 15s via client-side fetch
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Product meta */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-gray-100 pt-4">
            {[
              { label: "SKU", value: product.meta?.barcode ?? "N/A" },
              { label: "Min. Order", value: `${product.minimumOrderQuantity} units` },
              { label: "Warranty", value: product.warrantyInformation },
              { label: "Shipping", value: product.shippingInformation },
              { label: "Return Policy", value: product.returnPolicy },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-gray-400 font-medium">{label}</dt>
                <dd className="text-gray-700">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Reviews — SSR streaming (fresh on every request) */}
      <section className="mb-12" aria-labelledby="reviews-heading">
        <h2
          id="reviews-heading"
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Customer Reviews
        </h2>
        <div className="mb-3 p-3 bg-purple-50 border-l-4 border-purple-400 text-purple-700 text-sm rounded">
          <strong>SSR Streaming:</strong> Reviews are fetched fresh on every
          request and stream in via{" "}
          <code className="bg-purple-100 px-1 rounded font-mono text-xs">
            &lt;Suspense&gt;
          </code>
          .
        </div>
        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewsSection productId={id} />
        </Suspense>
      </section>

      {/* Related products — PPR (cached static shell + dynamic) */}
      <section aria-labelledby="related-heading">
        <h2
          id="related-heading"
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Related Products
        </h2>
        <div className="mb-3 p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-700 text-sm rounded">
          <strong>PPR:</strong> Related products are cached via{" "}
          <code className="bg-amber-100 px-1 rounded font-mono text-xs">
            &apos;use cache&apos; + cacheLife(&apos;hours&apos;)
          </code>{" "}
          and included in the static shell. They stream in from the cache.
        </div>
        {/* RelatedProducts has 'use cache' — part of the static shell */}
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts category={product.category} excludeId={product.id} />
        </Suspense>
      </section>
    </main>
  );
}
