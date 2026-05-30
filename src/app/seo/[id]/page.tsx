import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Tipe data produk dari DummyJSON
type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

// Fungsi helper untuk fetch data
async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch product");
    }
    return res.json();
  } catch (error) {
    return null;
  }
}

// 1. DYNAMIC METADATA GENERATION
// Fungsi ini secara otomatis dipanggil Next.js sebelum merender halaman.
// Menggunakan parameter rute untuk fetch data dan mengembalikan metadata.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
      description: "Maaf, produk yang Anda cari tidak ada.",
    };
  }

  return {
    title: `${product.title} - Promo Spesial`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.thumbnail,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.thumbnail],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  // 2. JSON-LD SCHEMA MARKUP
  // Data terstruktur untuk membantu mesin pencari (Google) menampilkan
  // "Rich Snippets" seperti rating bintang atau harga di hasil pencarian.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.thumbnail,
    description: product.description,
    sku: product.id.toString(),
    brand: {
      "@type": "Brand",
      name: product.brand || "Dummy Brand",
    },
    offers: {
      "@type": "Offer",
      url: `https://simple-next.example.com/seo/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: 89, // Dummy review count
    },
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Script ini akan dirender di DOM untuk dibaca oleh Crawler/Bot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6">
        <Link
          href="/seo"
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          &larr; Kembali ke halaman SEO
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="md:flex">
          <div className="md:w-1/2 p-6 flex justify-center items-center bg-gray-50">
            {/* Menggunakan tag img biasa untuk kesederhanaan demo dari eksternal URL */}
            <img
              src={product.thumbnail}
              alt={product.title}
              className="max-h-80 object-contain drop-shadow-md"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              {product.category}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 text-xl mr-1">★</span>
              <span className="font-medium text-gray-700">{product.rating}</span>
            </div>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-extrabold text-gray-900">
                ${product.price}
              </span>
              {product.discountPercentage > 0 && (
                <span className="bg-red-100 text-red-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Stock: {product.stock} left
            </p>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">SEO Note:</h3>
              <p className="text-sm text-gray-600">
                Coba buka Developer Tools (Inspect Element) &gt; Tab <b>Elements</b>{" "}
                (atau View Page Source). Perhatikan bagian <code>&lt;head&gt;</code>,
                Anda akan melihat tag <code>title</code>, <code>meta description</code>,
                serta <code>og:image</code> yang dibuat secara dinamis menggunakan{" "}
                <code>generateMetadata()</code>. Anda juga akan melihat skrip JSON-LD
                untuk Schema Markup produk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
