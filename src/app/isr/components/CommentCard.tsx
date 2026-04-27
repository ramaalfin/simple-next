import React from 'react';

export interface Comment {
  id: number;
  body: string;
  user: {
    username: string;
  };
}

interface CommentCardProps {
  comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
          {comment.user.username.charAt(0)}
        </div>
        <span className="text-sm font-semibold text-gray-700">@{comment.user.username}</span>
      </div>
      <p className="text-gray-600 italic leading-relaxed text-sm">"{comment.body}"</p>
    </div>
  );
}
