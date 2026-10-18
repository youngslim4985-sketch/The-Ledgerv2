import assert from "node:assert/strict";
import { validateAnalysis } from "../src/lib/validateAnalysis";

const validRedFlag = {
  clause: "Rights grant",
  riskLevel: "HIGH",
  explanation: "The grant is unusually broad.",
  questionToAsk: "Can the grant be limited?",
};

const validAnalysis = {
  title: "Contract Review",
  summary: "A summary of the contract.",
  plainEnglishTranslation: "This agreement explains the terms.",
  riskScore: 72,
  redFlags: [validRedFlag],
  questionsForAttorney: ["Can the rights term be shortened?"],
};

let passed = 0;

function check(name: string, value: unknown, expectedOk: boolean) {
  const result = validateAnalysis(value);
  assert.equal(
    result.ok,
    expectedOk,
    `${name}: expected ok=${expectedOk}, got ${JSON.stringify(result)}`
  );
  passed++;
  console.log(`PASS: ${name}`);
}

check("accepts valid analysis", validAnalysis, true);
check("accepts valid empty arrays", {
  ...validAnalysis,
  redFlags: [],
  questionsForAttorney: [],
}, true);
check("rejects null", null, false);
check("rejects an array instead of an object", [], false);
check("rejects an empty object", {}, false);
check("rejects blank title", { ...validAnalysis, title: "   " }, false);
check("rejects missing summary", { ...validAnalysis, summary: undefined }, false);
check(
  "rejects missing plain-English translation",
  { ...validAnalysis, plainEnglishTranslation: undefined },
  false
);
check("rejects risk score below 1", { ...validAnalysis, riskScore: 0 }, false);
check("rejects risk score above 100", { ...validAnalysis, riskScore: 101 }, false);
check("rejects decimal risk score", { ...validAnalysis, riskScore: 72.5 }, false);
check("rejects string risk score", { ...validAnalysis, riskScore: "72" }, false);
check("rejects missing redFlags array", { ...validAnalysis, redFlags: undefined }, false);
check(
  "rejects missing questionsForAttorney array",
  { ...validAnalysis, questionsForAttorney: undefined },
  false
);
check("rejects non-object red flag", {
  ...validAnalysis,
  redFlags: ["not an object"],
}, false);
check("rejects missing red flag clause", {
  ...validAnalysis,
  redFlags: [{ ...validRedFlag, clause: "" }],
}, false);
check("rejects missing red flag explanation", {
  ...validAnalysis,
  redFlags: [{ ...validRedFlag, explanation: "" }],
}, false);
check("rejects missing red flag question", {
  ...validAnalysis,
  redFlags: [{ ...validRedFlag, questionToAsk: "" }],
}, false);
check("rejects invalid risk level", {
  ...validAnalysis,
  redFlags: [{ ...validRedFlag, riskLevel: "SEVERE" }],
}, false);
check("rejects non-string attorney question", {
  ...validAnalysis,
  questionsForAttorney: [123],
}, false);
check("rejects blank attorney question", {
  ...validAnalysis,
  questionsForAttorney: ["  "],
}, false);

console.log(`\n${passed} validator tests passed.`);
