import Link from "next/link";
import type { Category } from "../types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Capitalize and format the category name for display
  const displayName =
    category.name ||
    category.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <Link
      href={`/products/category/${category.slug}`}
      className="group block border border-gray-200 rounded-xl p-5 bg-white hover:border-blue-400 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {displayName}
        </h3>
        <span className="text-gray-400 group-hover:text-blue-400 transition-colors text-lg">
          →
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1 font-mono">{category.slug}</p>
    </Link>
  );
}
