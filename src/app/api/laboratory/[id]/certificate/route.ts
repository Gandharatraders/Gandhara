import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateCertificateHTML } from '@/lib/certificate';

const DATA_FILE = path.join(process.cwd(), 'data', 'laboratory-cases.json');

async function getCases() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const cases = await getCases();
    const case_ = cases.find((c: any) => c.id === id);

    if (!case_) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const { type = 'watch', assessment } = body;

    const certificateData = {
      caseNumber: case_.caseNumber,
      type: type,
      details: {
        brand: case_.watchDetails?.brand || '',
        model: case_.watchDetails?.model || '',
        referenceNumber: case_.watchDetails?.referenceNumber,
        serialNumber: case_.watchDetails?.serialNumber,
        purchaseDate: case_.watchDetails?.purchaseDate,
        purchaseLocation: case_.watchDetails?.purchaseLocation,
        city: case_.watchDetails?.city,
        country: case_.watchDetails?.country,
        observations: case_.watchDetails?.observations,
      },
      assessment: {
        isAuthentic: assessment.isAuthentic,
        findings: assessment.findings,
        expertNotes: assessment.expertNotes,
      },
      issueDate: new Date().toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      productImage: case_.uploads?.find((u: any) => u.fileName.match(/\.(jpg|jpeg|png|webp)$/i))?.filePath,
    };

    const certificateHTML = generateCertificateHTML(certificateData);

    return new NextResponse(certificateHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="certificate-${case_.caseNumber}.html"`,
      },
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
