import React, { Suspense } from "react";
import { CommentCard, type Comment } from "./components/CommentCard";
import { TimeDisplay } from "@/app/isr/components/TimeDisplay";

export const metadata = {
  title: "Incremental Static Regeneration (ISR) | DummyJSON Comments",
  description:
    "A page demonstrating ISR by revalidating static data every 60 seconds.",
};

async function getComments(): Promise<Comment[]> {
  const res = await fetch("https://dummyjson.com/comments?limit=10", {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  const data = await res.json();
  return data.comments;
}

async function CommentList() {
  const comments = await getComments();
  return (
    <div className="grid grid-cols-1 gap-4">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

export default function ISRPage() {
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
            Halaman ini di-render pada pukul: <TimeDisplay />
            <br />
            <span className="text-xs text-green-600">
              (Jika Anda merefresh halaman setelah 60 detik, waktu di atas akan
              diperbarui di latar belakang).
            </span>
          </span>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <CommentList />
      </Suspense>
    </main>
  );
}
