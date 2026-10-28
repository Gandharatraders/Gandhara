import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// Helper function to read products
async function getProducts() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write products
async function saveProducts(products: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = await getProducts();
    const product = products.find((p: any) => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
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
    const { id } = await params;
    const body = await request.json();
    const products = await getProducts();
    const index = products.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products[index] = {
      ...products[index],
      ...body,
      id: id,
      updatedAt: new Date().toISOString()
    };

    await saveProducts(products);

    return NextResponse.json(products[index]);
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = await getProducts();
    const index = products.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products.splice(index, 1);
    await saveProducts(products);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
