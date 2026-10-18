import { classifyAiError, upstreamCode } from "./aiError";

let pass = 0;
let fail = 0;

function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { pass++; console.log("  ✓  " + name); }
  else { fail++; console.log("  ✗  " + name + "\n       want " + JSON.stringify(want) + "\n       got  " + JSON.stringify(got)); }
}

function truthy(name: string, got: boolean) { check(name, got, true); }

// The exact body the Gemini SDK threw on 2026-10-13, trimmed. Using the real
// payload rather than an invented one: a test built on a guessed shape proves
// only that the guess is self-consistent.
const REAL_429 = new Error(JSON.stringify({
  error: {
    code: 429,
    message: "You exceeded your current quota, please check your plan and billing details.",
    status: "RESOURCE_EXHAUSTED",
    details: [{ "@type": "type.googleapis.com/google.rpc.QuotaFailure",
      violations: [{ quotaId: "GenerateRequestsPerDayPerProjectPerModel-FreeTier", quotaValue: "20" }] }]
  }
}));

const REAL_503 = new Error(JSON.stringify({
  error: { code: 503, message: "This model is currently experiencing high demand.", status: "UNAVAILABLE" }
}));

const FORBIDDEN = new Error(JSON.stringify({
  error: { code: 403, message: "Requests from this API key are blocked.", status: "PERMISSION_DENIED" }
}));

console.log("\n-- upstream code is read from the real payload --\n");
check("429 is read out of a JSON message", upstreamCode(REAL_429), 429);
check("503 is read out of a JSON message", upstreamCode(REAL_503), 503);
check("a numeric .status is preferred when present", upstreamCode({ status: 429 }), 429);
check("a non-JSON message yields no code, rather than a guess", upstreamCode(new Error("socket hang up")), null);
check("undefined yields no code", upstreamCode(undefined), null);

console.log("\n-- status codes carry the same meaning as the message --\n");
check("a quota is 429, not 500", classifyAiError(REAL_429).status, 429);
check("a busy upstream is 503, not 500", classifyAiError(REAL_503).status, 503);
check("a rejected key is 503 and named as our configuration", classifyAiError(FORBIDDEN).status, 503);
check("an unrecognised failure stays 500", classifyAiError(new Error("socket hang up")).status, 500);

console.log("\n-- the provider's wording never reaches the user --\n");
const leaky = [REAL_429, REAL_503, FORBIDDEN, new Error("socket hang up")];
const providerPhrases = ["quota", "billing", "RESOURCE_EXHAUSTED", "high demand", "API key", "PERMISSION_DENIED", "socket hang up"];
for (const e of leaky) {
  const out = JSON.stringify(classifyAiError(e)).toLowerCase();
  for (const phrase of providerPhrases) {
    truthy("PLANTED no provider phrase \"" + phrase + "\" in the reply for code " + (upstreamCode(e) ?? "none"),
      !out.includes(phrase.toLowerCase()));
  }
}

console.log("\n-- every verdict is answerable by a human --\n");
for (const e of leaky) {
  const v = classifyAiError(e);
  truthy("message is a sentence, not a code dump", v.message.length > 30 && !v.message.includes("{"));
  truthy("a machine-readable code is present", /^[A-Z_]+$/.test(v.code));
}

console.log("\n" + (fail === 0 ? "── " + pass + "/" + pass + " passed" : "── " + fail + " FAILED of " + (pass + fail)));
process.exit(fail === 0 ? 0 : 1);
