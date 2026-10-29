import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/supabase-db';
import { supabaseAdmin } from '@/lib/supabase';

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
    
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
