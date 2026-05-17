# Performance Report — Products Feature

## Summary

The products feature uses five distinct rendering strategies, each chosen to
optimize the performance/freshness trade-off for that specific section.

---

## Strategy Performance Characteristics

### 1. Category Listing — ISR

| Metric                  | Value / Notes                                      |
|-------------------------|----------------------------------------------------|
| Time to First Byte      | ~10–50ms (served from cache / CDN edge)            |
| Cache hit rate          | High — categories change rarely                    |
| Origin requests         | ~1 per hour per category (background regeneration) |
| CDN cacheable           | Yes — `s-maxage=3600`                              |
| Stale-while-revalidate  | Yes — users always get a fast response             |

**Key benefit:** Near-instant page loads for the most common entry point.
Background regeneration means users never wait for a rebuild.

---

### 2. Product Detail — SSR Streaming

| Metric                  | Value / Notes                                      |
|-------------------------|----------------------------------------------------|
| Time to First Byte      | ~100–300ms (server fetch + render)                 |
| Streaming               | Yes — reviews and related products stream in       |
| Static shell            | Header, breadcrumb, product info (no cache)        |
| Perceived performance   | Good — skeleton fallbacks shown immediately        |
| Cache hit rate          | 0% — intentionally uncached                        |

**Key benefit:** Users always see current prices and availability. Streaming
means the page is interactive before all data loads. The static shell (HTML
structure) is sent immediately; data fills in progressively.

**Streaming breakdown:**
- Product info: ~100–200ms (first meaningful paint)
- Reviews: stream in after product info (~200–400ms total)
- Related products: served from cache, near-instant

---

### 3. Related Products — PPR

| Metric                  | Value / Notes                                      |
|-------------------------|----------------------------------------------------|
| Time to First Byte      | ~10–50ms (from cache)                              |
| Cache hit rate          | High — same category products change rarely        |
| Included in static shell| Yes — no extra request at render time              |
| CDN cacheable           | Yes (as part of the page's static shell)           |

**Key benefit:** Related products appear instantly without blocking the dynamic
product info. The cached component is part of the prerendered shell.

---

### 4. Inventory — Real-Time CSR

| Metric                  | Value / Notes                                      |
|-------------------------|----------------------------------------------------|
| Initial load            | Shows skeleton, then fetches on mount              |
| Poll interval           | 15 seconds                                         |
| Network requests        | 1 on mount + 1 every 15s while page is open        |
| Latency                 | ~50–150ms per poll (API route → dummyjson)         |
| Cache                   | None (`Cache-Control: no-store`)                   |

**Key benefit:** Stock levels are always current. The pulsing indicator gives
users confidence the data is live.

**Trade-off:** Polling adds background network traffic. For high-traffic
production use, replace with WebSockets or Server-Sent Events.

---

### 5. Search — CSR + Server Filtering

| Metric                  | Value / Notes                                      |
|-------------------------|----------------------------------------------------|
| Search input latency    | Instant (client-side, no network)                  |
| Results latency         | ~100–300ms (server fetch + render after navigation)|
| Streaming               | Yes — results stream in via `<Suspense>`           |
| Cache                   | None — `searchParams` makes page dynamic           |
| Skeleton shown          | Yes — `ProductGridSkeleton` while fetching         |

**Key benefit:** The search bar is responsive immediately (no server round-trip
for input). Filtering happens server-side, so the full product catalog is
searched without sending it to the client.

---

## Core Web Vitals Impact

| Strategy        | LCP Impact  | CLS Impact | FID/INP Impact |
|-----------------|-------------|------------|----------------|
| ISR             | ✅ Excellent | ✅ Low     | ✅ Low         |
| SSR Streaming   | ✅ Good     | ⚠️ Medium* | ✅ Low         |
| PPR             | ✅ Excellent | ✅ Low     | ✅ Low         |
| Real-time CSR   | ✅ Good     | ⚠️ Medium* | ✅ Low         |
| CSR + Server    | ✅ Good     | ⚠️ Medium* | ✅ Low         |

*Skeleton fallbacks minimize CLS. Use `min-height` on skeleton containers to
further reduce layout shift.

---

## Recommendations

1. **Add `generateStaticParams`** to `/products/[id]` for top-selling products
   to pre-render them at build time, reducing SSR latency for popular items.

2. **Replace inventory polling** with Server-Sent Events or WebSockets for
   true real-time updates without the overhead of repeated HTTP requests.

3. **Add `unstable_instant`** export to the category and search pages for
   instant client-side navigation (see Next.js 16 instant navigation guide).

4. **Use `cacheLife('max')`** for truly static content (e.g., product images,
   brand logos) that never changes.

5. **Monitor cache hit rates** using the `x-nextjs-cache` response header
   (`HIT`, `STALE`, `MISS`, `REVALIDATED`) in your observability platform.
