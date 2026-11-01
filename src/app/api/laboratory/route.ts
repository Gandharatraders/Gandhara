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

// Helper to convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      newObj[snakeKey] = toSnakeCase(obj[key]);
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
      ...toSnakeCase(body),
      id: Date.now().toString(),
      case_number: generateCaseNumber(),
      type: body.type || 'watch',
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating laboratory case:', JSON.stringify(newCase, null, 2));

    const labCase = await createLaboratoryCase(newCase);

    console.log('Laboratory case created successfully:', labCase);

    return NextResponse.json(toCamelCase(labCase), { status: 201 });
  } catch (error) {
    console.error('POST laboratory case error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to create case', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
