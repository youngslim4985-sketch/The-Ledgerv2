import { analysisToText } from "./analysisText";
import type { ContractAnalysis } from "../types";

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean) => {
  if (cond) { pass++; console.log(`  ✓  ${name}`); }
  else { fail++; console.log(`  ✗ FAILED  ${name}`); }
};

const A = {
  title: "Apex Sound 360 Recording Agreement",
  dealType: "Recording Agreement",
  riskScore: 83,
  summary: "Rights are assigned in perpetuity.",
  plainEnglishTranslation: "",
  keyTerms: [],
  redFlags: [{ clause: "Grant of Rights", riskLevel: "HIGH", explanation: "Perpetual and worldwide." }],
  fairTerms: [{ clause: "Audit Rights", explanation: "Annual audit permitted." }],
  questionsForAttorney: ["Can the term be limited to 7 years?"],
} as unknown as ContractAnalysis;

console.log("\n── analysisToText ──\n");

const t = analysisToText(A);
// The whole point: what the clipboard carries must be the findings, not a link.
ok("PLANTED it carries the risk score", /83/.test(t));
ok("PLANTED it carries the red flag clause", /Grant of Rights/.test(t));
ok("PLANTED it carries the red flag explanation", /Perpetual and worldwide/.test(t));
ok("it carries fair terms", /Audit Rights/.test(t));
ok("it carries the attorney questions", /limited to 7 years/.test(t));
ok("it names the contract", /Apex Sound 360/.test(t));
ok("PLANTED it is NOT a URL", !/^https?:\/\//m.test(t) && !/localhost/.test(t));
ok("it says what it is and is not", /not legal advice/i.test(t));

// A thin analysis must not throw; missing arrays are simply absent.
const thin = { title: "Untitled", dealType: "", riskScore: 0, summary: "" } as unknown as ContractAnalysis;
ok("PLANTED a thin analysis does not throw", typeof analysisToText(thin) === "string");
ok("and it omits sections it has nothing for", !/Red flags/.test(analysisToText(thin)));

console.log(`\n── ${pass}/${pass + fail} passed${fail ? `   ${fail} FAILED` : ""}\n`);
process.exit(fail ? 1 : 0);
