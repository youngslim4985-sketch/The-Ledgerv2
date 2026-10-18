/**
 * Two behaviours that a branch merge silently removed on 2026-10-13, while 167
 * other checks stayed green. Both are user-visible, neither was asserted
 * anywhere, and both had been fixed once before and regressed.
 *
 * These are source-level assertions on purpose. The behaviours live in a React
 * component, and a check that only tested the pure helpers is what let the
 * regression through: the helpers were fine, the component stopped calling one
 * of them and initialised from the wrong constant.
 */
import { readFileSync } from "node:fs";
import { SAMPLE_CONTRACTS, DEFAULT_SAMPLE, DEFAULT_SAMPLE_ID, DEFAULT_SAMPLE_INDEX } from "../data/sampleContracts";

const component = readFileSync("src/components/ContractAnalyzer.tsx", "utf8");
const page = readFileSync("src/pages/LedgerPage.tsx", "utf8");

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (cond) { pass++; console.log("  ✓  " + name); }
  else { fail++; console.log("  ✗  FAILED  " + name + (detail ? "\n       " + detail : "")); }
};

console.log("\n-- the app opens on a music contract, not an employment agreement --\n");
ok("DEFAULT_SAMPLE_ID is the 360 recording deal", DEFAULT_SAMPLE_ID === "recording-360-deal", "got " + DEFAULT_SAMPLE_ID);
ok("that id exists in the library", SAMPLE_CONTRACTS.some((c) => c.id === DEFAULT_SAMPLE_ID));
ok("it resolves rather than falling back to index 0",
   DEFAULT_SAMPLE.id === DEFAULT_SAMPLE_ID,
   "resolved to " + DEFAULT_SAMPLE.id + " at index " + DEFAULT_SAMPLE_INDEX);
ok("PLANTED the default is NOT the executive employment agreement",
   !/employment/i.test(DEFAULT_SAMPLE.id) && !/employment/i.test(DEFAULT_SAMPLE.title ?? ""));
ok("PLANTED no component state initialises from SAMPLE_CONTRACTS[0]",
   !/SAMPLE_CONTRACTS\[0\]/.test(component),
   "found a hardcoded first-sample initialiser");
ok("PLANTED the page does not fall back to SAMPLE_CONTRACTS[0] either",
   !/SAMPLE_CONTRACTS\[0\]/.test(page));

console.log("\n-- every refused upload clears the text box --\n");
const helper = component.match(/const refuseUpload = \(message: string\) => \{[\s\S]*?\n  \};/);
ok("a single refuseUpload helper exists", !!helper);
if (helper) {
  const body = helper[0];
  for (const [what, re] of [
    ["the error message", /setUploadError\(message\)/],
    ["the progress bar", /setUploadProgress\(null\)/],
    ["the upload stage", /setUploadStage\(null\)/],
    ["the file name", /setUploadedFileName\(null\)/],
    ["the file size", /setUploadedFileSize\(null\)/],
    ["PLANTED the text box, which is the whole point", /setInputText\(""\)/],
  ] as [string, RegExp][]) ok("it clears " + what, re.test(body));
}

// Every refusal in the upload handler must route through the helper. Counted
// rather than eyeballed: the regression was one site that did not.
const handler = component.slice(component.indexOf("const handleFileUpload"));
const calls = (handler.match(/refuseUpload\(/g) || []).length;
ok("all four upload refusals go through it", calls === 4, "found " + calls);
const strays = (handler.match(/setUploadError\((?!null)/g) || []).length;
ok("PLANTED no refusal in the upload handler sets the error directly", strays === 0, "found " + strays + " direct setUploadError");

console.log("\n" + (fail === 0 ? "── " + pass + "/" + pass + " passed" : "── " + fail + " FAILED of " + (pass + fail)));
process.exit(fail === 0 ? 0 : 1);
