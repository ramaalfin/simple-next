# Caching Strategy — Products Feature

This document describes the caching strategy for each section of the product
listing and detail pages. The project runs **Next.js 16** with
`cacheComponents: true`, which enables the **Cache Components** model. All
caching is expressed via the `'use cache'` directive and `cacheLife()` — not
via `export const revalidate` or `fetch` options.

---

## Overview

| Route / Section          | Strategy                  | Cache Lifetime | Directive / API                          |
|--------------------------|---------------------------|----------------|------------------------------------------|
| `/complex-rendering`              | ISR (category listing)    | ~1 hour        | `'use cache' + cacheLife('hours')`       |
| `/complex-rendering/category/[slug]` | ISR (product grid)     | ~1 hour        | `'use cache' + cacheLife('hours')`       |
| `/complex-rendering/[id]`         | SSR streaming (product info) | No cache    | No directive — fresh on every request    |
| `/complex-rendering/[id]` reviews | SSR streaming             | No cache       | No directive — streamed via `<Suspense>` |
| `/complex-rendering/[id]` related | PPR (static shell)        | ~1 hour        | `'use cache' + cacheLife('hours')`       |
| `/complex-rendering/[id]` inventory | Real-time CSR           | No cache       | Client-side polling every 15s            |
| `/complex-rendering/search`       | CSR + server filtering    | No cache       | `searchParams` — dynamic by default      |
| `/api/complex-rendering/inventory` | No cache                 | No cache       | `Cache-Control: no-store`                |

---

## Strategy Details

### 1. Category Listing — ISR (`/complex-rendering`, `/complex-rendering/category/[slug]`)

**Why ISR?** Category names and product lists change infrequently (new products
are added, not removed constantly). Serving a cached version for up to 1 hour
reduces origin load while keeping content reasonably fresh.

**Implementation:**
```tsx
async function CategoryList() {
  'use cache'
  cacheLife('hours')
  cacheTag('categories')
  const categories = await getCategories()
  // ...
}
```

The `cacheLife('hours')` profile sets:
- **stale**: 5 minutes (client router)
- **revalidate**: ~1 hour (server background regeneration)
- **expire**: never (long-lived)

`cacheTag('categories')` enables on-demand invalidation via `revalidateTag('categories')`.

**CDN behavior:** Next.js sets `s-maxage=3600, stale-while-revalidate=...` on
the response. CDNs that respect `s-maxage` will cache the static shell at the
edge for up to 1 hour.

---

### 2. Product Detail — SSR Streaming (`/complex-rendering/[id]`)

**Why SSR?** Product prices, descriptions, and availability can change at any
time. Serving stale product info (especially price) is a business risk. Fresh
data on every request is required.

**Implementation:**
```tsx
// No 'use cache' — fetched fresh on every request
export default async function ProductDetailPage({ params }) {
  const product = await getProductDetail(id)
  // ...
}
```

The page is not cached. Under Cache Components, any component without `'use
cache'` that accesses async data is dynamic by default. It must be wrapped in
`<Suspense>` if it's nested inside a cached parent.

**Reviews** are also fetched fresh and stream in independently:
```tsx
async function ReviewsSection({ productId }) {
  // No 'use cache' — fresh reviews on every request
  const product = await getProductDetail(productId)
  // ...
}
// Wrapped in <Suspense> in the page
```

**CDN behavior:** `Cache-Control: private, no-cache, no-store` — not cached at
the CDN edge.

---

### 3. Related Products — PPR (`/complex-rendering/[id]` related section)

**Why PPR?** Related products (same category) change infrequently. They can be
included in the static shell of the product detail page, reducing the amount of
work done at request time. The product detail page itself is dynamic (SSR), but
the related products section is a cached island within it.

**Implementation:**
```tsx
async function RelatedProducts({ category, excludeId }) {
  'use cache'
  cacheLife('hours')
  cacheTag('related-products', `related-${category}`)
  const related = await getRelatedProducts(category, excludeId)
  // ...
}
```

This is the PPR pattern: a cached component (`'use cache'`) nested inside a
dynamic page. The cached component's output is included in the static shell;
the dynamic product info streams in at request time.

---

### 4. Inventory — Real-Time CSR (`/complex-rendering/[id]` inventory badge)

**Why real-time CSR?** Stock levels change frequently (purchases, restocks).
Showing stale inventory data could lead to overselling or poor UX. The
`InventoryBadge` component polls `/api/complex-rendering/inventory?id=...` every 15
seconds from the client.

**Implementation:**
```tsx
'use client'
// Polls /api/complex-rendering/inventory every 15 seconds
useEffect(() => {
  fetchInventory()
  const interval = setInterval(fetchInventory, 15_000)
  return () => clearInterval(interval)
}, [fetchInventory])
```

The API route returns `Cache-Control: no-store` to prevent any intermediate
caching.

**Trade-off:** Polling adds network requests. For production, consider
WebSockets or Server-Sent Events for true real-time updates.

---

### 5. Search — CSR + Server-Side Filtering (`/complex-rendering/search`)

**Why CSR + server filtering?** Search queries are user-specific and
unpredictable — caching them would be wasteful and potentially incorrect. The
search bar is a `'use client'` component that navigates to
`/complex-rendering/search?q=...`. The server reads `searchParams` (a runtime API) and
runs the filter server-side, streaming results back.

**Implementation:**
```tsx
// SearchBar.tsx — 'use client'
router.push(`/complex-rendering/search?q=${encodeURIComponent(query)}`)

// search/page.tsx — server component, reads searchParams
async function SearchResults({ query }) {
  // No 'use cache' — depends on runtime searchParams
  const data = await searchProducts(query)
  // ...
}
```

`searchParams` is a runtime API, so the page is dynamic by default. No caching
is applied.

---

## Cache Invalidation

| Tag                        | Invalidated by                                      |
|----------------------------|-----------------------------------------------------|
| `categories`               | `revalidateTag('categories')` in a Route Handler    |
| `category-{slug}`          | `revalidateTag('category-{slug}')` per category     |
| `related-products`         | `revalidateTag('related-products')` for all related |
| `related-{category}`       | `revalidateTag('related-{category}')` per category  |

Example on-demand revalidation (e.g., after a product catalog update):
```ts
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { tag } = await request.json()
  revalidateTag(tag)
  return Response.json({ revalidated: true })
}
```
