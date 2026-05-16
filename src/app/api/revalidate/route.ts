import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");

  if (!tag) {
    return Response.json({ message: "Missing tag" }, { status: 400 });
  }

  // Menggunakan API terbaru revalidateTag(tag, profile)
  // 'max' adalah profile default untuk menghapus cache secara instan/stale
  // Atau bisa menggunakan { expire: 0 } untuk benar-benar menghapus sekarang
  revalidateTag(tag, { expire: 0 });

  return Response.json({ 
    revalidated: true, 
    tag,
    now: Date.now() 
  });
}

// Untuk POST sesuai contoh user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag, secret } = body;

    if (secret !== process.env.REVALIDATION_SECRET) {
      return Response.json({ message: "Invalid secret" }, { status: 401 });
    }

    revalidateTag(tag, { expire: 0 });

    return Response.json({ revalidated: true, tag });
  } catch (err) {
    return Response.json({ message: "Error revalidating" }, { status: 500 });
  }
}
