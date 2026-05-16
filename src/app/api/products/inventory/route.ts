// Inventory API route — real-time stock data
// Called by the InventoryBadge client component every 15 seconds.
// No caching — always returns fresh data.

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
        return NextResponse.json(
            { error: "Missing or invalid product id" },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        const product = await res.json();

        return NextResponse.json(
            {
                stock: product.stock,
                availabilityStatus: product.availabilityStatus,
            },
            {
                headers: {
                    // No CDN caching — inventory must be fresh
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch inventory" },
            { status: 500 }
        );
    }
}
