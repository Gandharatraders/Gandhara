import { NextResponse } from 'next/server';
import { getReviews, getReviewsByProductId, createReview } from '@/lib/supabase-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const approvedOnly = searchParams.get('approvedOnly') === 'true';

    let reviews;
    if (productId) {
      reviews = await getReviewsByProductId(productId);
    } else {
      reviews = await getReviews();
      if (approvedOnly) {
        reviews = reviews.filter((r: any) => r.approved === true);
      }
    }

    // Sort by created_at descending and limit to 5 reviews with 4+ stars
    const topReviews = reviews
      .filter((r: any) => r.rating >= 4)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return NextResponse.json(topReviews);
  } catch (error) {
    console.error('GET reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newReview = {
      ...body,
      id: Date.now().toString(),
      approved: false, // Requires admin approval
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const review = await createReview(newReview);

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('POST review error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
