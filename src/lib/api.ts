import API from "./axios-client";

// products API calls
export const fetchProducts = async () => {
  const response = await API.get("/products");
  return response.data.products;
};

export const fetchProductById = async (id: string) => {
  const response = await API.get(`/products/${id}`);
  console.log("response", response);

  return response.data;
};

// Fetch products with simulated delay for streaming demo
export const fetchProductsWithDelay = async (delayMs: number = 2000) => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const response = await API.get("/products");
  return response.data.products;
};
