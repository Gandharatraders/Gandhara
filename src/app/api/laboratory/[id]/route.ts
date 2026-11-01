import { NextResponse } from 'next/server';
import { getLaboratoryCaseById, updateLaboratoryCase } from '@/lib/supabase-db';

// Helper to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      newObj[camelKey] = toCamelCase(obj[key]);
    }
    return newObj;
  }
  return obj;
}

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

    return NextResponse.json(toCamelCase(labCase));
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

    return NextResponse.json(toCamelCase(labCase));
  } catch (error) {
    console.error('GET laboratory case error:', error);
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 });
  }
}
