import React from "react";
import { ProductList } from "@/app/csr/components/ProductList";

export const metadata = {
  title: "Client-Side Rendering (CSR) | DummyJSON Products",
  description:
    "A page demonstrating client-side rendering by fetching data from dummyjson.com",
};

export default function CSRPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          Client-Side Rendering (CSR)
        </h1>
        <p className="text-lg text-gray-600">
          This page demonstrates client-side data fetching. The product list
          below is fetched from{" "}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-pink-600 font-mono">
            https://dummyjson.com/products
          </code>{" "}
          after the component mounts on the client.
        </p>
      </div>

      <ProductList />
    </main>
  );
}
