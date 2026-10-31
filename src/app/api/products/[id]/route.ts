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
  console.log('=== PUT START ===');
  
  try {
    console.log('=== PUT product request ===');
    const { id } = await params;
    console.log('Product ID:', id);
    
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Failed to parse JSON body:', error);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    console.log('Update data received:', JSON.stringify(body, null, 2));

    // Convert data types properly
    const updatedProduct: any = {
      updated_at: new Date().toISOString()
    };

    // Only include fields that are provided
    if (body.name !== undefined) updatedProduct.name = body.name;
    if (body.sku !== undefined) updatedProduct.sku = body.sku;
    if (body.slug !== undefined) updatedProduct.slug = body.slug;
    if (body.category !== undefined) updatedProduct.category = body.category;
    if (body.brand !== undefined) updatedProduct.brand = body.brand;
    if (body.price !== undefined) updatedProduct.price = parseFloat(body.price) || 0;
    if (body.salePrice !== undefined) updatedProduct.salePrice = body.salePrice ? parseFloat(body.salePrice) : null;
    if (body.stockQuantity !== undefined) updatedProduct.stockQuantity = parseInt(body.stockQuantity) || 0;
    if (body.availability !== undefined) updatedProduct.availability = body.availability;
    if (body.status !== undefined) updatedProduct.status = body.status;
    if (body.featured !== undefined) updatedProduct.featured = body.featured;
    if (body.shortDescription !== undefined) updatedProduct.shortDescription = body.shortDescription;
    if (body.fullDescription !== undefined) updatedProduct.fullDescription = body.fullDescription;
    if (body.colors !== undefined) {
      updatedProduct.colors = typeof body.colors === 'string' 
        ? body.colors.split(',').map((c: string) => c.trim())
        : body.colors;
    }
    if (body.strapTypes !== undefined) {
      updatedProduct.strapTypes = typeof body.strapTypes === 'string'
        ? body.strapTypes.split(',').map((c: string) => c.trim())
        : body.strapTypes;
    }
    if (body.specifications !== undefined) {
      try {
        updatedProduct.specifications = typeof body.specifications === 'string'
          ? JSON.parse(body.specifications)
          : body.specifications;
      } catch (e) {
        console.error('Failed to parse specifications:', e);
        updatedProduct.specifications = {};
      }
    }
    if (body.shippingInfo !== undefined) updatedProduct.shippingInfo = body.shippingInfo;
    if (body.returnInfo !== undefined) updatedProduct.returnInfo = body.returnInfo;
    if (body.careInfo !== undefined) updatedProduct.careInfo = body.careInfo;
    if (body.images !== undefined) updatedProduct.images = body.images;
    if (body.video !== undefined) updatedProduct.video = body.video;

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
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
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
    return NextResponse.json({ 
      error: 'Failed to update product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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
