import React, { Suspense } from 'react';
import { PostCard, type Post } from './components/PostCard';

export const metadata = {
  title: 'Server-Side Rendering (SSR) | DummyJSON Posts',
  description: 'A page demonstrating server-side rendering by fetching data from dummyjson.com',
};

async function getPosts(): Promise<Post[]> {
  // cache: 'no-store' memastikan data tidak di-cache (static) melainkan diambil ulang per request
  const res = await fetch('https://dummyjson.com/posts?limit=12', {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  const data = await res.json();
  return data.posts;
}

// Komponen asinkron yang melakukan data fetching
async function PostList() {
  const posts = await getPosts();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// Halaman utama sekarang tidak asinkron, membiarkan <Suspense> menangani bagian dinamisnya
export default function SSRPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          Server-Side Rendering (SSR)
        </h1>
        <p className="text-lg text-gray-600">
          This page demonstrates server-side data fetching. The post list
          below is fetched from{" "}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-pink-600 font-mono">
            https://dummyjson.com/posts
          </code>{" "}
          on the server before the HTML is sent to the client.
        </p>
      </div>
      
      {/* 
        Karena kita memiliki cacheComponents: true (fitur PPR), setiap data dinamis (no-store)
        harus dibungkus dengan <Suspense>. Ini mencegah data dinamis memblokir proses
        rendering statis untuk sisa halaman (seperti judul dan paragraf di atas).
      */}
      <Suspense fallback={
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      }>
        <PostList />
      </Suspense>
    </main>
  );
}
