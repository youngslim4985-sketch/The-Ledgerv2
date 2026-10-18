import { chooseAuth, describeAuth, wantsVertex, DEFAULT_VERTEX_LOCATION } from "./aiAuth";

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean) => {
  if (cond) { pass++; console.log("  ✓  " + name); }
  else { fail++; console.log("  ✗  FAILED  " + name); }
};
const eq = (name: string, got: unknown, want: unknown) =>
  ok(name + (JSON.stringify(got) === JSON.stringify(want) ? "" : "  [got " + JSON.stringify(got) + "]"),
     JSON.stringify(got) === JSON.stringify(want));

const SECRET = "test-key-value-not-a-real-credential";

console.log("\n-- the flag is read the way a human writes it --\n");
for (const yes of ["1", "true", "TRUE", "yes", "on", " true "]) ok(`"${yes}" means yes`, wantsVertex(yes));
for (const no of ["0", "false", "no", "off", "", undefined]) ok(`${JSON.stringify(no)} does not mean yes`, !wantsVertex(no as string | undefined));

console.log("\n-- which credential gets chosen --\n");
eq("api key alone selects AI Studio",
   chooseAuth({ GEMINI_API_KEY: SECRET }).kind, "apiKey");
eq("vertex flag plus project selects Vertex",
   chooseAuth({ GOOGLE_GENAI_USE_VERTEXAI: "true", GOOGLE_CLOUD_PROJECT: "p-1" }).kind, "vertex");
eq("vertex wins over a present api key, because the org may forbid keys",
   chooseAuth({ GOOGLE_GENAI_USE_VERTEXAI: "true", GOOGLE_CLOUD_PROJECT: "p-1", GEMINI_API_KEY: SECRET }).kind, "vertex");
eq("nothing configured refuses rather than guessing",
   chooseAuth({}).kind, "unconfigured");
eq("whitespace-only api key counts as absent",
   chooseAuth({ GEMINI_API_KEY: "   " }).kind, "unconfigured");

console.log("\n-- a half-configured Vertex setup refuses, and says what is missing --\n");
const half = chooseAuth({ GOOGLE_GENAI_USE_VERTEXAI: "true" });
eq("vertex without a project is unconfigured", half.kind, "unconfigured");
ok("PLANTED it does not silently fall back to the api key",
   chooseAuth({ GOOGLE_GENAI_USE_VERTEXAI: "true", GEMINI_API_KEY: SECRET }).kind === "unconfigured");
ok("the reason names GOOGLE_CLOUD_PROJECT",
   half.kind === "unconfigured" && half.reason.includes("GOOGLE_CLOUD_PROJECT"));

console.log("\n-- location defaults, and is overridable --\n");
const v1 = chooseAuth({ GOOGLE_GENAI_USE_VERTEXAI: "1", GOOGLE_CLOUD_PROJECT: "p" });
ok("defaults to " + DEFAULT_VERTEX_LOCATION, v1.kind === "vertex" && v1.location === DEFAULT_VERTEX_LOCATION);
const v2 = chooseAuth({ GOOGLE_GENAI_USE_VERTEXAI: "1", GOOGLE_CLOUD_PROJECT: "p", GOOGLE_CLOUD_LOCATION: "europe-west4" });
ok("honours GOOGLE_CLOUD_LOCATION", v2.kind === "vertex" && v2.location === "europe-west4");
const v3 = chooseAuth({ GOOGLE_GENAI_USE_VERTEXAI: "1", GOOGLE_CLOUD_PROJECT: "p", GOOGLE_CLOUD_LOCATION: "  " });
ok("blank location falls back to the default", v3.kind === "vertex" && v3.location === DEFAULT_VERTEX_LOCATION);

console.log("\n-- the key never appears in anything that gets logged --\n");
const bags = [
  { GEMINI_API_KEY: SECRET },
  { GOOGLE_GENAI_USE_VERTEXAI: "true", GEMINI_API_KEY: SECRET },
  { GOOGLE_GENAI_USE_VERTEXAI: "true", GOOGLE_CLOUD_PROJECT: "p", GEMINI_API_KEY: SECRET }
];
for (const bag of bags) {
  const mode = chooseAuth(bag);
  ok("PLANTED describeAuth hides the credential (" + mode.kind + ")", !describeAuth(mode).includes(SECRET));
  if (mode.kind === "unconfigured") ok("PLANTED the refusal reason hides it", !mode.reason.includes(SECRET));
}
ok("describeAuth names the project in Vertex mode, which is not secret",
   describeAuth(chooseAuth({ GOOGLE_GENAI_USE_VERTEXAI: "1", GOOGLE_CLOUD_PROJECT: "proj-42" })).includes("proj-42"));

console.log("\n" + (fail === 0 ? "── " + pass + "/" + pass + " passed" : "── " + fail + " FAILED of " + (pass + fail)));
process.exit(fail === 0 ? 0 : 1);
