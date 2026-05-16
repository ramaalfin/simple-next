"use client";

import { useEffect, useState, useCallback } from "react";

interface InventoryData {
  stock: number;
  availabilityStatus: string;
}

interface InventoryBadgeProps {
  productId: number;
}

// Polls the inventory API every 15 seconds for real-time stock updates
export function InventoryBadge({ productId }: InventoryBadgeProps) {
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/inventory?id=${productId}`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data: InventoryData = await res.json();
      setInventory(data);
      setLastUpdated(new Date());
    } catch {
      // Keep showing last known state on error
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchInventory();
    // Poll every 15 seconds for real-time updates
    const interval = setInterval(fetchInventory, 15_000);
    return () => clearInterval(interval);
  }, [fetchInventory]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!inventory) return null;

  const isInStock = inventory.stock > 0;
  const isLowStock = inventory.stock > 0 && inventory.stock <= 10;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {/* Live indicator dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isInStock ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isInStock ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </span>

        <span
          className={`text-sm font-semibold ${
            isInStock
              ? isLowStock
                ? "text-amber-600"
                : "text-green-600"
              : "text-red-600"
          }`}
        >
          {inventory.availabilityStatus}
        </span>

        {isInStock && (
          <span className="text-sm text-gray-500">
            ({inventory.stock} left)
          </span>
        )}
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-400">
          Live · Updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
