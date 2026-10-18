/**
 * The upload decision, lifted out of ContractAnalyzer so it can be tested.
 *
 * WHY THIS EXISTS, AND WHY IT CHANGES NO BEHAVIOUR
 *
 * The validation on bob/pdf-extraction is good: unsupported type, size limit,
 * %PDF- magic bytes, scanned/image-only detection, password-protected, corrupt.
 * All of it correct, and both fabricated-text blocks are gone.
 *
 * But it lives inline in an async handler that also touches six pieces of React
 * state, so none of it can be exercised without a DOM. This file is the same
 * rules as pure functions. Same thresholds, same messages, same order. The
 * component calls these instead of inlining them, and the suite in
 * uploadDecision.test.ts can then prove the refusals actually refuse.
 *
 * Roles (4 Oct): Terrance owns extraction and validation; James owns states and
 * verification. This does not touch the extractor. It makes the decisions he
 * already wrote checkable, which is the half I was asked for.
 */

export const MAX_BYTES = 10 * 1024 * 1024;
export const MIN_CHARS = 50;
export const PDF_MAGIC = "%PDF-";

export type Decision =
  | { kind: "accept"; route: "pdf" | "text"; docTitle: string }
  | { kind: "refuse"; message: string };

/** The refuse arm on its own. A checker that can only refuse should say so
 * in its type, rather than returning the wider union and making every
 * caller narrow a case that cannot happen. */
export type Refusal = Extract<Decision, { kind: "refuse" }>;

/** Everything decidable before any bytes are read. */
export function preflight(fileName: string, bytes: number, mime: string): Decision {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const isPdf = ext === "pdf";
  const isTxt = ext === "txt" || mime.includes("text");

  if (!isPdf && !isTxt) {
    return {
      kind: "refuse",
      message:
        ext === "doc" || ext === "docx"
          ? "DOCX and DOC files are not supported yet. Please upload a PDF or TXT file."
          : `".${ext}" files are not supported. Please upload a PDF or TXT file.`,
    };
  }
  if (bytes > MAX_BYTES) {
    return { kind: "refuse", message: "File exceeds the 10 MB limit. Please upload a smaller document." };
  }
  return { kind: "accept", route: isPdf ? "pdf" : "text", docTitle: fileName.replace(/\.[^/.]+$/, "") };
}

/** The magic-byte check. A file named .pdf is not a PDF. */
export function checkMagic(header: string): Decision | null {
  return header === PDF_MAGIC
    ? null
    : { kind: "refuse", message: "File does not appear to be a valid PDF (missing %PDF- header)." };
}

/**
 * What the extracted text means.
 *
 * A scan opens perfectly and yields nothing, so this is the case that most
 * looks like success. Returning a refusal here is the whole point: there is
 * nothing to analyse and saying so is the only honest outcome.
 */
export function judgeText(text: string): Decision | null {
  return text.trim().length < MIN_CHARS
    ? { kind: "refuse", message: "No extractable text found. This may be a scanned or image-only PDF." }
    : null;
}

/** Errors thrown out of extraction, mapped to what the artist is told. */
export function judgeError(errName: string): Decision {
  return errName === "PasswordProtectedError"
    ? { kind: "refuse", message: "This PDF is password-protected. Please provide an unlocked copy." }
    : { kind: "refuse", message: "Could not read the file. It may be corrupted or in an unsupported format." };
}

/**
 * THE ONE QUESTION THE RESULTS SECTION MUST ASK.
 *
 * On bob/pdf-extraction the analysis panel renders unconditionally, and
 * `analysis` is initialised to the default sample's analysis. So an artist who
 * uploads a scanned 360 deal is correctly told "No extractable text found" and
 * is then shown, directly beneath it, a complete risk score and clause
 * breakdown — of a sample Employment Agreement.
 *
 * The refusal is right. The screen still shows findings. That is the same
 * failure the fabricated text was, one layer up: something on screen that the
 * system has not established about this document.
 */
export function mayShowAnalysis(opts: { uploadError: string | null; hasAnalysedUpload: boolean; isCustomText: boolean }): boolean {
  if (opts.uploadError) return false;          // a refusal shows no findings
  if (!opts.isCustomText) return true;         // sample contracts are their own analysis
  return opts.hasAnalysedUpload;               // an upload shows findings only once analysed
}

/**
 * THE SERVER ALREADY TELLS THE TRUTH. THE CLIENT THROWS IT AWAY.
 *
 * `server.ts` reads GEMINI_API_KEY and, when it is missing, returns a complete
 * analysis it made up: riskScore 72, named red flags about Grant of Rights and
 * Cross-Collateralization, explanations, questions to ask. It is honest about
 * doing so — it sets `fallback: true` and writes "AI key not set on
 * environment" into the summary.
 *
 * `ContractAnalyzer` does `const result: ContractAnalysis = await
 * response.json(); setAnalysis(result)`. One grep for "fallback" across src/
 * finds the word only inside an unrelated formatCurrency warning. The flag is
 * discarded, and an artist who uploads a 360 deal is shown a risk score for a
 * document that nothing read.
 *
 * There is no .env in this checkout, so that is every analysis the app performs
 * today. Found by IBM Bob on 2026-10-06 and verified by opening the lines; see
 * docs/BOB_SESSION_2026-10-06_HONESTY_AUDIT.md.
 *
 * This is the same disease as the fabricated contract text and the sample
 * analysis under a refusal: something on screen that the system has not
 * established about THIS document. The cure is the same. Refuse, and say why.
 */
export function judgeAnalysisResponse(body: unknown): Refusal | null {
  if (typeof body !== "object" || body === null) {
    return { kind: "refuse", message: "The analysis service returned something unreadable." };
  }
  const b = body as Record<string, unknown>;

  // The honest flag, finally read.
  if (b.fallback === true) {
    return {
      kind: "refuse",
      message:
        "AI analysis is not configured on this server, so this contract has not been read. " +
        "No risk score is shown because none has been calculated for your document.",
    };
  }

  // A body with no findings is not an analysis either, whatever it calls itself.
  if (!Array.isArray(b.redFlags) && !Array.isArray(b.fairTerms)) {
    return { kind: "refuse", message: "The analysis came back empty. Nothing has been assessed." };
  }
  return null;
}

/**
 * WHAT THE PROGRESS BAR IS ALLOWED TO SAY.
 *
 * The label was `uploadProgress < 100 ? "Uploading & Extracting Clauses..." :
 * "Analysis Complete!"`, and progress was set to 100 the instant extraction
 * returned — before the empty/image-only check, and before the AI call was even
 * made. So an artist uploading a scanned 360 deal saw "Analysis Complete!" at
 * 100%, and then a refusal saying no text could be found.
 *
 * Nothing was analysed. The bar said it was. Percentages are cheap; the claim
 * attached to them is not.
 *
 * Stages are named after what has ACTUALLY happened, and "analysed" is reachable
 * only from the success path. Found by IBM Bob 2026-10-06 (#4).
 */
export type Stage = "reading" | "extracting" | "checking" | "analysing" | "analysed";

export function stageLabel(stage: Stage): string {
  switch (stage) {
    case "reading":    return "Reading the file...";
    case "extracting": return "Extracting text...";
    case "checking":   return "Checking the text is usable...";
    case "analysing":  return "Analysing the contract...";
    case "analysed":   return "Analysis complete";
  }
}

/** How full the bar should be. Only `analysed` reaches 100. */
export function stagePercent(stage: Stage): number {
  switch (stage) {
    case "reading":    return 10;
    case "extracting": return 40;
    case "checking":   return 60;
    case "analysing":  return 80;
    case "analysed":   return 100;
  }
}
