/**
 * Ticket 2 review: what validateAnalysis actually accepts and refuses.
 *
 * James, 11 Oct. This file CHANGES NO BEHAVIOUR. It pins current behaviour so
 * the one open question below is decided on evidence rather than impression,
 * and so a later change cannot move it silently.
 *
 * THE HEADLINE IS THAT TICKET 2 IS IN GOOD SHAPE. Every malformed shape a
 * failing provider actually returns is refused with a reason that names the
 * field: a bare error object, an empty object, null, a string, an array. The
 * riskScore bounds are exact at every edge including 72.5 and NaN. The server
 * answers 502 and does not leak the provider's own message. I went looking for
 * holes and found one narrow one.
 *
 * THE GAP. ContractAnalysis declares dealType, keyTerms and fairTerms as
 * REQUIRED (no `?`). The validator does not check any of the three, so a
 * response missing all three returns ok:true.
 *
 * Measured consequence, which is smaller than it first looks:
 *   dealType    ContractAnalyzer:635 renders {analysis.dealType} -> a blank
 *               badge. :962 passes it to onNavigateToRightsGraph, but App.tsx
 *               names that parameter `_dealType` and ignores it, and
 *               RightsGraph takes no props. So: cosmetic, not a crash.
 *   keyTerms    pdfGenerator:198 guards with `if (analysis.keyTerms && ...)`.
 *   fairTerms   pdfGenerator:31 guards with `analysis.fairTerms?.length || 0`.
 *               So the exported PDF silently loses a section and reports a
 *               fair-terms count of 0.
 *
 * THE DECISION THIS NEEDS, and it is a product call, not a bug:
 * requiring them means a 502 and NO analysis for an artist whose contract was
 * read correctly but came back without a label. Refusing to help someone over
 * a missing badge is the worse failure. The alternatives are to mark the three
 * optional in ContractAnalysis so the type stops claiming something untrue, or
 * to require them and accept more 502s. I have not chosen; the tests below
 * pass either way and say which is in force.
 */
import { validateAnalysis } from "./validateAnalysis";

let ok_n = 0, fail_n = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (cond) { ok_n++; console.log(`  ok   ${name}`); }
  else { fail_n++; console.log(`  FAIL ${name}${detail ? "   [" + detail + "]" : ""}`); }
};

const complete = {
  title: "Recording Agreement", dealType: "Recording", summary: "A summary.",
  plainEnglishTranslation: "In plain words.", riskScore: 72,
  keyTerms: [], fairTerms: [], redFlags: [], questionsForAttorney: [],
};
const refused = (v: unknown) => validateAnalysis(v).ok === false;

console.log("\n-- what a failing provider returns is refused, with a reason --\n");
for (const [label, v] of [
  ["a provider error object", { error: "quota exceeded" }],
  ["an empty object", {}],
  ["null", null],
  ["a JSON string rather than an object", "{}"],
  ["an array", []],
  ["a number", 7],
] as [string, unknown][]) ok(`${label} is refused`, refused(v));

ok("PLANTED and the reason names the field, not just 'invalid'",
   (validateAnalysis({}) as { reason: string }).reason.includes("title"));

console.log("\n-- riskScore bounds, every edge --\n");
for (const [s, want] of [[0, false], [1, true], [100, true], [101, false],
                         [72.5, false], [NaN, false], [-5, false]] as [number, boolean][])
  ok(`riskScore ${s} -> ${want ? "accepted" : "refused"}`,
     validateAnalysis({ ...complete, riskScore: s }).ok === want);

console.log("\n-- nested redFlags are checked, not just the array --\n");
ok("PLANTED a redFlag with a bad riskLevel is refused",
   refused({ ...complete, redFlags: [{ clause: "c", explanation: "e", questionToAsk: "q", riskLevel: "SEVERE" }] }));
ok("PLANTED a redFlag missing questionToAsk is refused",
   refused({ ...complete, redFlags: [{ clause: "c", explanation: "e", riskLevel: "HIGH" }] }));
ok("PLANTED a non-string in questionsForAttorney is refused",
   refused({ ...complete, questionsForAttorney: ["fine", 42] }));
ok("a whitespace-only string does not count as present",
   refused({ ...complete, title: "   " }));

console.log("\n-- dealType is OPTIONAL now, and no read may be unguarded --\n");
// RESOLVED 11 Oct: dealType, keyTerms and fairTerms are optional in
// ContractAnalysis. Requiring them in the validator was the other option and
// it would 502 an artist whose contract read fine but came back without a
// label. The type now matches what the provider actually sends.
//
// That moves the risk from the validator to the READ SITES, so this checks
// those instead. It is a source check on purpose: the defect class is a FUTURE
// unguarded read, not any single one of today's.
//
// The one that mattered was pdfGenerator:142. A template literal turns
// undefined into the five characters "undefined", so the PDF an artist
// downloads said "Category / Deal Type: undefined". A blank badge is a
// cosmetic miss; printing "undefined" into their document is the product
// telling them something false about their own contract.
import { readFileSync } from "fs";
import { DEAL_TYPE_UNKNOWN } from "../types";

const SITES = [
  "src/components/ContractAnalyzer.tsx",
  "src/pages/LedgerPage.tsx",
  "src/utils/pdfGenerator.ts",
];
let unguarded: string[] = [];
for (const f of SITES) {
  const src = readFileSync(f, "utf8");
  src.split("\n").forEach((line, i) => {
    if (!/\banalysis\.dealType\b/.test(line)) return;
    const safe = /DEAL_TYPE_UNKNOWN|\?\?|\?\.|&&/.test(line);
    if (!safe) unguarded.push(`${f}:${i + 1}  ${line.trim().slice(0, 70)}`);
  });
}
ok("PLANTED every analysis.dealType read is guarded", unguarded.length === 0,
   unguarded.join(" | "));
ok("the fallback is a named constant, not three loose strings",
   DEAL_TYPE_UNKNOWN.length > 0);
ok("PLANTED the PDF cannot print the word undefined for a deal type",
   !readFileSync("src/utils/pdfGenerator.ts", "utf8")
     .includes("Deal Type: ${analysis.dealType}"));

console.log("\n-- the three optional fields are accepted when absent --\n");
const { dealType, keyTerms, fairTerms, ...withoutThree } = complete;
const gapVerdict = validateAnalysis(withoutThree);
console.log(`  current behaviour: missing dealType+keyTerms+fairTerms -> ${JSON.stringify(gapVerdict)}`);
ok("a response without the three optional fields is accepted, not 502'd",
   gapVerdict.ok === true, JSON.stringify(gapVerdict));

console.log(`\n-- ${ok_n}/${ok_n + fail_n} passed` + (fail_n ? `   ${fail_n} FAILED` : "") + "\n");
process.exit(fail_n ? 1 : 0);
