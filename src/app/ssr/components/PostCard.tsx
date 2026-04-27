import React from "react";

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  views: number;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-3 bg-white hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-xl text-gray-800 line-clamp-1">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-3 grow">{post.body}</p>

      <div className="flex flex-wrap gap-2 mt-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400 font-medium">
          {post.views} views
        </span>
      </div>
    </div>
  );
}
