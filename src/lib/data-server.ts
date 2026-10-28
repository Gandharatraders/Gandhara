import { Product } from '@/types';
import { getProducts, getFeaturedProducts, getProductBySlug, getProductsByCategory } from './supabase-db';

// Server-side function to get products (for server components)
export async function getProductsServer(): Promise<Product[]> {
  return await getProducts();
}

// Server-side function to get featured products (for server components)
export async function getFeaturedProductsServer(limit: number = 8): Promise<Product[]> {
  return await getFeaturedProducts(limit);
}

// Server-side function to get product by slug
export async function getProductBySlugServer(slug: string): Promise<Product | null> {
  const product = await getProductBySlug(slug);
  return product || null;
}

// Server-side function to get products by category
export async function getProductsByCategoryServer(category: string): Promise<Product[]> {
  return await getProductsByCategory(category);
}
