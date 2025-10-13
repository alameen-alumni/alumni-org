import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Minimal helper: embed template and draw three text lines at fixed positions per page.
export type IdCardLayoutOptions = {
  width?: number;
  height?: number;
  nameFontSize?: number;
  idFontSize?: number;
  batchFontSize?: number;
  nameX?: number;
  nameY?: number;
  idX?: number;
  idY?: number;
  batchX?: number;
  batchY?: number;
  nameColor?: [number, number, number];
  idColor?: [number, number, number];
  batchColor?: [number, number, number];
};

export async function createMultiIdCardPdfBlob(
  templateUrl: string,
  items: Array<{ name: string; idText: string; batchText: string }>,
  options?: IdCardLayoutOptions
): Promise<Blob> {
  const res = await fetch(templateUrl);
  if (!res.ok) throw new Error(`Failed to fetch template: ${res.status}`);
  const buf = await res.arrayBuffer();

  const pdfDoc = await PDFDocument.create();
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const isPng = contentType.includes('png') || /\.png(\?|$)/i.test(templateUrl);
  const img = isPng ? await pdfDoc.embedPng(buf) : await pdfDoc.embedJpg(buf);

  // Defaults match IdCardPreview component (requirements)
  const pageW = 853;
  const pageH = 1280;
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Use preview defaults
  const nameSize = 40; // Default size for short names
  const idSizeDefault = 24;

  const nameYDefault = 1165;
  const idYDefault = 119;

  // Function to calculate name size based on length
  const calculateNameSize = (text: string) => {
    const length = text.length;
    return length < 12 ? nameSize : Math.max(20, Math.floor(nameSize * (12 / length)));
  };

  const nameColor = options?.nameColor ? rgb(...options.nameColor) : rgb(0, 0, 0);
  const idColor = options?.idColor ? rgb(...options.idColor) : rgb(0, 0, 0);

  for (const it of items) {
    const page = pdfDoc.addPage([pageW, pageH]);
    page.drawImage(img, { x: 0, y: 0, width: pageW, height: pageH });

    const combinedTextForSize = `${it.name || ''}${it.batchText ? ', ' + it.batchText : ''}`;
    const nameSize = calculateNameSize(it.name || '');
    const idSize = idSizeDefault;

    const nameY = nameYDefault;
    const idY = idYDefault;

    // Draw combined name and batch on one line, always centered like the CSS
    const nameText = it.name || '';
    const batchText = it.batchText || '';
    const combinedText = batchText ? `${nameText}, ${batchText}` : nameText;
    const textWidth = font.widthOfTextAtSize(combinedText, nameSize);
    const cx = Math.max(0, Math.round((pageW - textWidth) / 2));
    page.drawText(combinedText, {
      x: cx,
      y: nameY,
      size: nameSize,
      font,
      color: nameColor
    });

    // Draw ID text, always centered with letter spacing like the CSS
    const idTextWithSpacing = (it.idText || ''); // Match CSS letterSpacing: "2px"
    const idWidth = font.widthOfTextAtSize(idTextWithSpacing, idSize);
    const ix = Math.max(0, Math.round((pageW - idWidth) / 2));
    page.drawText(idTextWithSpacing, {
      x: ix,
      y: idY,
      size: idSize,
      font,
      color: idColor
    });
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: 'application/pdf' });
}

// Convenience single-page wrapper
export async function createIdCardPdfBlob(templateUrl: string, name: string, idText: string, batchText: string): Promise<Blob> {
  return createMultiIdCardPdfBlob(templateUrl, [{ name, idText, batchText }]);
}
