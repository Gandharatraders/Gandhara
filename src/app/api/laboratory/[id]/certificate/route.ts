import { NextResponse } from 'next/server';
import { getLaboratoryCaseById } from '@/lib/supabase-db';
import { generateCertificateHTML } from '@/lib/certificate';

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const labCase = toCamelCase(await getLaboratoryCaseById(id));

    if (!labCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const { type = 'watch', assessment } = body;

    const certificateData = {
      caseNumber: labCase.caseNumber,
      type: type,
      details: {
        brand: labCase.watchDetails?.brand || '',
        model: labCase.watchDetails?.model || '',
        referenceNumber: labCase.watchDetails?.referenceNumber,
        serialNumber: labCase.watchDetails?.serialNumber,
        purchaseDate: labCase.watchDetails?.purchaseDate,
        purchaseLocation: labCase.watchDetails?.purchaseLocation,
        city: labCase.watchDetails?.city,
        country: labCase.watchDetails?.country,
        observations: labCase.watchDetails?.observations,
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
      productImage: labCase.uploads?.find((u: any) => u.fileName.match(/\.(jpg|jpeg|png|webp)$/i))?.filePath,
    };

    const certificateHTML = generateCertificateHTML(certificateData);

    return new NextResponse(certificateHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="certificate-${labCase.caseNumber}.html"`,
      },
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
