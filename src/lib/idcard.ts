import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Create a single-page PDF blob with template image as background and text overlay.
 * - templateUrl: public path or https url to the template image (png/jpg)
 * - name: user name to render
 * - idText: serial/id text to render
 * - batchText: batch text to render
 */
export async function createIdCardPdfBlob(
  templateUrl: string,
  name: string,
  idText: string,
  batchText: string,
  options?: {
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
  }
): Promise<Blob> {
  const res = await fetch(templateUrl);
  if (!res.ok) throw new Error(`Failed to fetch template: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();

  const pdfDoc = await PDFDocument.create();

  const contentType = res.headers.get('content-type') || '';
  const isPng = contentType.includes('png') || /\.png(\?|$)/i.test(templateUrl);

  const embeddedImage = isPng
    ? await pdfDoc.embedPng(arrayBuffer)
    : await pdfDoc.embedJpg(arrayBuffer);

  const imgWidth = embeddedImage.width;
  const imgHeight = embeddedImage.height;

  const pageWidth = options?.width ?? imgWidth;
  const pageHeight = options?.height ?? imgHeight;

  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Draw background image covering the page
  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });

  const helvetica = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const nameFontSize = options?.nameFontSize ?? Math.round(pageHeight * 0.06);
  const idFontSize = options?.idFontSize ?? Math.round(pageHeight * 0.045);
  const batchFontSize = options?.batchFontSize ?? Math.round(pageHeight * 0.04);

  const nameX = options?.nameX ?? Math.round(pageWidth * 0.15);
  const nameY = options?.nameY ?? Math.round(pageHeight * 0.25);

  const idX = options?.idX ?? Math.round(pageWidth * 0.15);
  const idY = options?.idY ?? Math.round(pageHeight * 0.15);

  const batchX = options?.batchX ?? Math.round(pageWidth * 0.15);
  const batchY = options?.batchY ?? Math.round(pageHeight * 0.20);

  const nameColor = options?.nameColor ? rgb(...options.nameColor) : rgb(0, 0, 0);
  const idColor = options?.idColor ? rgb(...options.idColor) : rgb(0, 0, 0);
  const batchColor = options?.batchColor ? rgb(...options.batchColor) : rgb(0, 0, 0);

  // Draw name
  page.drawText(name, {
    x: nameX,
    y: nameY,
    size: nameFontSize,
    font: helvetica,
    color: nameColor,
    maxWidth: pageWidth - nameX - 20,
  });

  // Draw batch
  page.drawText(batchText, {
    x: batchX,
    y: batchY,
    size: batchFontSize,
    font: helvetica,
    color: batchColor,
    maxWidth: pageWidth - batchX - 20,
  });

  // Draw serial/id
  page.drawText(idText, {
    x: idX,
    y: idY,
    size: idFontSize,
    font: helvetica,
    color: idColor,
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
