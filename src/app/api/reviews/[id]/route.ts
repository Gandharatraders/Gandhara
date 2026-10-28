import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'reviews.json');

// Helper function to read reviews
async function getReviews() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write reviews
async function saveReviews(reviews: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(reviews, null, 2));
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const reviews = await getReviews();
    const index = reviews.findIndex((r: any) => r.id === resolvedParams.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    reviews[index] = {
      ...reviews[index],
      ...body,
      updatedAt: new Date().toISOString()
    };

    await saveReviews(reviews);

    return NextResponse.json(reviews[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const reviews = await getReviews();
    const index = reviews.findIndex((r: any) => r.id === resolvedParams.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    reviews.splice(index, 1);
    await saveReviews(reviews);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
