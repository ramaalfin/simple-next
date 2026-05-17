// Server-side data fetching functions for the products feature
// Uses the Cache Components model (Next.js 16 with cacheComponents: true)

import { cacheLife, cacheTag } from "next/cache";
import type { Category, Product, ProductDetail, ProductsResponse } from "./types";

const API_BASE = "https://dummyjson.com";

// ─── Category listing — ISR: revalidate every 1 hour ─────────────────────────

export async function getCategories(): Promise<Category[]> {
    "use cache";
    cacheLife("hours");
    cacheTag("categories");

    const res = await fetch(`${API_BASE}/products/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

export async function getProductsByCategory(
    categorySlug: string
): Promise<ProductsResponse> {
    "use cache";
    cacheLife("hours");
    cacheTag("categories", `category-${categorySlug}`);

    const res = await fetch(
        `${API_BASE}/products/category/${categorySlug}?limit=20`
    );
    if (!res.ok) throw new Error(`Failed to fetch products for ${categorySlug}`);
    return res.json();
}

// ─── Product detail — SSR streaming: always fresh ────────────────────────────
// No 'use cache' — this data is fetched fresh on every request and streamed

export async function getProductDetail(id: string): Promise<ProductDetail> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
    return res.json();
}

// ─── Related products — PPR: cached static shell ─────────────────────────────

export async function getRelatedProducts(
    category: string,
    excludeId: number
): Promise<Product[]> {
    "use cache";
    cacheLife("hours");
    cacheTag("related-products", `related-${category}`);

    const res = await fetch(
        `${API_BASE}/products/category/${category}?limit=8`
    );
    if (!res.ok) throw new Error("Failed to fetch related products");
    const data: ProductsResponse = await res.json();
    return data.products.filter((p) => p.id !== excludeId).slice(0, 4);
}

// ─── Search — server-side filtering ──────────────────────────────────────────
// No 'use cache' — search results depend on the query (runtime input)

export async function searchProducts(query: string): Promise<ProductsResponse> {
    const res = await fetch(
        `${API_BASE}/products/search?q=${encodeURIComponent(query)}&limit=20`
    );
    if (!res.ok) throw new Error("Failed to search products");
    return res.json();
}

// ─── Inventory — real-time stock data ────────────────────────────────────────
// No 'use cache' — inventory must be fresh on every request

export async function getInventory(
    productId: string
): Promise<{ stock: number; availabilityStatus: string }> {
    const res = await fetch(`${API_BASE}/products/${productId}`);
    if (!res.ok) throw new Error("Failed to fetch inventory");
    const data: ProductDetail = await res.json();
    return {
        stock: data.stock,
        availabilityStatus: data.availabilityStatus,
    };
}
