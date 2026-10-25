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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const approvedOnly = searchParams.get('approvedOnly') === 'true';

    const reviews = await getReviews();
    let filteredReviews = productId
      ? reviews.filter((r: any) => r.productId === productId)
      : reviews;

    if (approvedOnly) {
      filteredReviews = filteredReviews.filter((r: any) => r.approved === true);
    }

    // Sort by createdAt descending and limit to 5 reviews with 4+ stars
    const topReviews = filteredReviews
      .filter((r: any) => r.rating >= 4)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json(topReviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reviews = await getReviews();

    const newReview = {
      ...body,
      id: Date.now().toString(),
      approved: false, // Requires admin approval
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    await saveReviews(reviews);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
