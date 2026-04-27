import React from 'react';

export interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  difficulty: string;
  rating: number;
  image: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col">
      <div className="h-48 overflow-hidden relative bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={recipe.image} 
          alt={recipe.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold text-orange-600">
          ★ {recipe.rating}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 grow">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{recipe.name}</h3>
        <div className="flex gap-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-medium">
            {recipe.cuisine}
          </span>
          <span className="text-xs bg-orange-50 px-2 py-1 rounded-full text-orange-600 font-medium">
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
