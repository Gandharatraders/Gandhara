import { NextResponse } from 'next/server';
import { updateReview, deleteReview } from '@/lib/supabase-db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedReview = {
      ...body,
      updated_at: new Date().toISOString()
    };

    const review = await updateReview(id, updatedReview);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('PUT review error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteReview(id);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('DELETE review error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
