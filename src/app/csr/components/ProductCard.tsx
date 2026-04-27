import React from 'react';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-2 bg-white hover:shadow-md transition-shadow">
      <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.thumbnail} 
          alt={product.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 flex-grow">{product.description}</p>
      <p className="font-bold mt-auto text-blue-600">${product.price.toFixed(2)}</p>
    </div>
  );
}
