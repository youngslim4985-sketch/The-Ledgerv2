import * as pdfjsLib from "pdfjs-dist";

/**
 * Extract all text from a PDF File using pdf.js.
 *
 * The caller is responsible for setting GlobalWorkerOptions.workerSrc
 * before the first call (done at module level in ContractAnalyzer.tsx).
 *
 * @returns The concatenated text of every page, pages separated by "\n\n".
 * @throws  {PasswordProtectedError} If the PDF is encrypted / password-protected.
 * @throws  {Error}                  If the document cannot be loaded or decoded.
 */

export class PasswordProtectedError extends Error {
  constructor() {
    super("password-protected");
    this.name = "PasswordProtectedError";
  }
}

export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  let pdf: pdfjsLib.PDFDocumentProxy;
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  } catch (err: unknown) {
    // pdfjs-dist 6.x throws PasswordException for encrypted PDFs
    if (
      err != null &&
      typeof err === "object" &&
      "name" in err &&
      (err as { name: string }).name === "PasswordException"
    ) {
      throw new PasswordProtectedError();
    }
    throw err;
  }

  const pageTexts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pageTexts.push(pageText);
  }

  return pageTexts.join("\n\n");
}
