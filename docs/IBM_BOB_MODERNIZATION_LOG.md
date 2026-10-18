# IBM Bob Modernization Log

## Entry 1: Baseline freeze (2026-09-29)
- Area: Repository
- Before: Existing Ledger v2 app, no frozen reference
- Action: Tagged pre-bob-baseline-2026-09-29 at commit 41339c6; added docs/BASELINE-2026-09-29.md (09751ab); created branch bob/ledger-production-readiness
- Verification: Tag and branch pushed to GitHub
- Owner: Terrance

## Entry 2: Bob Phase 1 read-only assessment (2026-10-03)
- Area: Whole repository
- Bob task: Read-only audit (architecture, API, AI flow, security, tests, README claims, ranked backlog)
- Process note: A first run happened in a different repo (The-Ledger-) and wrote a file despite a no-write instruction. Caught on review; that output was discarded. The audit was re-run in The-Ledgerv2, which wrote nothing until one explicitly authorized write of the report.
- Output: docs/IBM_BOB_PHASE1_ASSESSMENT.md, committed unedited (7c9423d)
- Owner: Terrance

## Entry 3: Human verification of Bob's findings (2026-10-03)
- Method: grep/sed checks against server.ts, ContractAnalyzer.tsx, git ls-files, plus Google's published model list
- Confirmed: Real PDF extraction does not exist; non-text uploads get canned contract text (ContractAnalyzer.tsx). Server returns err.message to the browser. No stripe package in package.json or server.ts.
- Incorrect: "gemini-3.6-flash is not a real model" (it is listed as a current model; Bob's suggested replacements are shut down or older). "JSON.parse is outside the try/catch" (it is inside). "Two lockfiles in the repo" (only bun.lock is tracked; package-lock.json came from a local npm install).
- Still unverified: Stripe stub details (server.ts 276-313); waterfall math divergence between client and server
- Human decision: Do not change the model name. Do not accept Bob's backlog as written. Sprint 1 scope pending team review.

## Entry 4: Ticket 1 plan, real PDF extraction (2026-10-03)
- Bob task: Plan-only comparison of client-side vs server-side extraction. No files written.
- Bob finding: Recommended client-side (pdfjs-dist, plus mammoth for DOCX). Cited ContractAnalyzer.tsx 205-210 (fake text) and server.ts (only checks contractText is a non-empty string).
- Human review: Agree with client-side. Bob again called gemini-3.6-flash an unknown model; Google lists it as current (second instance of the same error). Bob's claim that the document never leaves the browser is only true of the raw PDF: extracted text still goes to the server and to Gemini. Bob omitted the Vite worker configuration pdfjs-dist needs, and mammoth does not handle legacy .doc.
- Amendments for implementation: server-side cap on contractText length; replace fake-text fallbacks with visible errors; decide DOCX scope; resolve bun vs npm lockfile first.
- Status: Awaiting team approval. Branch: bob/pdf-extraction

## Entry 5: Independent verification of Ticket 1, and one defect found (2026-10-05, revised 2026-10-11)
- Area: Upload refusal path and results rendering. `src/components/ContractAnalyzer.tsx`, new `src/lib/uploadDecision.ts`
- Bob task: None. This slice used no IBM Bob. It was done with targeted reads of the implementation, a new test suite, and deliberately planted defects to prove the suite can fail. Recorded so the log does not imply Bob coverage this slice does not have.
- Method: Read the refusal path against its specification, then wrote the rules out as pure functions so they could be exercised without a DOM, then planted a defect against each assertion and required the suite to go red before trusting it green.
- Confirmed: Every validation rule behaves as specified. Unsupported file type, the 10 MB cap, the `%PDF-` magic-byte check, scanned-PDF detection, password-protected PDFs and corrupt files all refuse and return without analysing.
- Defect found: The refusal is correct and the results panel renders anyway. `analysis` is initialised to the default sample's analysis, so a refused upload still displays a full risk score and clause breakdown. An artist who uploads a scanned 360 deal is correctly told "No extractable text found" and is shown, directly beneath that message, the analysis of a sample contract they never uploaded. (As observed, the default sample was the Executive Employment Agreement, so an employment analysis appeared beneath a refused music contract. The default is the Major Label 360 Recording Agreement as of `DEFAULT_SAMPLE` in `src/data/sampleContracts.ts`; that changes which contract appears, not the defect or the fix.)
- Severity note: This is the same shape as the canned-text defect Ticket 1 was opened to remove, one layer up. The first version was a sentence the product invented. This version is a real analysis of the wrong contract, which is harder to spot and worse to act on.
- Fix: `mayShowAnalysis()` in `src/lib/uploadDecision.ts`, applied as a gate on the results section. Selecting a sample contract resets the gate, so samples render exactly as before.
- Correction, 2026-10-12: this entry first said the rules, thresholds, messages and their order were "lifted out of the async handler unchanged". That was overstated. Only `judgeText` and `mayShowAnalysis` were wired into the component; `preflight`, `checkMagic` and `judgeError` were copied, with the inline originals left in place. Entry 8 records the finding and the fix.
- Verification: `src/lib/uploadDecision.test.ts`, 25 cases, no new dependency, runs under `tsx`. Plant-proven: with the refusal threshold inverted so short text is accepted, the suite fails rather than passing quietly. `tsc --noEmit` clean.
- Still open, not fixed here: The 50-character threshold is a judgement call, not a measurement. A 49-character PDF is reported as a scan. Upload progress is still waypoints (`setUploadProgress(10)`, `(40)`, `(100)`) rather than real progress.
- Owner: James / Zealous Mirror. Branch `james/ticket1-verification`, rebased onto `bob/pdf-extraction` @ 4b3b4b5. Commits 7c25de7, 9f85035. Full detail in `docs/TICKET-1-VERIFICATION.md`.

## Entry 6: Ticket 2 review, pinning what the validator accepts (2026-10-11)
- Area: AI response validation, the shared types, and the artist-facing PDF export. `src/lib/validateAnalysis.ts`, `src/types.ts`, `src/utils/pdfGenerator.ts`
- Bob task: None, as Entry 5.
- Method: Wrote a 22-case suite pinning the validator's current behaviour before changing anything, so any change would be visible as a diff in behaviour rather than an opinion. Added a source check over the components themselves, not only over runtime values.
- Confirmed: The safer Gemini JSON parsing and the provider-error handling behave as described. A missing AI configuration returns 503. Provider error details no longer reach the browser.
- Defect found: `dealType`, `keyTerms` and `fairTerms` were declared required on the analysis type but were optional in practice, because the validator accepted responses that omitted them. A response missing `dealType` printed the literal string `undefined` into the artist's downloaded PDF, as "Category / Deal Type: undefined".
- Fix: The three fields are optional in `src/types.ts`, which matches what the validator actually accepts. `DEAL_TYPE_UNKNOWN = "Not identified"` is used at the display sites in `ContractAnalyzer.tsx`, `LedgerPage.tsx` and `utils/pdfGenerator.ts`. The validator no longer rejects a response that omits them, so a usable analysis is degraded rather than thrown away.
- Verification: 22 of 22 pass, including a source check asserting that every read of `analysis.dealType` is guarded. That check is what stops a future edit quietly reintroducing the same defect at a new display site. `npm test` (21 validator cases) and `tsc --noEmit` both clean, production build clean.
- Owner: James / Zealous Mirror. Branch `james/ticket2-verification`, based on `bob/ticket-2` @ f28a73d. Commits 2745031, 977a6ab, 3f04efc.

## Entry 7: strictNullChecks enabled, and a correction to the stated reason (2026-10-11)
- Area: `tsconfig.json`
- Measured before deciding: Full `--strict` produces exactly 2 errors in this repo and neither is a real defect (a recharts `Formatter` mismatch and a missing `@types/react-dom`). `--strictNullChecks` alone produces zero. It was free, so it is on.
- Correction: The first version of this justification claimed the flag catches the `undefined` defect in Entry 6. That was wrong. Three plants were run against this exact config: `${analysis.dealType}` in a template literal is NOT caught; passing it into a function typed `(s: string)` IS caught as TS2345; `{analysis.dealType}` as a JSX child is NOT caught. `undefined` is a legal interpolation and a legal JSX child, so the two paths that actually reach a human eye are invisible to the compiler. The PDF that printed "Category / Deal Type: undefined" would still compile clean today.
- Human decision: Keep the compiler flag and keep the source check in `validateAnalysis.review.test.ts`. Neither is sufficient alone, and the comment in `tsconfig.json` records which one covers what so the next person does not repeat the wrong assumption.
- Owner: James / Zealous Mirror. Commit 3f04efc.

## Entry 8: the extracted rules were not wired in (2026-10-12)
- Area: `src/components/ContractAnalyzer.tsx`, `src/lib/uploadDecision.ts`
- Bob task: None.
- Method: Found while rehearsing the demo video. Six upload fixtures were built (a text contract, an image-only scan, a 13.3 MB file, a file with bad magic bytes, a corrupt file, and a PNG) and fed to the exported decision functions directly rather than clicked through the interface.
- Defect found: `preflight`, `checkMagic` and `judgeError` were exported and tested but never called. The component held its own inline copies, so five refusal messages existed in two places and roughly eleven of the 25 cases in `uploadDecision.test.ts` exercised a parallel implementation instead of the path a user takes. Editing the copy in the component would not have failed a single test.
- Why it matters: a test that cannot fail when the shipping code changes is not evidence. This is the same shape as the defect Entry 5 was opened to remove, and it was inside the fix for it.
- Fix: the component now calls all five helpers. Behaviour is unchanged by construction: `preflight` already reproduced the inline extension, DOCX and size logic exactly, `checkMagic` is the same strict compare against a five-byte slice, and `judgeError` carries the same two messages. No refusal message string remains duplicated in the component.
- Verification: a differential rather than an assertion. Planting a changed message in `uploadDecision.ts` alone reaches the built client bundle on the fixed branch, and reaches nothing on `james/ticket1-verification`. 25 of 25 pass, `tsc --noEmit` is clean, the production build is clean.
- Process note: the first attempt at that differential did not run. The plant used a shell-expanded variable, so nothing was substituted, and the check then printed a confident "not wired" against an unmodified file. A plant that does not plant is not a control, and what it prints is not a reading. The second attempt verified the plant was in place before building.
- Owner: James / Zealous Mirror. Branch `james/wire-upload-rules`, commit 65ac98d, based on `james/ticket1-verification` @ 9f85035.

## Note on scope of entries 5 to 8

Ticket 1's implementation and Ticket 2's AI-reliability work were Terrance's,
and whatever Bob did during them was not observed by the author of these three
entries. An entry describing Bob's role in that work belongs to whoever ran it.
Entries 5 to 8 cover independent verification only.

## Entry 9: the free tier is 20 analyses a day, and the app reports that as a crash (2026-10-13)
- Area: runtime quota against `generativelanguage.googleapis.com`, and the error path in `server.ts`.
- Bob task: None.
- Method: measured while filming the demo video, not read from documentation. The analysis endpoint first returned `503 UNAVAILABLE, high demand`, repeatedly. Six retries and then a longer retry loop produced the same answer, until the response changed to `429` carrying a `QuotaFailure` detail block.
- Finding: the limit is `GenerateRequestsPerDayPerProjectPerModel-FreeTier`, `quotaValue 20`, with `retryDelay 19839s`. **Twenty generate requests per day, per model, on the free tier.** The earlier `503 high demand` responses were the free tier throttling as it ran dry, not Google being busy. Two different status codes for one underlying condition, and the first one points away from the real cause.
- Why it matters for a judge: anyone who clones this repository, supplies their own free-tier key and tries the app gets twenty analyses and then failures. That is a property of the product as shipped, and it is not currently stated anywhere a user would look.
- Defect found, not fixed: the server wraps the upstream error in **HTTP 500** and passes Google's raw JSON through to the browser. So a user who has simply reached a daily limit is told the application broke, in Google's internal wording. The refusal itself is correct, it invents nothing, which is the behaviour Entry 5 was opened to enforce. What is wrong is the status code and the audience of the message. Proposed: map upstream `429` to a `429` with a plain sentence naming the daily limit, map upstream `503` to a `503`, and never forward the provider's error body.
- Deliberately not done: the quota is per model, so naming a different model would grant a fresh twenty immediately. Entry 3 records the decision not to change the model name, and a demo filmed against a model the shipping code does not call would not be a demo of this code.
- Process note: the author exhausted the day's twenty with retry loops, six attempts and then a forty attempt loop at thirty second intervals, before reading what the rate limits were. Retrying is the correct response to a `503` and the wrong response to a quota, and the two were indistinguishable from the status code alone. Read the limit before pointing a loop at it.
- Verification: the quota block was read from the API response itself, including `quotaId`, `quotaValue` and `retryDelay`. `gemini-3.6-flash` was separately confirmed present in the live model list for this key and declaring `generateContent`, so Entry 3's ruling stands and the model name is not the problem.
- Owner: James / Zealous Mirror. Branch `james/modernization-log`.
- **Fixed 2026-10-13, same day, branch `james/ai-error-status` commit `30aabd6`.** `classifyAiError` in `src/lib/aiError.ts` maps upstream `429` to `429`, `503` to `503`, `401` and `403` to `503` named as this application's own configuration problem, and anything unrecognised to `500`. The provider's wording is dropped on the way out and still written to the server log, where it is useful. `upstreamCode` reads a numeric status or parses the JSON body and returns null rather than matching on words, because a name test is one unlucky phrasing away from lying.
- Verification of the fix: 45 checks in `src/lib/aiError.test.ts`, built on the payload the SDK actually threw that day rather than an invented shape, asserting the status codes and the absence of seven provider phrases. Proven able to fail before being trusted: forwarding the provider message again turns four red, reporting a quota as `500` turns one red, reverting returns green. Then wired rather than merely exported, which is the failure Entry 8 records: against a live upstream failure the endpoint answered `503` with the new sentence and code `AI_SERVICE_UNAVAILABLE`, with none of quota, billing, RESOURCE_EXHAUSTED, high demand or googleapis in the body. That sentence exists only in `aiError.ts`, so the reply is the differential.
- Still open: the Stripe checkout catch forwards `err.message` the same way. It is not an AI path and was left alone rather than changed without a test.

## Entry 10: the organization forbids API keys, so the app had to learn a second way to authenticate (2026-10-13)
- Area: `server.ts` client construction, new `src/lib/aiAuth.ts`.
- Bob task: None.
- Method: measured while trying to move off the exhausted free tier, by signing into each account rather than reasoning about subscriptions.
- Finding, quoted from the console: **"API Keys are Disallowed. Your organization's security policy disallows API keys. Please use Application Default Credentials (ADC) instead."** The `ethicsgym.com` Workspace organization cannot issue an API key at all. Its AI Studio key list is empty for that reason, not because none was made.
- What this corrects: the assumption, held for several hours, that a Workspace or consumer subscription that includes Gemini would also include Gemini API quota. It does not. Workspace Gemini and consumer Plus are assistants inside Docs, Gmail and Drive. The API is metered by the Cloud project behind the credential, and Google's own quota id said `GenerateRequestsPerDayPerProjectPerModel-FreeTier` outright. A plan can be fully premium while the key is on the free tier.
- Two mechanisms, two products, stated because they are easy to conflate: an API key reaches `generativelanguage.googleapis.com`, which has the free tier. Application Default Credentials reach **Vertex AI**, which has **no free tier** and requires billing on the project. ADC removes the policy wall; it does not remove the payment.
- Fix: `chooseAuth` decides between them from the environment, and `server.ts` builds either client from that decision. 28 checks pin three properties: the flag is read the way a human writes it; a half-configured Vertex setup **refuses** rather than quietly using an API key that happens to be present; and nothing that gets logged contains the credential.
- Verification: proven able to fail before being trusted. Making the half-configured case fall back to the key turns 2 red, appending the key to `describeAuth` turns 1 red, reverting returns green. Then proven wired against the running server, not asserted: with the Vertex flag set, no project, and a valid key in the environment, the endpoint answers `503 AI_SERVICE_NOT_CONFIGURED` and does not fall back, which the previous code would have done.
- Process note: three of the hours spent on this went into probing Google error messages to infer which account owned the key, while the founder was signed into a second account at `/u/1/` that every check silently missed, because `myaccount.google.com` and the Cloud console both default to account index 0. Read the index before concluding anything about "the account". Separately, driving the browser pane repeatedly against Google tripped an abuse heuristic, "The request is suspicious", which is a cost of automating a signed-in session and a reason to hand the clicks back.
- Still open: no Cloud project exists to point ADC at, project creation was refused, and Vertex billing is unresolved. Branch `james/adc-auth`, commit `3f2f135`.
- Owner: James / Zealous Mirror.
