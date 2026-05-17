"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get("q") ?? "";

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const query = (form.elements.namedItem("q") as HTMLInputElement).value.trim();

      startTransition(() => {
        if (query) {
          router.push(`/complex-rendering/search?q=${encodeURIComponent(query)}`);
        } else {
          router.push("/complex-rendering/search");
        }
      });
    },
    [router]
  );

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-xl">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="search"
          name="q"
          defaultValue={currentQuery}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search products"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {isPending ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
