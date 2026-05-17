import type { Review } from "../types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);

  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="font-semibold text-gray-800 text-sm">
            {review.reviewerName}
          </p>
          <p className="text-xs text-gray-400">{review.reviewerEmail}</p>
        </div>
        <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
          {stars.map((filled, i) => (
            <span
              key={i}
              className={filled ? "text-amber-400" : "text-gray-300"}
              aria-hidden="true"
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600">{review.comment}</p>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(review.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
