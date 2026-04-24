import { fetchProducts } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata() {
  const products = await fetchProducts();

  return {
    title: "Home - Simple Next.js Store",
    description: `We have ${products.length} products in our store.`,
  };
}

export default async function RSCPage() {
  const products = await fetchProducts();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-8">
          Our Products
        </h1>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="border border-zinc-200 rounded-lg p-6 hover:shadow-lg transition-shadow dark:border-zinc-700"
              >
                {product.images && (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    {product.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-black dark:text-zinc-50">
                    ${product.price}
                  </span>
                  <Link href={`/rsc/${product.id}`} className="text-blue-600">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-600 dark:text-zinc-400">
            No products available.
          </p>
        )}
      </main>
    </div>
  );
}
