import { NextResponse } from 'next/server';
import { updateMessage, deleteMessage } from '@/lib/supabase-db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedMessage = {
      ...body,
      updated_at: new Date().toISOString()
    };

    const message = await updateMessage(id, updatedMessage);

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('PUT message error:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMessage(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE message error:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
