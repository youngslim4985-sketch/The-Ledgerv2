/**
 * Ticket 1 regression suite. Runs on the repo's existing tsx, no new dependency:
 *     npx tsx src/lib/uploadDecision.test.ts
 *
 * Several cases MUST refuse. A suite where everything passes shows the code
 * runs; it does not show the guard guards.
 */
import { preflight, checkMagic, judgeText, judgeError, mayShowAnalysis, judgeAnalysisResponse, stageLabel, stagePercent, MAX_BYTES } from "./uploadDecision";

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, got = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "✓" : "✗ FAILED"}  ${name}${cond || !got ? "" : `\n          got: ${got}`}`);
};
// Null-safe on purpose. judgeAnalysisResponse returns null for "this is
// fine", so a regression that stops refusing hands this a null. Before,
// that threw and took the whole suite down mid-run, which reads like a
// broken harness rather than the bug coming back. A missing refusal is a
// FAILED CHECK, printed in its place, with the checks after it still run.
const refused = (d: { kind: string } | null | undefined) => d?.kind === "refuse";

console.log("\n── TICKET 1 · the refusal path ──\n");

// ── the original defect: a scan must refuse ──────────────────────────────
{
  const d = judgeText("");
  ok("an image-only PDF REFUSES", !!d && refused(d));
  ok("  and names the reason to the artist",
     !!d && d.kind === "refuse" && /scanned or image-only/.test(d.message));
}
ok("PLANTED a whitespace-only extraction still refuses", refused(judgeText("   \n\n  \t ")!));
ok("PLANTED 49 characters is not a contract", refused(judgeText("x".repeat(49))!));
ok("a real contract body passes", judgeText("x".repeat(4000)) === null);

// ── preflight ────────────────────────────────────────────────────────────
ok("a .exe is refused", refused(preflight("deal.exe", 1000, "application/x-msdownload")));
ok("a .docx is refused, and says DOCX is not supported yet",
   (() => { const d = preflight("deal.docx", 1000, ""); return refused(d) && /DOCX/.test((d as any).message); })());
ok("over 10 MB is refused", refused(preflight("deal.pdf", MAX_BYTES + 1, "application/pdf")));
ok("a normal PDF is accepted as pdf", preflight("360_deal.pdf", 2e6, "application/pdf").kind === "accept");
ok("a .txt is accepted as text",
   (() => { const d = preflight("deal.txt", 2000, "text/plain"); return d.kind === "accept" && d.route === "text"; })());
ok("the doc title drops the extension",
   (preflight("360_deal.pdf", 2e6, "application/pdf") as any).docTitle === "360_deal");

// ── magic bytes: a file named .pdf is not a PDF ──────────────────────────
ok("PLANTED a renamed non-PDF is refused", refused(checkMagic("<html")!));
ok("a real PDF header passes", checkMagic("%PDF-") === null);

// ── errors ───────────────────────────────────────────────────────────────
ok("a password-protected PDF refuses and says so",
   /password-protected/.test((judgeError("PasswordProtectedError") as any).message));
ok("any other extraction error refuses", refused(judgeError("TypeError")));

// ── THE GATE: a refusal must show no findings ────────────────────────────
// On bob/pdf-extraction the analysis panel renders unconditionally and
// `analysis` starts as SAMPLE_CONTRACTS[0].analysis, so a refused upload left a
// full risk breakdown of a sample Employment Agreement on screen beneath the
// error. These are the cases that fail against that version.
ok("PLANTED a refused upload shows NO analysis",
   mayShowAnalysis({ uploadError: "No extractable text found.", hasAnalysedUpload: false, isCustomText: true }) === false);
ok("PLANTED a refusal hides even a previously successful analysis",
   mayShowAnalysis({ uploadError: "This PDF is password-protected.", hasAnalysedUpload: true, isCustomText: true }) === false);
ok("an upload mid-flight shows no analysis yet",
   mayShowAnalysis({ uploadError: null, hasAnalysedUpload: false, isCustomText: true }) === false);
ok("an analysed upload DOES show its analysis",
   mayShowAnalysis({ uploadError: null, hasAnalysedUpload: true, isCustomText: true }) === true);
ok("sample contracts still render, untouched",
   mayShowAnalysis({ uploadError: null, hasAnalysedUpload: false, isCustomText: false }) === true);

// ── THE FALLBACK: a made-up analysis must not render as the artist's ─────
// server.ts returns a complete fabricated analysis when GEMINI_API_KEY is
// unset — riskScore 72, named red flags — and sets fallback:true to say so.
// The client never read the flag. There is no .env in this checkout, so that
// WAS every analysis the app performed. Found by IBM Bob 2026-10-06, verified
// by hand; see docs/BOB_SESSION_2026-10-06_HONESTY_AUDIT.md.
const FABRICATED = {
  fallback: true,
  summary: "Default Educational Analysis (AI key not set on environment).",
  riskScore: 72,
  redFlags: [{ clause: "Grant of Rights & Territory", riskLevel: "HIGH" }],
  fairTerms: [],
};
const REAL = { summary: "Analysis of your document.", riskScore: 41, redFlags: [], fairTerms: [{ clause: "Term" }] };

ok("PLANTED the server's own fallback flag is refused",
   refused(judgeAnalysisResponse(FABRICATED)));
ok("PLANTED and the refusal says the contract was NOT read",
   /not been read/.test((judgeAnalysisResponse(FABRICATED) as any).message));
ok("PLANTED and it says no risk score was calculated",
   /no risk score/i.test((judgeAnalysisResponse(FABRICATED) as any).message));
ok("a real analysis passes through untouched",
   judgeAnalysisResponse(REAL) === null);
ok("PLANTED a body with no findings at all is refused",
   refused(judgeAnalysisResponse({ summary: "hello", riskScore: 10 })));
ok("PLANTED a non-object body is refused, not rendered",
   refused(judgeAnalysisResponse("<html>502 Bad Gateway</html>")));
ok("PLANTED null is refused", refused(judgeAnalysisResponse(null)));
ok("fallback:false is NOT treated as a fallback",
   judgeAnalysisResponse({ ...REAL, fallback: false }) === null);

// And the gate must hide the panel once that refusal is set.
ok("PLANTED a fallback refusal hides the analysis panel",
   mayShowAnalysis({ uploadError: "AI analysis is not configured on this server.", hasAnalysedUpload: false, isCustomText: true }) === false);

// ── THE PROGRESS BAR: it may only claim what has happened ────────────────
// The label was `uploadProgress < 100 ? "Uploading..." : "Analysis Complete!"`
// and progress hit 100 the instant extraction returned — before the
// image-only check and before the AI call. A scanned PDF showed "Analysis
// Complete!" at 100% and then a refusal. Found by IBM Bob 2026-10-06 (#4).
ok("PLANTED only the analysed stage says complete",
   (["reading","extracting","checking","analysing"] as const)
     .every((st) => !/complete/i.test(stageLabel(st))));
ok("PLANTED and only the analysed stage reaches 100",
   (["reading","extracting","checking","analysing"] as const)
     .every((st) => stagePercent(st) < 100));
ok("the analysed stage does say complete", /complete/i.test(stageLabel("analysed")));
ok("the analysed stage reaches 100", stagePercent("analysed") === 100);
ok("PLANTED extraction finishing is not called analysis",
   !/analys/i.test(stageLabel("extracting")));
ok("the bar only moves forward",
   stagePercent("reading") < stagePercent("extracting") &&
   stagePercent("extracting") < stagePercent("checking") &&
   stagePercent("checking") < stagePercent("analysing") &&
   stagePercent("analysing") < stagePercent("analysed"));

console.log(`\n── ${pass}/${pass + fail} passed${fail ? `   ${fail} FAILED` : ""}\n`);
process.exit(fail ? 1 : 0);
