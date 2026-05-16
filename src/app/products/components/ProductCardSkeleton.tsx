export function ProductCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-10" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
