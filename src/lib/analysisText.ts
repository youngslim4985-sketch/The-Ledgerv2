/**
 * The analysis as shareable text.
 *
 * WHY THIS EXISTS
 *
 * "Share Analysis" called `navigator.clipboard.writeText(window.location.href)`
 * and then said "Link Copied!". Every piece of analysis state lives in memory in
 * React, so the recipient opening that URL saw the app's default state, not the
 * sender's analysis. The button promised to share findings and shared a link to
 * a blank tool.
 *
 * Real sharing would mean persisting contracts on a server, and this app tells
 * the artist their document is not stored. Keeping that promise and keeping the
 * button both point the same way: share the ANALYSIS, as text, which the
 * clipboard can actually carry.
 *
 * Found by IBM Bob 2026-10-06 (#6).
 */
import type { ContractAnalysis } from "../types";

export function analysisToText(a: ContractAnalysis): string {
  const out: string[] = [];
  out.push(a.title || "Contract analysis");
  if (a.dealType) out.push(a.dealType);
  out.push("");
  if (typeof a.riskScore === "number") out.push(`Overall risk score: ${a.riskScore} of 100`);
  if (a.summary) { out.push(""); out.push(a.summary); }

  const section = (heading: string, items: string[]) => {
    if (!items.length) return;
    out.push("");
    out.push(heading);
    items.forEach((i) => out.push(`  - ${i}`));
  };

  section("Red flags", (a.redFlags ?? []).map((r) =>
    [r.clause, r.riskLevel ? `(${r.riskLevel})` : "", r.explanation ? `- ${r.explanation}` : ""]
      .filter(Boolean).join(" ")));
  section("Fair terms", (a.fairTerms ?? []).map((f) =>
    [f.clause, f.explanation ? `- ${f.explanation}` : ""].filter(Boolean).join(" ")));
  section("Questions for an attorney", a.questionsForAttorney ?? []);

  out.push("");
  // Said plainly, because a pasted block travels further than the page it came
  // from and will be read by people who never saw the tool.
  out.push("Produced by THE LEDGER. This is an educational summary, not legal advice.");
  return out.join("\n");
}
