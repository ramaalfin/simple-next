# CDN Configuration — Products Feature

This document covers CDN configuration for the products feature, based on the
Next.js 16 CDN caching guide (`node_modules/next/dist/docs/01-app/02-guides/cdn-caching.md`).

---

## Cache-Control Headers Set by Next.js

Next.js automatically sets `Cache-Control` headers based on the rendering
strategy of each route:

| Route                        | Strategy    | Cache-Control Header                                      |
|------------------------------|-------------|-----------------------------------------------------------|
| `/complex-rendering`                  | ISR (1h)    | `s-maxage=3600, stale-while-revalidate=<expire-revalidate>` |
| `/complex-rendering/category/[slug]`  | ISR (1h)    | `s-maxage=3600, stale-while-revalidate=<expire-revalidate>` |
| `/complex-rendering/[id]`             | SSR         | `private, no-cache, no-store, max-age=0, must-revalidate` |
| `/complex-rendering/search`           | Dynamic     | `private, no-cache, no-store, max-age=0, must-revalidate` |
| `/api/products/inventory`    | No cache    | `no-store`                                                |
| `/_next/static/**`           | Static      | `public, max-age=31536000, immutable`                     |

---

## Required CDN Configuration

### 1. Cache Key — Include `_rsc` Search Parameter

Next.js uses the `_rsc` search parameter as a cache-key discriminator to
distinguish HTML responses from RSC (React Server Components) payloads. Your
CDN **must not strip query parameters** from cache keys.

**Cloudflare (Workers / Cache Rules):**
```
# Cache Rule: include _rsc in cache key
Cache Key: URL (including query string)
```

**AWS CloudFront (Cache Policy):**
```json
{
  "QueryStringsConfig": {
    "QueryStringBehavior": "whitelist",
    "QueryStrings": {
      "Items": ["_rsc"]
    }
  }
}
```

**Vercel:** Handled automatically — no configuration needed.

---

### 2. Forward Required Headers

The `rsc` request header **must be forwarded** from the client to the origin.
If the CDN strips it, the server returns HTML when the client router expects
RSC data, breaking client-side navigation.

**Cloudflare:**
```
# In your Worker or Transform Rule:
# Forward the 'rsc' header to origin
```

**AWS CloudFront (Origin Request Policy):**
```json
{
  "HeadersConfig": {
    "HeaderBehavior": "whitelist",
    "Headers": {
      "Items": ["rsc", "next-router-prefetch", "next-router-state-tree"]
    }
  }
}
```

---

### 3. Vary Header Support

Next.js sets a `Vary` header on responses:
```
Vary: rsc, next-router-state-tree, next-router-prefetch
```

CDNs that support `Vary` will automatically serve the correct response variant.
For CDNs that don't support `Vary`, the `_rsc` parameter handles this.

---

### 4. Static Assets — Long-Term Caching

All files under `/_next/static/` include content hashes and should be cached
for 1 year:

**Cloudflare Page Rule:**
```
URL: example.com/_next/static/*
Cache Level: Cache Everything
Edge Cache TTL: 1 year
```

**AWS CloudFront Behavior:**
```
Path Pattern: /_next/static/*
Cache Policy: Managed-CachingOptimized (1 year TTL)
Compress: Yes
```

---

### 5. On-Demand Revalidation + CDN Purge

When `revalidateTag()` is called (e.g., after a product catalog update), it
invalidates the Next.js server cache. However, the CDN will continue serving
its cached copy until `s-maxage` expires. To propagate invalidation to the CDN,
trigger a CDN purge alongside the revalidation call.

**Pattern:**
```ts
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { tag, paths } = await request.json()

  // 1. Invalidate Next.js server cache
  revalidateTag(tag)

  // 2. Purge CDN cache for affected paths
  await purgeCDNCache(paths) // your CDN purge API call

  return Response.json({ revalidated: true })
}
```

**Cloudflare Purge API:**
```ts
await fetch('https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    files: paths.map(p => `https://example.com${p}`)
  })
})
```

---

### 6. Dynamic Routes — Bypass CDN Cache

Product detail pages (`/products/[id]`) and search (`/complex-rendering/search`) are
dynamic (SSR). Configure your CDN to bypass caching for these routes:

**Cloudflare Cache Rule:**
```
If URL path matches: /complex-rendering/[0-9]* OR /complex-rendering/search*
Then: Bypass Cache
```

**AWS CloudFront Behavior:**
```
Path Pattern: /complex-rendering/[0-9]*
Cache Policy: CachingDisabled
```

---

### 7. Inventory API — Never Cache

The `/api/products/inventory` endpoint returns `Cache-Control: no-store`.
Ensure your CDN respects this and does not cache API responses:

**Cloudflare Cache Rule:**
```
If URL path starts with: /api/
Then: Bypass Cache
```

---

## Summary Checklist

- [ ] `_rsc` query parameter included in CDN cache key
- [ ] `rsc` header forwarded to origin
- [ ] `Vary` header respected (or `_rsc` fallback in use)
- [ ] `/_next/static/**` cached for 1 year with `immutable`
- [ ] `/complex-rendering` and `/complex-rendering/category/**` cached with `s-maxage=3600`
- [ ] `/complex-rendering/[id]` and `/complex-rendering/search` bypass CDN cache
- [ ] `/api/**` bypasses CDN cache
- [ ] CDN purge triggered alongside `revalidateTag()` calls
