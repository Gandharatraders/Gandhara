import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/supabase-db';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newOrder = {
      ...body,
      id: Date.now().toString(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const order = await createOrder(newOrder);
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('POST order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
