import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/supabase-db';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newProduct = {
      ...body,
      id: Date.now().toString(),
      featured: body.featured || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const product = await createProduct(newProduct);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
