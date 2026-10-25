import { Product } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// Server-side function to read products from JSON file (cached)
export async function readProductsFile(): Promise<Product[]> {
  'use cache';
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

// Server-side function to get products (for server components)
export async function getProductsServer(): Promise<Product[]> {
  return await readProductsFile();
}

// Server-side function to get featured products (for server components)
export async function getFeaturedProductsServer(limit: number = 8): Promise<Product[]> {
  'use cache';
  const products = await readProductsFile();
  return products.filter(product => product.featured).slice(0, limit);
}

// Server-side function to get product by slug
export async function getProductBySlugServer(slug: string): Promise<Product | null> {
  'use cache';
  const products = await readProductsFile();
  return products.find(product => product.slug === slug) || null;
}

// Server-side function to get products by category
export async function getProductsByCategoryServer(category: string): Promise<Product[]> {
  'use cache';
  const products = await readProductsFile();
  return products.filter(p => p.category === category);
}
