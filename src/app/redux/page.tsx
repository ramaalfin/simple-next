import React from 'react';

export const metadata = {
  title: 'Redux Toolkit (RTK) Dasar & Advanced',
  description: 'Materi tentang Redux Toolkit (RTK) Dasar, Slice, Action, dan CRUD di Next.js',
};

export default function ReduxPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          Materi: Redux Toolkit (RTK) Dasar & Advanced
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Dokumen ini menjelaskan konsep inti Redux Toolkit serta pola lanjutan untuk penanganan data CRUD (Create, Read, Update, Delete).
        </p>
      </div>

      {/* SECTION 1: CORE CONCEPTS */}
      <section className="mb-12">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 text-left">1. Konsep Inti: Slice, Action, dan Type</h2>
          <p className="text-blue-800 mb-4 leading-relaxed text-left">
            Redux Toolkit menyederhanakan cara kita menulis logika state dengan menggabungkan Action, Type, dan Reducer ke dalam satu wadah bernama <strong>Slice</strong>.
          </p>
          <ul className="list-disc list-inside text-blue-800 space-y-2 text-left">
            <li><strong>Slice</strong>: Sekumpulan logika reducer untuk satu fitur (misal: user, cart, products).</li>
            <li><strong>Action</strong>: Objek yang memberitahu store "apa yang harus dilakukan".</li>
            <li><strong>Type</strong>: String unik (ID) dari action tersebut.</li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-left">Contoh Slice Sederhana:</h3>
        <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-lg mb-6">
{`import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart', // Nama slice (prefix untuk Type)
  initialState: { items: [] },
  reducers: {
    // 'addItem' otomatis menjadi Action Creator
    // RTK membuat Type: 'cart/addItem'
    addItem: (state, action: PayloadAction<any>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;`}
        </pre>
      </section>

      {/* SECTION 2: ASYNC THUNK (CRUD) */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">2. CRUD dengan Async Thunk (Pola Tradisional)</h2>
        <p className="text-gray-700 mb-6 leading-relaxed text-left">
          Gunakan <code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded font-mono">createAsyncThunk</code> jika Anda ingin mengelola state global (seperti loading, data, error) secara manual di dalam slice.
        </p>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h4 className="font-bold text-gray-800 mb-2 text-left">Contoh Operasi CRUD:</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`// READ ALL
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const res = await axios.get('https://dummyjson.com/products');
  return res.data.products;
});

// CREATE
export const addProduct = createAsyncThunk('products/add', async (newData) => {
  const res = await axios.post('https://dummyjson.com/products/add', newData);
  return res.data;
});

// DELETE
export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await axios.delete(\`https://dummyjson.com/products/\${id}\`);
  return id;
});`}
            </pre>
          </div>
        </div>
      </section>

      {/* SECTION 3: RTK QUERY (CRUD) */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">3. CRUD dengan RTK Query (Pola Modern & Advanced)</h2>
        <p className="text-gray-700 mb-6 leading-relaxed text-left">
          RTK Query adalah cara tercanggih untuk menangani CRUD. Anda tidak perlu membuat slice manual untuk data API; RTK Query menangani <em>loading state</em>, <em>error</em>, dan <em>caching</em> secara otomatis.
        </p>

        <div className="bg-gray-900 text-gray-100 p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-orange-400 font-bold mb-4 text-left font-mono">// productsApi.ts (RTK Query CRUD)</h3>
          <pre className="text-sm font-mono overflow-x-auto">
{`export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    // READ (Query)
    getProducts: builder.query({
      query: () => 'products',
      providesTags: ['Products'],
    }),
    // CREATE (Mutation)
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: 'products/add',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Products'], // Auto-refresh daftar produk
    }),
    // DELETE (Mutation)
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: \`products/\${id}\`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border border-green-200 bg-green-50 rounded-xl text-left">
            <h4 className="font-bold text-green-800 mb-2">Mengapa Pakai Mutation?</h4>
            <p className="text-green-700 text-sm leading-relaxed">
              Mutation digunakan untuk operasi yang mengubah data di server (POST, PUT, DELETE). RTK Query memberikan hook seperti <code>useCreateProductMutation()</code> yang mengembalikan fungsi trigger dan status loading secara instan.
            </p>
          </div>
          <div className="p-5 border border-purple-200 bg-purple-50 rounded-xl text-left">
            <h4 className="font-bold text-purple-800 mb-2">Otomatisasi Tags</h4>
            <p className="text-purple-700 text-sm leading-relaxed">
              Dengan <code>providesTags</code> dan <code>invalidatesTags</code>, Anda tidak perlu memanggil fungsi fetch lagi setelah menghapus data. UI akan otomatis diperbarui sendiri!
            </p>
          </div>
        </div>
      </section>

      {/* SUMMARY TABLE */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2 text-left">Ringkasan CRUD Implementation</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-800">
                <th className="p-4 border-b border-gray-200 font-semibold">Fitur</th>
                <th className="p-4 border-b border-gray-200 font-semibold">Async Thunk</th>
                <th className="p-4 border-b border-gray-200 font-semibold">RTK Query</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Read (Fetch)</td>
                <td className="p-4 text-gray-600 italic">Disimpan di extraReducers</td>
                <td className="p-4 text-green-600 font-medium">Query Hook otomatis</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Create/Update/Delete</td>
                <td className="p-4 text-gray-600 italic">Manual update state</td>
                <td className="p-4 text-green-600 font-medium">Mutation + Auto Tags Revalidation</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Loading State</td>
                <td className="p-4 text-gray-600 italic">Dikelola manual (state.loading)</td>
                <td className="p-4 text-green-600 font-medium">Tersedia di hook (isLoading, isSuccess)</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Kompleksitas Kode</td>
                <td className="p-4 text-gray-600 italic">Lebih banyak Boilerplate</td>
                <td className="p-4 text-blue-600 font-semibold">Sangat Ringkas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
