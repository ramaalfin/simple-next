import React from "react";
import Link from "next/link";
import { Metadata } from "next";

// 1. Static Metadata
// Objek metadata diekspor dari layout atau page. Next.js secara otomatis
// menyisipkan ini ke dalam elemen <head> HTML.
export const metadata: Metadata = {
  title: "SEO & Metadata di Next.js",
  description: "Pelajari cara mengelola SEO dan Metadata di Next.js App Router.",
  keywords: ["Next.js", "SEO", "Metadata", "React", "Web Development"],
  openGraph: {
    title: "SEO & Metadata di Next.js | Simple Next",
    description: "Panduan lengkap penerapan SEO pada Next.js App Router",
    type: "website",
    locale: "id_ID",
    url: "https://simple-next.example.com/seo",
    siteName: "Simple Next",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO & Metadata di Next.js",
    description: "Pelajari cara mengelola SEO dan Metadata di Next.js App Router.",
  },
};

export default function SEOPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          SEO & Metadata API
        </h1>
        <p className="text-lg text-gray-600">
          Next.js App Router memiliki Metadata API yang sangat kuat, memungkinkan Anda untuk
          menentukan metadata secara statis maupun dinamis untuk optimasi mesin pencari (SEO).
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">1. Static Metadata</h2>
        <p className="mb-4 text-gray-700">
          Anda dapat mendefinisikan metadata statis dengan mengekspor objek <code>metadata</code>{" "}
          dari file <code>layout.tsx</code> atau <code>page.tsx</code>. Halaman ini adalah
          contoh penggunaan Static Metadata. Coba periksa elemen <code>&lt;head&gt;</code> di
          developer tools browser Anda!
        </p>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO & Metadata di Next.js",
  description: "Pelajari cara mengelola SEO dan Metadata di Next.js",
};`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">2. Dynamic Metadata</h2>
        <p className="mb-4 text-gray-700">
          Untuk halaman yang bergantung pada data eksternal (seperti halaman detail produk),
          Anda dapat menggunakan fungsi <code>generateMetadata()</code>. Fungsi ini akan
          mengambil data dan mengembalikan objek metadata yang sesuai.
        </p>
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Demo: Dynamic Metadata & JSON-LD
          </h3>
          <p className="text-blue-700 mb-4">
            Klik tombol di bawah ini untuk melihat contoh halaman detail produk yang
            metadata-nya di-generate secara dinamis (termasuk tag OpenGraph untuk sosial media)
            berdasarkan ID produk, beserta penyematan <strong>JSON-LD Schema Markup</strong>.
          </p>
          <Link
            href="/seo/1"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            Lihat Produk Dinamis (ID: 1)
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">3. File-Based Metadata</h2>
        <p className="mb-4 text-gray-700">
          Next.js juga mendukung file khusus untuk optimasi SEO:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <a
              href="/sitemap.xml"
              target="_blank"
              className="text-blue-600 hover:underline font-medium"
            >
              sitemap.xml
            </a>{" "}
            - Dihasilkan dari file <code>sitemap.ts</code> untuk membantu mesin pencari mengindeks
            halaman Anda.
          </li>
          <li>
            <a
              href="/robots.txt"
              target="_blank"
              className="text-blue-600 hover:underline font-medium"
            >
              robots.txt
            </a>{" "}
            - Dihasilkan dari file <code>robots.ts</code> untuk memberi instruksi kepada bot crawler.
          </li>
        </ul>
      </section>
    </main>
  );
}
