/**
 * Classify an error thrown by the AI client into a status code and a message
 * meant for the person using the app.
 *
 * Two rules, both learned from a real incident (modernization log, Entry 9):
 *
 *  1. Never forward the provider's error body. A user who has simply reached a
 *     daily limit was being shown Google's internal wording inside an HTTP 500,
 *     which says "the application broke" when nothing had broken.
 *
 *  2. The status code must carry the same meaning as the message. A quota is
 *     not a crash (429), a busy upstream is not a crash (503), and a key that
 *     is missing or rejected is our configuration problem, not the user's.
 *
 * The provider's own text is deliberately dropped here. It is still written to
 * the server log by the caller, which is where it is useful.
 */

export interface AiErrorVerdict {
  status: number;
  code: string;
  message: string;
}

/** Pull a numeric upstream status out of whatever shape the SDK threw. */
export function upstreamCode(err: unknown): number | null {
  if (err && typeof err === "object") {
    const direct = (err as { status?: unknown }).status;
    if (typeof direct === "number") return direct;

    const message = (err as { message?: unknown }).message;
    if (typeof message === "string") {
      try {
        const parsed = JSON.parse(message) as { error?: { code?: unknown } };
        const code = parsed?.error?.code;
        if (typeof code === "number") return code;
      } catch {
        // Not a JSON payload. Fall through rather than guessing from the text:
        // matching on words is one unlucky phrasing away from lying.
      }
    }
  }
  return null;
}

export function classifyAiError(err: unknown): AiErrorVerdict {
  switch (upstreamCode(err)) {
    case 429:
      return {
        status: 429,
        code: "AI_RATE_LIMITED",
        message:
          "The request limit for contract analysis has been reached. This is a limit on the AI service, not a problem with your document. It usually resets within 24 hours."
      };
    case 503:
      return {
        status: 503,
        code: "AI_SERVICE_UNAVAILABLE",
        message:
          "The AI service is temporarily unavailable. Nothing was analysed. Please try again in a few minutes."
      };
    case 401:
    case 403:
      return {
        status: 503,
        code: "AI_SERVICE_NOT_CONFIGURED",
        message:
          "Contract analysis is unavailable because the AI service rejected this application's credentials."
      };
    default:
      return {
        status: 500,
        code: "AI_REQUEST_FAILED",
        message: "Contract analysis could not be completed. Nothing was analysed."
      };
  }
}
