import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateCaseNumber } from '@/lib/utils';

const DATA_FILE = path.join(process.cwd(), 'data', 'laboratory-cases.json');

// Helper function to read cases
async function getCases() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write cases
async function saveCases(cases: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(cases, null, 2));
}

export async function GET() {
  try {
    const cases = await getCases();
    return NextResponse.json(cases);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cases = await getCases();

    const newCase = {
      ...body,
      id: Date.now().toString(),
      caseNumber: generateCaseNumber(),
      type: body.type || 'watch',
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    cases.push(newCase);
    await saveCases(cases);

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
