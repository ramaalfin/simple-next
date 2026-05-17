import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
          <Link href="/rsc" className="text-blue-600">
            View RSC Page
          </Link>
          <Link href="/streaming" className="text-blue-600">
            View Streaming Page
          </Link>
          <Link href="/ppr" className="text-blue-600">
            View PPR Page
          </Link>
          <Link href="/caching" className="text-blue-600">
            View Caching Page
          </Link>
          <Link href="/csr" className="text-blue-600">
            View CSR Page
          </Link>
          <Link href="/ssr" className="text-blue-600">
            View SSR Page
          </Link>
          <Link href="/ssg" className="text-blue-600">
            View SSG Page
          </Link>
          <Link href="/isr" className="text-blue-600">
            View ISR Page
          </Link>
          <Link href="/redux" className="text-blue-600">
            View Redux Patterns
          </Link>
          <Link href="/tanstack-query" className="text-blue-600">
            View TanStack Query
          </Link>
          <Link href="/zustand" className="text-blue-600">
            View Zustand
          </Link>
          <Link href="/zustand-tanstack" className="text-blue-600">
            View Zustand + TanStack
          </Link>
          <Link href="/server-actions" className="text-blue-600">
            View Server Actions
          </Link>
          <Link href="/advanced-caching" className="text-blue-600">
            View Advanced Caching (Overview)
          </Link>
          <Link href="/complex-rendering" className="text-blue-600 font-semibold">
            View Products (Multi-Strategy Demo)
          </Link>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Advanced Patterns & Strategies</h3>
          <div className="flex flex-wrap gap-4 text-base font-medium">
            <Link href="/patterns/swr-strategy" className="text-orange-600 hover:underline">
              SWR Strategy
            </Link>
            <Link href="/patterns/optimistic-updates" className="text-orange-600 hover:underline">
              Optimistic Updates
            </Link>
            <Link href="/patterns/normalized-cache" className="text-orange-600 hover:underline">
              Normalized Cache
            </Link>
            <Link href="/patterns/websocket-sync" className="text-orange-600 hover:underline">
              WebSocket Sync
            </Link>
            <Link href="/patterns/advanced-streaming" className="text-orange-600 hover:underline">
              Advanced Streaming
            </Link>
            <Link href="/patterns/edge-runtime" className="text-orange-600 hover:underline">
              Edge Runtime
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-12">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
