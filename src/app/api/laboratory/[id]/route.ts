import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'laboratory-cases.json');

async function getCases() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

async function saveCases(cases: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(cases, null, 2));
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const cases = await getCases();
    const caseIndex = cases.findIndex((c: any) => c.id === id);

    if (caseIndex === -1) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    cases[caseIndex] = {
      ...cases[caseIndex],
      status: body.status,
      assessment: body.assessment,
      updatedAt: new Date().toISOString(),
    };

    await saveCases(cases);

    return NextResponse.json(cases[caseIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const cases = await getCases();
    const case_ = cases.find((c: any) => c.id === id);

    if (!case_) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json(case_);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 });
  }
}
