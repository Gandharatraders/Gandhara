import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET product error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== PUT product request ===');
    const { id } = await params;
    console.log('Product ID:', id);
    
    const body = await request.json();
    console.log('Update data received:', JSON.stringify(body, null, 2));

    const updatedProduct = {
      ...body,
      updated_at: new Date().toISOString()
    };

    console.log('Product to update:', JSON.stringify(updatedProduct, null, 2));

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updatedProduct)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    if (!data) {
      console.error('Product not found after update');
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log('Product updated successfully:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT product error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
