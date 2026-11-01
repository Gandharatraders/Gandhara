import { NextResponse } from 'next/server';
import { getLaboratoryCases, createLaboratoryCase } from '@/lib/supabase-db';
import { generateCaseNumber } from '@/lib/utils';

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

export async function GET() {
  try {
    const cases = await getLaboratoryCases();
    return NextResponse.json(toCamelCase(cases));
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

    return NextResponse.json(toCamelCase(labCase), { status: 201 });
  } catch (error) {
    console.error('POST laboratory case error:', error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
