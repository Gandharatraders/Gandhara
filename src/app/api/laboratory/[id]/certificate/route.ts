import { NextResponse } from 'next/server';
import { getLaboratoryCaseById } from '@/lib/supabase-db';
import { generateCertificateHTML } from '@/lib/certificate';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const labCase = await getLaboratoryCaseById(id);

    if (!labCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const { type = 'watch', assessment } = body;

    const certificateData = {
      caseNumber: labCase.case_number,
      type: type,
      details: {
        brand: labCase.watch_details?.brand || '',
        model: labCase.watch_details?.model || '',
        referenceNumber: labCase.watch_details?.referenceNumber,
        serialNumber: labCase.watch_details?.serialNumber,
        purchaseDate: labCase.watch_details?.purchaseDate,
        purchaseLocation: labCase.watch_details?.purchaseLocation,
        city: labCase.watch_details?.city,
        country: labCase.watch_details?.country,
        observations: labCase.watch_details?.observations,
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
        'Content-Disposition': `attachment; filename="certificate-${labCase.case_number}.html"`,
      },
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
