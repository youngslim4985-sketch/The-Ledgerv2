export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v);

export function validateAnalysis(value: unknown): ValidationResult {
  if (!isRecord(value)) {
    return { ok: false, reason: "response is not an object" };
  }

  for (const key of ["title", "summary", "plainEnglishTranslation"]) {
    if (!isNonEmptyString(value[key])) {
      return { ok: false, reason: `${key} missing or not a non-empty string` };
    }
  }

  const score = value.riskScore;
  if (
    typeof score !== "number" ||
    !Number.isInteger(score) ||
    score < 1 ||
    score > 100
  ) {
    return {
      ok: false,
      reason: "riskScore must be an integer from 1 to 100",
    };
  }

  if (!Array.isArray(value.redFlags)) {
    return { ok: false, reason: "redFlags missing or not an array" };
  }

  for (let i = 0; i < value.redFlags.length; i++) {
    const flag = value.redFlags[i];

    if (!isRecord(flag)) {
      return { ok: false, reason: `redFlags[${i}] must be an object` };
    }

    for (const key of ["clause", "explanation", "questionToAsk"]) {
      if (!isNonEmptyString(flag[key])) {
        return {
          ok: false,
          reason: `redFlags[${i}].${key} must be a non-empty string`,
        };
      }
    }

    if (
      flag.riskLevel !== "HIGH" &&
      flag.riskLevel !== "MEDIUM" &&
      flag.riskLevel !== "LOW"
    ) {
      return {
        ok: false,
        reason: `redFlags[${i}].riskLevel must be HIGH, MEDIUM, or LOW`,
      };
    }
  }

  if (!Array.isArray(value.questionsForAttorney)) {
    return {
      ok: false,
      reason: "questionsForAttorney missing or not an array",
    };
  }

  for (let i = 0; i < value.questionsForAttorney.length; i++) {
    if (!isNonEmptyString(value.questionsForAttorney[i])) {
      return {
        ok: false,
        reason: `questionsForAttorney[${i}] must be a non-empty string`,
      };
    }
  }

  return { ok: true };
}
