/**
 * Which credential the AI client should use, decided in one place.
 *
 * Two mechanisms exist and they reach different products:
 *
 *   apiKey  -> generativelanguage.googleapis.com (AI Studio). Has a free tier,
 *              measured at 20 generate requests per day per model.
 *   vertex  -> Vertex AI, authenticated by Application Default Credentials.
 *              No free tier; the project must have billing. Required when an
 *              organization policy disallows API keys, which is the case for
 *              the ethicsgym.com Workspace org (modernization log Entry 10).
 *
 * This function reads an env bag and returns a decision. It holds no secret in
 * any message it produces, because those messages are logged.
 */

export type AuthMode =
  | { kind: "vertex"; project: string; location: string }
  | { kind: "apiKey"; apiKey: string }
  | { kind: "unconfigured"; reason: string };

export const DEFAULT_VERTEX_LOCATION = "us-central1";

/** True only for values a human would write meaning yes. */
export function wantsVertex(raw: string | undefined): boolean {
  if (!raw) return false;
  return ["1", "true", "yes", "on"].includes(raw.trim().toLowerCase());
}

export function chooseAuth(env: Record<string, string | undefined>): AuthMode {
  if (wantsVertex(env.GOOGLE_GENAI_USE_VERTEXAI)) {
    const project = (env.GOOGLE_CLOUD_PROJECT ?? "").trim();
    if (!project) {
      return {
        kind: "unconfigured",
        reason:
          "GOOGLE_GENAI_USE_VERTEXAI is set but GOOGLE_CLOUD_PROJECT is empty, so there is no project to authenticate against."
      };
    }
    return {
      kind: "vertex",
      project,
      location: (env.GOOGLE_CLOUD_LOCATION ?? "").trim() || DEFAULT_VERTEX_LOCATION
    };
  }

  const apiKey = (env.GEMINI_API_KEY ?? "").trim();
  if (apiKey) return { kind: "apiKey", apiKey };

  return {
    kind: "unconfigured",
    reason:
      "Neither GEMINI_API_KEY nor Vertex AI credentials are configured, so no contract can be read."
  };
}

/** What to say in a log line. Never includes the key. */
export function describeAuth(mode: AuthMode): string {
  switch (mode.kind) {
    case "vertex":
      return `Vertex AI via Application Default Credentials, project ${mode.project}, location ${mode.location}`;
    case "apiKey":
      return "AI Studio via GEMINI_API_KEY";
    case "unconfigured":
      return `unconfigured: ${mode.reason}`;
  }
}
