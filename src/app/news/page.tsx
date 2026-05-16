import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";

// 1. Request Memoization (Deduplikasi)
// Fungsi ini akan dipanggil di beberapa komponen berbeda
async function getNewsUser() {
  console.log("Fetching user profile..."); // Akan muncul sekali saja di log
  const res = await fetch("https://dummyjson.com/users/1");
  return res.json();
}

async function Header() {
  const user = await getNewsUser();
  return (
    <header className="flex justify-between items-center p-4 bg-zinc-900 text-white rounded-t-lg">
      <h1 className="text-xl font-bold">Portal Berita</h1>
      <div className="text-sm">Halo, {user.firstName}!</div>
    </header>
  );
}

async function ProfileWidget() {
  const user = await getNewsUser();
  return (
    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      <h3 className="font-bold mb-2">Profil Penulis</h3>
      <p className="text-sm">{user.firstName} {user.lastName}</p>
      <p className="text-xs text-zinc-500">{user.email}</p>
    </div>
  );
}

// 2 & 3. Data Cache & Full Route Cache
// Menggunakan 'use cache' dan cacheLife
async function TrendingArticles() {
  "use cache";
  // stale 2 minutes
  cacheLife({ stale: 120 })
  cacheTag("trending-news"); // Label untuk on-demand revalidation

  // Simulasi fetch data artikel
  const res = await fetch("https://dummyjson.com/posts?limit=5");
  const data = await res.json();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Berita Terpopuler</h2>
      <div className="grid gap-4">
        {data.posts.map((post: any) => (
          <div key={post.id} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <h4 className="font-semibold">{post.title}</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{post.body}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-400">
        Terakhir diupdate: {new Date().toLocaleTimeString()} (Cached for 2m)
      </p>
    </div>
  );
}

// 4. On-Demand Revalidation (via API Route nanti)
async function BreakingNews() {
  // Komponen ini tidak menggunakan 'use cache' secara eksplisit di sini
  // tetapi bisa diatur dari fetch level atau parent
  const res = await fetch("https://dummyjson.com/posts/1", {
    next: { tags: ["breaking-news"] },
  });
  const post = await res.json();

  return (
    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <h3 className="text-lg font-bold">BREAKING NEWS</h3>
      </div>
      <h4 className="text-xl font-semibold mb-2">{post.title}</h4>
      <p className="text-sm text-red-800 dark:text-red-200">{post.body}</p>
    </div>
  );
}

export default function NewsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      <Suspense fallback={<div className="h-16 bg-zinc-800 animate-pulse rounded-t-lg" />}>
        <Header />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Suspense fallback={<div className="animate-pulse h-32 bg-red-50 dark:bg-red-900/10 rounded-lg" />}>
            <BreakingNews />
          </Suspense>

          <Suspense fallback={<div className="animate-pulse h-64 bg-zinc-100 rounded-lg" />}>
            <TrendingArticles />
          </Suspense>
        </div>

        <aside className="space-y-6">
          <Suspense fallback={<div className="animate-pulse h-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />}>
            <ProfileWidget />
          </Suspense>

          <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded-lg">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Info Caching</h3>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-2">
              <li><strong>Layer 1:</strong> Header & Profile memakai data User yang sama (Deduplikasi).</li>
              <li><strong>Layer 2/3:</strong> Trending di-cache 1 menit via <code>cacheLife</code>.</li>
              <li><strong>Layer 4:</strong> Breaking News bisa di-reset kapan saja via API tag <code>breaking-news</code>.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
