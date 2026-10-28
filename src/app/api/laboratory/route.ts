import { NextResponse } from 'next/server';
import { getLaboratoryCases, createLaboratoryCase } from '@/lib/supabase-db';
import { generateCaseNumber } from '@/lib/utils';

export async function GET() {
  try {
    const cases = await getLaboratoryCases();
    return NextResponse.json(cases);
  } catch (error) {
    console.error('GET laboratory cases error:', error);
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newCase = {
      ...body,
      id: Date.now().toString(),
      case_number: generateCaseNumber(),
      type: body.type || 'watch',
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const labCase = await createLaboratoryCase(newCase);

    return NextResponse.json(labCase, { status: 201 });
  } catch (error) {
    console.error('POST laboratory case error:', error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
