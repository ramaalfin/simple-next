# Monitoring Setup — Products Feature

This document describes how to monitor the caching behavior, performance, and
health of the products feature in production.

---

## 1. Next.js Built-In Cache Observability

### `x-nextjs-cache` Response Header

Next.js sets the `x-nextjs-cache` header on every response. Inspect it to
understand cache behavior:

| Value         | Meaning                                                    |
|---------------|------------------------------------------------------------|
| `HIT`         | Served from cache — no origin request                      |
| `STALE`       | Served from stale cache — background regeneration started  |
| `MISS`        | Not in cache — rendered fresh, result cached               |
| `REVALIDATED` | Regenerated via on-demand `revalidateTag()`                |

**How to check:**
```bash
curl -I https://your-domain.com/products | grep x-nextjs-cache
```

### Debug Logging

Enable verbose cache logging in development or staging:
```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
```

This logs every cache hit, miss, and revalidation to the server console.

---

## 2. Monitoring by Strategy

### ISR Routes (`/complex-rendering`, `/complex-rendering/category/[slug]`)

**What to monitor:**
- Cache hit rate (should be >95% in steady state)
- Background regeneration frequency (should be ~1/hour per route)
- `STALE` responses (expected — indicates ISR is working)

**Alert on:**
- Cache hit rate dropping below 80% (possible cache invalidation loop)
- Regeneration errors (check server logs for fetch failures)

### SSR Streaming Routes (`/products/[id]`)

**What to monitor:**
- Time to First Byte (TTFB) — target <300ms
- Streaming chunk delivery time — reviews should appear within 500ms
- Error rate on `getProductDetail()` calls

**Alert on:**
- TTFB >1s (upstream API slowness)
- Error rate >1% on product detail fetches

### Real-Time Inventory (`/api/products/inventory`)

**What to monitor:**
- Request rate (should be ~1 req/15s per active product page)
- Response latency — target <200ms
- Error rate

**Alert on:**
- Error rate >5% (upstream inventory API issues)
- Response latency >500ms (consider circuit breaker)

### Search (`/complex-rendering/search`)

**What to monitor:**
- Search query volume and top queries
- Zero-results rate (indicates catalog gaps)
- Response time for search results

---

## 3. Recommended Monitoring Stack

### Option A: Vercel Analytics (if deploying to Vercel)

Vercel provides built-in:
- Core Web Vitals (LCP, CLS, FID/INP) per route
- Cache hit/miss rates via `x-nextjs-cache`
- Function execution time and error rates

No additional setup required — enable in the Vercel dashboard.

### Option B: OpenTelemetry (self-hosted)

Next.js 16 supports OpenTelemetry instrumentation via `instrumentation.ts`:

```ts
// instrumentation.ts (project root)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node')
    const { OTLPTraceExporter } = await import(
      '@opentelemetry/exporter-trace-otlp-http'
    )
    const sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      }),
    })
    sdk.start()
  }
}
```

This traces:
- Server component render times
- `fetch()` calls (including cache hits/misses)
- Route handler execution

### Option C: Custom Logging Middleware

Add a `proxy.js` (Next.js 16 Middleware replacement) to log cache headers:

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Log cache status for monitoring
  const cacheStatus = response.headers.get('x-nextjs-cache')
  if (cacheStatus) {
    console.log(`[Cache] ${request.nextUrl.pathname}: ${cacheStatus}`)
  }

  return response
}

export const config = {
  matcher: ['/products/:path*'],
}
```

---

## 4. Key Metrics Dashboard

Set up a dashboard with these panels:

```
┌─────────────────────────────────────────────────────────────┐
│  Products Feature — Cache Health                            │
├──────────────────┬──────────────────┬───────────────────────┤
│  ISR Hit Rate    │  SSR TTFB (p95)  │  Inventory API Errors │
│  /products       │  /products/[id]  │  /api/products/inv    │
│  Target: >95%    │  Target: <300ms  │  Target: <1%          │
├──────────────────┴──────────────────┴───────────────────────┤
│  Cache Status Distribution (last 1h)                        │
│  HIT: ████████████████ 87%                                  │
│  STALE: ███ 8%                                              │
│  MISS: ██ 5%                                                │
│  REVALIDATED: < 1%                                          │
├─────────────────────────────────────────────────────────────┤
│  Search Zero-Results Rate    │  Inventory Poll Rate         │
│  Target: <10%                │  ~4 req/min per active page  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Alerting Rules

```yaml
# Example alert rules (Prometheus / Grafana format)

- alert: ISRCacheHitRateLow
  expr: rate(nextjs_cache_hit_total[5m]) / rate(nextjs_cache_total[5m]) < 0.8
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "ISR cache hit rate below 80% for /products routes"

- alert: ProductDetailHighLatency
  expr: histogram_quantile(0.95, nextjs_request_duration_seconds{route="/products/[id]"}) > 1
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "Product detail page p95 TTFB exceeds 1s"

- alert: InventoryAPIErrors
  expr: rate(nextjs_api_errors_total{route="/api/products/inventory"}[5m]) > 0.05
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Inventory API error rate exceeds 5%"
```

---

## 6. Health Check Endpoint

Add a health check that verifies the upstream API is reachable:

```ts
// app/api/health/route.ts
export async function GET() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=1', {
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) throw new Error('Upstream API unhealthy')
    return Response.json({ status: 'ok', upstream: 'healthy' })
  } catch (err) {
    return Response.json(
      { status: 'error', upstream: 'unhealthy' },
      { status: 503 }
    )
  }
}
```

Configure your load balancer or uptime monitor to poll `/api/health` every 30s.
