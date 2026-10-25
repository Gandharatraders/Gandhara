import { ProductSpecifications } from '@/types';

export interface CertificateData {
  caseNumber: string;
  type: 'watch' | 'gemstone';
  details: {
    brand: string;
    model: string;
    referenceNumber?: string;
    serialNumber?: string;
    purchaseDate?: string;
    purchaseLocation?: string;
    city?: string;
    country?: string;
    observations?: string;
  };
  assessment: {
    isAuthentic: boolean;
    findings: string;
    expertNotes: string;
  };
  issueDate: string;
  productImage?: string;
}

export function generateCertificateHTML(data: CertificateData): string {
  const statusColor = data.assessment.isAuthentic ? '#22c55e' : '#ef4444';
  const statusText = data.assessment.isAuthentic ? 'AUTHENTIC' : 'NOT AUTHENTIC';
  const icon = data.assessment.isAuthentic ? '✓' : '✗';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&display=swap');

    body {
      margin: 0;
      padding: 10px;
      font-family: 'Crimson Text', serif;
      background: #0a0a0a;
    }

    .certificate {
      max-width: 900px;
      margin: 0 auto;
      background: #050505;
      padding: 25px 35px;
      border: 3px solid #C7CBD0;
      box-shadow: 0 0 0 1px #292929, 0 0 0 2px #C7CBD0;
      position: relative;
    }

    .certificate::before {
      content: '';
      position: absolute;
      top: 8px;
      left: 8px;
      right: 8px;
      bottom: 8px;
      border: 1px double #C7CBD0;
      pointer-events: none;
    }

    .certificate::after {
      content: '';
      position: absolute;
      top: 15px;
      left: 15px;
      right: 15px;
      bottom: 15px;
      border: 1px solid #292929;
      pointer-events: none;
    }

    .corner-ornament {
      position: absolute;
      width: 30px;
      height: 30px;
      border: 2px solid #E50920;
    }

    .corner-ornament.top-left {
      top: 12px;
      left: 12px;
      border-right: none;
      border-bottom: none;
    }

    .corner-ornament.top-right {
      top: 12px;
      right: 12px;
      border-left: none;
      border-bottom: none;
    }

    .corner-ornament.bottom-left {
      bottom: 12px;
      left: 12px;
      border-right: none;
      border-top: none;
    }

    .corner-ornament.bottom-right {
      bottom: 12px;
      right: 12px;
      border-left: none;
      border-top: none;
    }

    .header {
      text-align: center;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid #292929;
      position: relative;
    }

    .header::before,
    .header::after {
      content: '❧';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: #E50920;
      font-size: 16px;
    }

    .header::before {
      left: 0;
    }

    .header::after {
      right: 0;
      transform: translateY(-50%) rotate(180deg);
    }

    .logo-img {
      max-width: 220px;
      height: auto;
      margin-bottom: 12px;
    }

    .certificate-title {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      color: #F5F5F5;
      margin: 0 0 6px 0;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    .certificate-subtitle {
      text-align: center;
      font-size: 11px;
      color: #C7CBD0;
      margin-bottom: 0;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 400;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin: 20px 0;
    }

    .section {
      margin: 0;
    }

    .section-title {
      font-size: 10px;
      color: #E50920;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 12px;
      border-bottom: 1px solid #292929;
      padding-bottom: 5px;
      font-weight: 700;
      font-family: 'Playfair Display', serif;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: 9px;
      color: #A6A6A6;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2px;
      font-weight: 600;
    }

    .value {
      font-size: 11px;
      color: #F5F5F5;
      font-weight: 400;
    }

    .product-image {
      width: 100%;
      max-width: 300px;
      height: auto;
      border: 2px solid #292929;
      margin: 0 auto;
      display: block;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    .status-box {
      background: #101010;
      border: 1px solid #292929;
      padding: 10px;
      text-align: center;
      margin: 15px 0;
      position: relative;
    }

    .status-icon {
      font-size: 28px;
      color: ${statusColor};
      margin-bottom: 4px;
    }

    .status-text {
      font-size: 14px;
      font-weight: 700;
      color: #F5F5F5;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-family: 'Playfair Display', serif;
    }

    .findings {
      background: #101010;
      padding: 10px;
      border: 1px solid #292929;
      margin: 12px 0;
    }

    .findings-title {
      font-weight: 700;
      color: #F5F5F5;
      margin-bottom: 6px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-family: 'Playfair Display', serif;
    }

    .findings-text {
      color: #A6A6A6;
      line-height: 1.5;
      font-size: 11px;
    }

    .tracking-box {
      background: #101010;
      color: #F5F5F5;
      padding: 10px;
      text-align: center;
      margin: 18px 0 30px 0;
      border: 1px solid #292929;
    }

    .tracking-label {
      font-size: 9px;
      color: #A6A6A6;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 4px;
    }

    .tracking-number {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #E50920;
      margin-bottom: 4px;
      font-family: 'Playfair Display', serif;
    }

    .footer {
      margin-top: 20px;
      padding-top: 18px;
      border-top: 1px solid #292929;
      text-align: center;
      font-size: 9px;
      color: #A6A6A6;
    }

    .contact-info {
      margin-top: 8px;
      color: #C7CBD0;
    }

    .signature-section {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .signature-box {
      text-align: center;
    }

    .signature-line {
      border-top: 1px solid #292929;
      margin-top: 30px;
      padding-top: 6px;
      font-style: italic;
      color: #A6A6A6;
      font-size: 10px;
    }

    .date-box {
      text-align: right;
    }

    .date-label {
      font-size: 9px;
      color: #A6A6A6;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 3px;
    }

    .date-value {
      font-size: 11px;
      color: #F5F5F5;
      font-weight: 600;
    }



    @media print {
      body {
        background: #050505;
        padding: 0;
      }
      .certificate {
        box-shadow: none;
        border: 3px solid #C7CBD0;
        page-break-inside: avoid;
        width: 100%;
        max-width: 100%;
        padding: 20px 30px;
      }
      .certificate::before {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="corner-ornament top-left"></div>
    <div class="corner-ornament top-right"></div>
    <div class="corner-ornament bottom-left"></div>
    <div class="corner-ornament bottom-right"></div>

    <div class="header">
      <img src="/logo.png" alt="Gandhara Traders Company" class="logo-img" />
      <div class="certificate-title">
        Certificate of Authenticity
      </div>
      <div class="certificate-subtitle">
        ${data.type === 'watch' ? 'Watch Verification & Authentication' : 'Gemstone Verification & Authentication'}
      </div>
    </div>

    <div class="content-grid">
      <div>
        <div class="section">
          <div class="section-title">Certificate Information</div>
          <div class="info-grid">
            <div class="info-item"></div>
            <div class="info-item">
              <div class="label">Certificate Number</div>
              <div class="value">${data.caseNumber}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">${data.type === 'watch' ? 'Watch Details' : 'Gemstone Details'}</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Brand</div>
              <div class="value">${data.details.brand || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">Model</div>
              <div class="value">${data.details.model || 'N/A'}</div>
            </div>
            ${data.details.referenceNumber ? `
            <div class="info-item">
              <div class="label">Reference Number</div>
              <div class="value">${data.details.referenceNumber}</div>
            </div>
            ` : ''}
            ${data.details.serialNumber ? `
            <div class="info-item">
              <div class="label">Serial Number</div>
              <div class="value">${data.details.serialNumber}</div>
            </div>
            ` : ''}
            ${data.details.city ? `
            <div class="info-item">
              <div class="label">City</div>
              <div class="value">${data.details.city}</div>
            </div>
            ` : ''}
            ${data.details.country ? `
            <div class="info-item">
              <div class="label">Country</div>
              <div class="value">${data.details.country}</div>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="status-box">
          <div class="status-icon">${icon}</div>
          <div class="status-text">${statusText}</div>
        </div>
      </div>

      <div>
        <div class="section">
          <div class="section-title">Product Image</div>
          ${data.productImage ? `
            <img src="${data.productImage}" alt="Product" class="product-image" />
          ` : `
            <div style="text-align: center; padding: 40px 20px; background: #101010; border: 1px dashed #292929;">
              <div style="color: #A6A6A6; font-size: 10px;">No product image available</div>
            </div>
          `}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Assessment Findings</div>
      <div class="findings">
        <div class="findings-title">Expert Assessment</div>
        <div class="findings-text">${data.assessment.findings || 'No detailed findings provided.'}</div>
      </div>
      ${data.assessment.expertNotes ? `
      <div class="findings">
        <div class="findings-title">Additional Notes</div>
        <div class="findings-text">${data.assessment.expertNotes}</div>
      </div>
      ` : ''}
    </div>

    <div class="tracking-box">
      <div class="tracking-label">Certificate Verification</div>
      <div class="tracking-number">${data.caseNumber}</div>
      <div style="font-size: 10px; margin-top: 10px; color: #A6A6A6;">
        Visit crownixcollection.com/track-case to verify authenticity
      </div>
    </div>

    <div class="footer">
      <div style="color: #F5F5F5;">This certificate is issued by Gandhara Traders Company Pakistan</div>
      <div class="contact-info">
        Email: gandharatraderscompany@gmail.com | Phone: +92 315 945 2946
      </div>
      <div style="margin-top: 12px; font-size: 10px; color: #666;">
        This certificate is valid only for the specific item described above. Any alteration or modification may invalidate this certificate.
      </div>
    </div>

    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-line">
          Authorized Signature
        </div>
      </div>
      <div class="date-box">
        <div class="date-label">Date of Issue</div>
        <div class="date-value">${data.issueDate}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
