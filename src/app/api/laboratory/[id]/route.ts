import { NextResponse } from 'next/server';
import { getLaboratoryCaseById, updateLaboratoryCase } from '@/lib/supabase-db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const updatedCase = {
      status: body.status,
      assessment: body.assessment,
      updated_at: new Date().toISOString(),
    };

    const labCase = await updateLaboratoryCase(id, updatedCase);

    if (!labCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json(labCase);
  } catch (error) {
    console.error('PUT laboratory case error:', error);
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const labCase = await getLaboratoryCaseById(id);

    if (!labCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json(labCase);
  } catch (error) {
    console.error('GET laboratory case error:', error);
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 });
  }
}
