import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('=== POST product request ===');
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
    
    const body = await request.json();
    console.log('Product data received:', JSON.stringify(body, null, 2));
    
    const newProduct = {
      ...body,
      id: Date.now().toString(),
      featured: body.featured || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Product to insert:', JSON.stringify(newProduct, null, 2));
    
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
    
    console.log('Product created successfully:', data);
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST product error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
