import React from "react";
import { CommentCard, type Comment } from "./components/CommentCard";

export const metadata = {
  title: "Incremental Static Regeneration (ISR) | DummyJSON Comments",
  description:
    "A page demonstrating ISR by revalidating static data every 60 seconds.",
};

/**
 * Pengambilan data untuk ISR.
 * Opsi next: { revalidate: 60 } memberitahu Next.js untuk melakukan pengecekan
 * dan pembaruan data di latar belakang maksimal setiap 60 detik.
 */
async function getComments(): Promise<Comment[]> {
  const res = await fetch("https://dummyjson.com/comments?limit=10", {
    next: { revalidate: 60 }, // Revalidasi setiap 60 detik
  });

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  const data = await res.json();
  return data.comments;
}

export default async function ISRPage() {
  const comments = await getComments();

  // Waktu pembuatan halaman untuk membuktikan revalidasi
  const generatedAt = new Date().toLocaleTimeString();

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          Incremental Static Regeneration (ISR)
        </h1>
        <p className="text-lg text-gray-600">
          Halaman ini mendemonstrasikan ISR. Konten di bawah ini bersifat statis
          namun akan diperbarui secara berkala di latar belakang tanpa perlu
          build ulang manual.
        </p>

        <div className="mt-4 flex items-center gap-3 text-sm text-green-800 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span>
            Halaman ini di-render pada pukul: <strong>{generatedAt}</strong>
            <br />
            <span className="text-xs text-green-600">
              (Jika Anda merefresh halaman setelah 60 detik, waktu di atas akan
              diperbarui di latar belakang).
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </main>
  );
}
