import React, { Suspense } from 'react';
import { RecipeCard, type Recipe } from './components/RecipeCard';

export const metadata = {
  title: 'Static Site Generation (SSG) | DummyJSON Recipes',
  description: 'A page demonstrating Static Site Generation by fetching data at build time.',
};

async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch('https://dummyjson.com/recipes?limit=12');
  
  if (!res.ok) {
    throw new Error('Failed to fetch recipes');
  }
  
  const data = await res.json();
  return data.recipes;
}

async function RecipeList() {
  const recipes = await getRecipes();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

export default function SSGPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          Static Site Generation (SSG)
        </h1>
        <p className="text-lg text-gray-600">
          Halaman ini menggunakan Static Site Generation. Daftar resep di bawah ini 
          diambil dari <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-pink-600 font-mono">https://dummyjson.com/recipes</code> <strong>saat proses build dijalankan</strong>.
        </p>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm">
          <strong>Info:</strong> Halaman ini bersifat statis. Jika data di API berubah, tampilan ini tidak akan berubah sampai Anda menjalankan perintah <code>npm run build</code> kembali.
        </div>
      </div>
      
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl h-64 bg-gray-50 animate-pulse" />
          ))}
        </div>
      }>
        <RecipeList />
      </Suspense>
    </main>
  );
}
