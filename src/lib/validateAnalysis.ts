export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export function validateAnalysis(value: unknown): ValidationResult {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, reason: "response is not an object" };
  }
  const a = value as Record<string, unknown>;

  for (const key of ["title", "summary", "plainEnglishTranslation"]) {
    if (!isNonEmptyString(a[key])) {
      return { ok: false, reason: `${key} missing or not a non-empty string` };
    }
  }

  const score = a.riskScore;
  if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 100) {
    return { ok: false, reason: "riskScore must be an integer from 1 to 100" };
  }

  for (const key of ["redFlags", "questionsForAttorney"]) {
    if (!Array.isArray(a[key])) {
      return { ok: false, reason: `${key} missing or not an array` };
    }
  }

  return { ok: true };
}
