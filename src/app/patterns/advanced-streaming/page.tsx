import { Suspense } from "react";
import Image from "next/image";

// ==========================================
// MOCK DATA & DELAYED FETCH FUNCTIONS
// ==========================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchProductDetail() {
  await delay(1500); // 1.5 detik
  return {
    id: "prod-1",
    name: "MacBook Pro M3 Max",
    price: "$3,199",
    description:
      "The most advanced Mac laptop ever. Powered by the M3 Max chip with a 16-core CPU, 40-core GPU, and 128GB of unified memory. Brilliant 16-inch Liquid Retina XDR display.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    specs: ["Apple M3 Max", "128GB Unified Memory", "8TB SSD", "16.2-inch Liquid Retina XDR"],
  };
}

async function fetchProductReviews() {
  await delay(3000); // 3 detik
  return [
    { id: 1, user: "Alex D.", rating: 5, comment: "Incredible performance. Compile times are cut in half." },
    { id: 2, user: "Sarah M.", rating: 5, comment: "Battery life is insane for this much power." },
    { id: 3, user: "John Doe", rating: 4, comment: "A bit heavy, but expected for a 16-inch powerhouse." },
  ];
}

async function fetchRelatedProducts() {
  await delay(5000); // 5 detik
  return [
    { id: "rel-1", name: "Magic Mouse", price: "$79" },
    { id: "rel-2", name: "Magic Keyboard", price: "$149" },
    { id: "rel-3", name: "Studio Display", price: "$1,599" },
    { id: "rel-4", name: "AirPods Pro", price: "$249" },
  ];
}

// ==========================================
// SKELETON COMPONENTS (FALLBACKS)
// ==========================================

function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8 animate-pulse w-full">
      <div className="w-full md:w-1/2 h-80 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4"></div>
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/4"></div>
        <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md w-24"></div>
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md w-24"></div>
        </div>
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse mt-8">
      <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md w-48 mb-2"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-32 mb-3"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full"></div>
        </div>
      ))}
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="w-full animate-pulse mt-8">
      <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md w-48 mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// ASYNC DATA COMPONENTS
// ==========================================

async function ProductDetail() {
  const product = await fetchProductDetail();

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full items-start">
      <div className="w-full md:w-1/2 relative h-80 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">{product.name}</h2>
        <span className="text-2xl font-semibold text-orange-600 mb-4">{product.price}</span>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.specs.map((spec, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 text-xs rounded-full font-medium"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

async function ProductReviews() {
  const reviews = await fetchProductReviews();

  return (
    <div className="w-full mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8">
      <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Customer Reviews</h3>
      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-md transition-shadow bg-white dark:bg-zinc-950">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-black dark:text-white">{review.user}</span>
              <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

async function RelatedProducts() {
  const products = await fetchRelatedProducts();

  return (
    <div className="w-full mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8 pb-12">
      <h3 className="text-2xl font-bold text-black dark:text-white mb-6">You Might Also Like</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer group">
            <div className="h-20 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-4 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
              <span className="text-xs font-medium">Image</span>
            </div>
            <div>
              <h4 className="font-semibold text-black dark:text-white text-sm">{p.name}</h4>
              <p className="text-orange-600 font-medium text-sm mt-1">{p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function AdvancedStreamingPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-zinc-50 dark:bg-black py-16 px-6 font-sans">
      <main className="w-full max-w-5xl flex flex-col bg-white dark:bg-black rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-900 p-8 md:p-12">
        {/* Header - Instant Load */}
        <div className="mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Advanced Streaming
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Mendemonstrasikan Component-level Streaming di Next.js
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
              Instan (0s)
            </span>
          </div>
        </div>

        {/* Section 1: Product Detail (1.5s delay) */}
        <div className="relative w-full">
          <div className="absolute -left-12 top-0 hidden lg:flex flex-col items-end gap-1">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-[10px] font-bold">
              1.5s
            </span>
          </div>
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetail />
          </Suspense>
        </div>

        {/* Section 2: Reviews (3s delay) */}
        <div className="relative w-full">
          <div className="absolute -left-12 top-12 hidden lg:flex flex-col items-end gap-1">
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-md text-[10px] font-bold">
              3.0s
            </span>
          </div>
          <Suspense fallback={<ReviewsSkeleton />}>
            <ProductReviews />
          </Suspense>
        </div>

        {/* Section 3: Related Products (5s delay) */}
        <div className="relative w-full">
          <div className="absolute -left-12 top-12 hidden lg:flex flex-col items-end gap-1">
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-[10px] font-bold">
              5.0s
            </span>
          </div>
          <Suspense fallback={<RelatedProductsSkeleton />}>
            <RelatedProducts />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
