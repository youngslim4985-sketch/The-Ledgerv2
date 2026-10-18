# The Ledger v2 — IBM Bob Hackathon Phase 1: Full Repository Assessment

**Assessment Date:** September 29, 2026 (Baseline commit `41339c6`)  
**Scope:** Read-only. No files written, no installs, no builds, no tests run.  
**Assessor:** IBM Bob  

---

## 1. Architecture Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│  THE LEDGER v2 — Full-Stack Architecture                                │
│                                                                         │
│  ┌────────── Frontend (React 19 + Vite SPA) ──────────────────────┐    │
│  │  src/App.tsx          ← root, tab router, cross-component state │    │
│  │  src/components/      ← 14 UI components                        │    │
│  │    ContractAnalyzer   ← upload, text-paste, sample pick, result │    │
│  │    AIAssistantDrawer  ← chat drawer → /api/ask-legal-assistant  │    │
│  │    RevenueWaterfall   ← interactive financial simulator         │    │
│  │    RightsGraph        ← preset-based node/edge visual           │    │
│  │    LearningHub        ← modules, lessons, quizzes, glossary     │    │
│  │    RepoExplorer       ← dev-mode doc/code tree (static data)    │    │
│  │    Header             ← tabs, dev-mode toggle, AI tutor btn     │    │
│  │    RiskCard, RiskSummary, ReconciliationBadge, ExportButton     │    │
│  │    AssumptionPanel, ContractStatus ← standalone; NOT wired in   │    │
│  │  src/data/            ← fully static: sampleContracts.ts,       │    │
│  │                          educationalContent.ts, repositoryData  │    │
│  │  src/billing/         ← 6 modules: client, checkout, stripe,    │    │
│  │                          subscriptions, entitlements, metering  │    │
│  │                          webhook-handler, entitlement-service   │    │
│  │                          ← NOT connected to UI in any tab       │    │
│  │  src/utils/pdfGenerator.ts   ← jsPDF client-side report         │    │
│  │  src/lib/formatCurrency.ts   ← cached Intl.NumberFormat         │    │
│  │  src/types.ts / types/ledger.ts  ← dual type system             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│              │ fetch /api/*                                             │
│  ┌────────── Backend (Express + tsx / esbuild) ────────────────────┐    │
│  │  server.ts  ← 1 file, 338 lines, all routes inline              │    │
│  │    GET  /api/health                                              │    │
│  │    POST /api/analyze-contract   ← Gemini or static fallback     │    │
│  │    POST /api/ask-legal-assistant← Gemini or hardcoded msg       │    │
│  │    POST /api/simulations/waterfall ← pure math, no AI           │    │
│  │    POST /api/stripe/create-checkout-session ← STUB              │    │
│  │    POST /api/stripe/webhook     ← STUB (no sig verification)    │    │
│  │  + Vite middleware in dev / static serve in prod                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│              │ generateContent()                                        │
│  ┌────────── Google Gemini AI ─────────────────────────────────────┐    │
│  │  Model: "gemini-3.6-flash" (unverified model name)              │    │
│  │  Auth:  GEMINI_API_KEY (env, injected by AI Studio)             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

**No database. No auth. No file storage. No session layer. No message queue. Single-process, single-file backend.**

---

## 2. Frontend

| Component | File | Notes |
|---|---|---|
| Root / Router | `src/App.tsx` | Tab-based SPA using `useState`. Cross-component state prop-drilled via callbacks. |
| Header + Nav | `src/components/Header.tsx` | 5 tabs; "Repo & Specs" gated by `isDevMode`. Mobile nav duplicated inline. |
| Contract Analyzer | `src/components/ContractAnalyzer.tsx` | 975+ line megacomponent; handles upload, text input, AI call, result rendering. |
| AI Drawer | `src/components/AIAssistantDrawer.tsx` | Full-screen modal chat; no message persistence; no history across sessions. |
| Revenue Waterfall | `src/components/RevenueWaterfall.tsx` | All math done client-side; backend `/api/simulations/waterfall` is NOT called. |
| Rights Graph | `src/components/RightsGraph.tsx` | Static preset data (4 deals); no dynamic graph from AI output. |
| Learning Hub | `src/components/LearningHub.tsx` | Static data modules + client-side quiz scoring. |
| Repo Explorer | `src/components/RepoExplorer.tsx` | Displays hardcoded `repositoryData.ts`; not live filesystem reads. |
| Design system stubs | `src/components/ContractStatus.tsx`, `RiskCard.tsx`, `RiskSummary.tsx`, `ReconciliationBadge.tsx`, `AssumptionPanel.tsx`, `ExportButton.tsx` | Well-typed, well-designed, but **none are used inside ContractAnalyzer**; ContractAnalyzer re-implements risk rendering inline. |

**Key frontend issues:**

- `ContractAnalyzer.tsx` is ~975 lines and mixes upload logic, AI call logic, and ALL rendering. No sub-components.
- The `RiskCard`, `RiskSummary`, `ContractStatus`, `AssumptionPanel`, `ExportButton`, and `ReconciliationBadge` components in `src/components/` exist but are **wired nowhere in the main flow** — they are dead library components.
- `RevenueWaterfall` duplicates the waterfall math that also exists in `server.ts:244-273`. Two implementations, neither wrong individually, but they diverge on producer points (client-side includes it; server-side endpoint does not). **Unverified whether results match.**
- Mobile nav in `Header.tsx` is a second complete copy of all tabs — any future tab addition requires two edits.
- No global state management (no Context, no Zustand, no Redux). State propagated by callbacks from `App.tsx`.
- `isDevMode` toggle exposes repo docs with zero authentication guard.

---

## 3. Backend / API Endpoints

All routes are in `server.ts`. There is no route file separation.

| Endpoint | Method | Auth | Status |
|---|---|---|---|
| `/api/health` | GET | None | Complete |
| `/api/analyze-contract` | POST | None | Functional (Gemini or static fallback) |
| `/api/ask-legal-assistant` | POST | None | Functional (Gemini or hardcoded fallback) |
| `/api/simulations/waterfall` | POST | None | Functional (pure math) |
| `/api/stripe/create-checkout-session` | POST | None | **STUB** — no Stripe SDK call |
| `/api/stripe/webhook` | POST | None | **STUB** — no signature verification |

**Critical issues:**

- **No authentication middleware on any endpoint.** Any request from anywhere can trigger AI analyses, costing real API credits.
- **No rate limiting.** The `/api/analyze-contract` endpoint can be called without limit; a single bad actor can drain the Gemini API key.
- **No request body size enforcement** beyond the default `10mb` JSON limit for uploaded contract text. PDF binary data is handled entirely client-side (see Section 4).
- **Wrong model name:** `server.ts:99` specifies `"gemini-3.6-flash"` — this model identifier does not match any published Google Gemini model name at the time of this assessment. The correct identifiers are `"gemini-1.5-flash"` or `"gemini-2.0-flash"`. **This will throw a runtime error when AI is invoked unless the API is lenient about model names.** — **UNVERIFIED** (cannot call the API in read-only mode).
- The `/api/stripe/create-checkout-session` endpoint at `server.ts:276-301` checks for `STRIPE_SECRET_KEY` in the environment but then returns a mock session ID regardless (the `try` block after the key check does NOT invoke the Stripe SDK — there is no `stripe` import anywhere in the file). Any user completing checkout will get a fake session.
- The `/api/stripe/webhook` endpoint at `server.ts:304-313` only logs "Verifying…" — no actual `stripe.webhooks.constructEvent()` call is made.

---

## 4. Contract Upload and Analysis Data Flow

```
User uploads PDF/DOCX/TXT
         │
         ▼
handleFileUpload()  ← ContractAnalyzer.tsx:168
         │
         ├── if file.type includes "text" / .txt
         │     FileReader.readAsText()
         │     → if extracted text > 50 chars: use real text
         │     → else: hardcoded fallback string (ContractAnalyzer.tsx:194)
         │
         └── if PDF / DOCX / anything else
               setTimeout 300ms
               → hardcoded simulated text (ContractAnalyzer.tsx:206)
               ← NO REAL PDF EXTRACTION EXISTS
         │
         ▼
handleRunAIAnalysis(text)  ← ContractAnalyzer.tsx:131
         │
         POST /api/analyze-contract
         { contractText, dealType, customPrompt }
         │
         ▼ server.ts:36
         getGeminiClient()
         │
         ├── if no GEMINI_API_KEY → return static hardcoded JSON (server.ts:48-89)
         │
         └── else → ai.models.generateContent(model: "gemini-3.6-flash", ...)
                     → JSON.parse(response.text)
                     → res.json(result)
         │
         ▼
setAnalysis(result) → renders in ContractAnalyzer.tsx
```

**Key gaps in this flow:**

1. **PDF files are never actually read.** Any `.pdf` or `.docx` upload silently falls back to a hardcoded generic contract text at `ContractAnalyzer.tsx:206`. The upload progress bar animates to 100% giving false confidence.
2. **The AI receives fabricated text for non-TXT uploads** — the generated "analysis" describes the hardcoded text, not the actual uploaded document.
3. **No server-side file upload endpoint.** The file never leaves the browser. This eliminates any server-side virus scanning, MIME validation, or size enforcement.
4. **No AI response validation.** If Gemini returns malformed JSON or a partial response, `JSON.parse(resultText)` at `server.ts:206` will throw and return a 500. There is no schema validation or field-level fallback.
5. **No persistence.** Analyses exist only in React `useState`; closing the browser loses everything.
6. The "Recent Documents" panel shows hardcoded documents (`ContractAnalyzer.tsx:40-73`) with fake timestamps and fake file sizes. Uploading adds to this in-memory list, but it resets on page reload.

---

## 5. AI Integrations

| Integration | Location | Model | Notes |
|---|---|---|---|
| Contract Analysis | `server.ts:98` | `"gemini-3.6-flash"` | Structured JSON output with `responseSchema`. **Model name unverified.** |
| AI Q&A Chat | `server.ts:229` | `"gemini-3.6-flash"` | Free-text Markdown response. No conversation history passed. |
| Fallback (no key) | `server.ts:48` | None | Hardcoded static JSON returned for analyze-contract. |
| Fallback (no key) | `server.ts:224` | None | Hardcoded string returned for ask-legal-assistant. |

`@google/genai` v2.4.0 is used (`package.json:13`). The `httpOptions.headers["User-Agent": "aistudio-build"]` injection at `server.ts:23` is an IBM AI Studio runtime signal.

**AI chat has no conversation history.** Each call to `/api/ask-legal-assistant` passes only the current question and optionally `contractContext` (which `AIAssistantDrawer` never actually sends — the body only has `question` at `AIAssistantDrawer.tsx:33`). The AI cannot reference prior turns in the conversation.

**No AI output validation.** Required fields from the schema (`title`, `riskScore`, `summary`, `plainEnglishTranslation`, `redFlags`, `questionsForAttorney`) are marked required in the Gemini schema but not validated in application code before rendering.

---

## 6. Dependencies

### Runtime (`package.json`)

| Package | Version | Purpose |
|---|---|---|
| `react` / `react-dom` | `^19.0.1` | UI framework |
| `@google/genai` | `^2.4.0` | Gemini AI SDK |
| `express` | `^4.21.2` | HTTP server |
| `vite` | `^6.2.3` | Dev server + bundler |
| `tailwindcss` | `^4.1.14` | Styling (v4, vite plugin) |
| `@tailwindcss/vite` | `^4.1.14` | Tailwind v4 Vite integration |
| `lucide-react` | `^0.546.0` | Icons |
| `motion` | `^12.23.24` | Framer Motion v12 (rebranded) |
| `recharts` | `^3.10.1` | Charts |
| `react-markdown` | `^10.1.0` | Markdown rendering |
| `jspdf` | `^4.2.1` | PDF generation (client-side) |
| `dotenv` | `^17.2.3` | Env loading |

### Dev

| Package | Purpose |
|---|---|
| `typescript` ~5.8.2 | Type checking |
| `tsx` ^4.21.0 | TS execution in dev (`npm run dev`) |
| `esbuild` ^0.25.0 | Production server bundle |
| `@types/express` | Express types |
| `autoprefixer` | PostCSS (imported but Tailwind v4 does not require it — likely leftover) |

**Observations:**

- **No `stripe` npm package** — despite extensive billing code. The Stripe checkout/webhook code in `server.ts` is entirely a stub.
- **No `pdf-parse`, `pdfjs-dist`, `mammoth`, or any PDF/DOCX extraction library** — confirms the fake PDF extraction finding.
- **No auth library** (`passport`, `jsonwebtoken`, `nextauth`, etc.) — confirms no authentication.
- **No database driver** (`pg`, `prisma`, `mongoose`, etc.) — confirms no persistence.
- **No test framework** (`vitest`, `jest`, `mocha`) — confirms zero automated tests.
- `autoprefixer` in devDependencies is leftover from Tailwind v3 era; Tailwind v4 uses its own PostCSS. It causes no harm but is dead weight.
- `bun.lock` exists alongside `package-lock.json` — two lockfiles from different package managers. This should be resolved to one.

---

## 7. Tests and Gaps

**Zero tests exist in this repository.** No test files, no test runner, no CI configuration.

From `docs/BASELINE-2026-09-29.md:366`: testing completion is estimated at 10% (manual/informal only).

**Coverage gaps by priority:**

| Gap | Severity |
|---|---|
| Revenue waterfall math (two implementations exist) | Critical |
| AI fallback JSON structure validation | Critical |
| Risk score classification thresholds | High |
| PDF extraction fallback behavior | High |
| `/api/analyze-contract` contract text injection (prompt injection guard) | High |
| `/api/stripe/webhook` signature verification | High |
| `formatCurrency()` edge cases (NaN, null, undefined, negative) | Medium |
| Entitlement resolution logic | Medium |
| Usage metering `localStorage` reset logic | Medium |
| Cross-user data isolation (no auth = impossible to test today) | Critical (blocked) |

---

## 8. Error Handling

| Location | Pattern | Quality |
|---|---|---|
| `server.ts:208` | `catch(err) → res.status(500).json({error: err.message})` | Bare — leaks stack/model errors to client |
| `server.ts:239` | Same pattern | Same issue |
| `ContractAnalyzer.tsx:159` | `catch(err) → console.error()` — **no UI error state** | Silent failure; user sees nothing |
| `AIAssistantDrawer.tsx:44` | `catch → hardcoded offline message` | Graceful, but misleads user (looks intentional) |
| `formatCurrency.ts:33` | `try/catch with console.warn + fallback` | Good pattern |
| `usage-metering/index.ts:11` | `catch → console.error` + silent return | Acceptable for localStorage errors |
| `server.ts:206` | `JSON.parse(response.text)` — **no try/catch** | **Bug: will throw unhandled 500 on malformed AI response** |

**Critical gaps:**

- The `JSON.parse` at `server.ts:206` is **outside** the `try/catch` block that wraps the Gemini call. If Gemini returns non-JSON text (e.g., a content safety refusal or partial response), the server will throw an unhandled exception.
- `ContractAnalyzer.tsx:handleRunAIAnalysis` catches errors but shows no error state to the user — the UI silently remains on the last known analysis.
- No user-visible error state for upload failures, network failures, or Gemini failures in the main analyzer UI.
- Server error responses include `err.message` directly — this can expose internal model names, API key validation messages, or library stack traces to the browser.

---

## 9. Security / Config

| Issue | Location | Severity |
|---|---|---|
| No authentication on any API endpoint | `server.ts` (all routes) | Critical |
| No rate limiting | `server.ts` | Critical |
| Gemini API key consumed on every unauthenticated request | `server.ts:16` | Critical |
| Stripe webhook — no signature verification | `server.ts:304` | Critical |
| Wrong Gemini model name `"gemini-3.6-flash"` causes runtime failure | `server.ts:99,229` | Critical |
| `err.message` leaked in 500 responses | `server.ts:209,239` | High |
| `JSON.parse` outside try/catch throws unhandled 500 | `server.ts:206` | High |
| Usage metering in `localStorage` (bypassed by clearing storage) | `src/billing/usage-metering/index.ts` | High |
| Entitlement checks are client-side only; server never enforces tier | `src/billing/entitlement-service/index.ts` | High |
| No CORS config | `server.ts` | Medium |
| No Helmet.js or HTTP security headers | `server.ts` | Medium |
| `isDevMode` has no server-side gate — dev docs purely client-toggled | `src/App.tsx:22`, `src/components/Header.tsx:108` | Medium |
| `bun.lock` + `package-lock.json` co-exist (supply chain ambiguity) | root | Medium |
| `APP_URL` and `STRIPE_*` are blank in `.env.example` | `.env.example` | Low (documentation) |
| Tailwind v4 via `@tailwindcss/vite` — newer, less battle-tested | `vite.config.ts:2` | Low |

The footer in `src/App.tsx:132` displays "Security Baseline Active" — this label is cosmetic only and reflects no real runtime security controls.

---

## 10. Coupling and Duplication

### Duplications

| Duplication | Files | Impact |
|---|---|---|
| Waterfall math computed in two places | `src/components/RevenueWaterfall.tsx:51-83` and `server.ts:245-272` | Frontend result diverges from backend (producer points in frontend only). Could mislead users. |
| Risk badge logic duplicated | `src/components/ContractAnalyzer.tsx:292-297` AND `RiskSummary.tsx` / `RiskCard.tsx` | Dead components exist as clean versions; ContractAnalyzer uses its own inline version. |
| Mobile nav is a complete copy of desktop nav | `src/components/Header.tsx:171-213` | Any tab change requires two edits. |
| Two type files with overlapping concerns | `src/types.ts` re-exports `src/types/ledger.ts` | Acceptable as pattern, but `ledger.ts` types are used almost nowhere in the main UI. |

### Coupling Issues

| Issue | Location |
|---|---|
| `ContractAnalyzer` is ~975 lines and owns: upload state, file reading, AI invocation, analysis display, sample management, recent docs, export logic, PDF generation call, navigation callbacks | `src/components/ContractAnalyzer.tsx` |
| `RightsGraph` is entirely disconnected from AI analysis output — selecting a sample contract does NOT update the rights graph | `src/App.tsx:47`, `src/components/RightsGraph.tsx` |
| `RevenueWaterfall` accepts `initialEstimates` from AI output but calculates everything locally; the backend waterfall endpoint is never called from the UI | `src/components/RevenueWaterfall.tsx:37` |
| `billing/` modules import `localStorage` directly — impossible to run server-side | `src/billing/usage-metering/index.ts:7` |
| `billing/stripe/index.ts` references `window.location.href` directly — server-side incompatible | `src/billing/stripe/index.ts:15` |

---

## 11. Feature Status

| Feature | Status | Evidence |
|---|---|---|
| Contract text input + sample selection | Complete | `ContractAnalyzer.tsx:118-125` |
| AI contract analysis (Gemini) | Functional (model name may be wrong) | `server.ts:36-211` |
| AI fallback (no API key) | Complete | `server.ts:48-89` |
| Risk scoring display | Complete | `ContractAnalyzer.tsx:292-299` |
| Key clauses accordion | Complete | `ContractAnalyzer.tsx:664-742` |
| PDF report export | Functional | `src/utils/pdfGenerator.ts` — fully implemented |
| JSON export | Complete | `ContractAnalyzer.tsx:272-281` |
| Copy / share analysis | Complete (copies URL, not analysis content) | `ContractAnalyzer.tsx:253-257` |
| Revenue Waterfall simulator | Complete (client-side) | `src/components/RevenueWaterfall.tsx` |
| Rights Graph (preset) | Complete (static presets only) | `src/components/RightsGraph.tsx` |
| Learning Hub (modules + quiz) | Functional | `src/components/LearningHub.tsx` + `src/data/educationalContent.ts` |
| AI chat assistant | Functional (no history) | `src/components/AIAssistantDrawer.tsx` |
| Real PDF/DOCX extraction | **Broken / Mocked** | `ContractAnalyzer.tsx:200-213` — hardcoded fallback |
| DOCX parsing | **Not Implemented** | No library, no server route |
| Contract persistence / history | **Not Implemented** | No DB; localStorage only for runtime recent-docs list |
| Authentication / user accounts | **Not Implemented** | No auth anywhere |
| Stripe Checkout | **Stub** | `server.ts:276-301` — no Stripe SDK used |
| Stripe Webhooks | **Stub** | `server.ts:304-313` — no verification |
| Subscription enforcement | **Not Connected** | Billing module exists but is never called from UI or API routes |
| Rights Graph linked to AI output | **Partial** | Navigation callback exists but graph shows preset, not analysis data |
| Waterfall linked to AI output | **Partial** | `initialEstimates` passed, but graph recalculates client-side |
| Mobile navigation | **Partial** | Second nav rendered but no hamburger menu for small screens |
| Dev Mode repo explorer | Complete (static data) | `src/components/RepoExplorer.tsx` |
| `ContractStatus` component | **Not Wired** | Built, typed, not used in main flow |
| `AssumptionPanel` component | **Not Wired** | Built, typed, not used |
| `ExportButton` component | **Not Wired** | Built, typed, not used |
| AMD ROCm / PyTorch GPU | **Not Present** | README claims this; zero GPU code or Python anywhere in repository |

---

## 12. README Claims vs Actual Code

| README Claim | Reality |
|---|---|
| "PDF contract upload" | **Partially false.** PDFs are accepted by the file input but their binary content is never parsed. A hardcoded placeholder text is sent to the AI instead. |
| "AI-powered clause analysis" | **True** — when `GEMINI_API_KEY` is set and the model name resolves correctly. |
| "AMD ROCm / PyTorch GPU acceleration (Hackathon Edition)" | **False.** No Python, no PyTorch, no ROCm code exists anywhere in the repository. This appears to be aspirational or incorrectly attributed. |
| "Revenue and royalty analysis" | **Mostly true** — waterfall simulator works well client-side. |
| "Interactive dashboard" | **True** — multi-tab SPA with working interactions. |
| "Modern responsive UI" | **Mostly true** — mobile nav exists; layout is responsive. Full mobile hamburger menu is absent. |
| Tech Stack: "React, TypeScript, Vite, Tailwind CSS" | **True.** |
| Vercel live demo link | **Unverified** — cannot test in read-only assessment. |

---

## 13. Modernization Opportunities (Ranked)

### Critical

**1. Fix the Gemini model name**
`server.ts:99,229` — The model `"gemini-3.6-flash"` does not exist. All AI analysis in production will fail at runtime. Correct to `"gemini-2.0-flash-exp"` or `"gemini-1.5-flash"` (confirm with Google AI release notes).

**2. Implement real PDF/DOCX text extraction**
PDF files silently fall back to hardcoded text. Users uploading real contracts receive AI analysis of fake content. This is the product's core value proposition and is currently broken for all non-TXT uploads. Recommended: add `multer` file upload endpoint to `server.ts`; use `pdf-parse` (PDF) and `mammoth` (DOCX) server-side.

**3. Wrap `JSON.parse(response.text)` in a try/catch**
`server.ts:206` — One-line fix that prevents unhandled exceptions from crashing the analyze endpoint when Gemini returns non-JSON.

**4. Add rate limiting to AI endpoints**
`server.ts:36,215` — Every unauthenticated request triggers a paid Gemini API call. Use `express-rate-limit` with a per-IP window.

**5. Implement authentication**
No user accounts, sessions, or protected routes exist. This is a P0 production blocker per `docs/BASELINE-2026-09-29.md:289`.

### High

**6. Complete Stripe Checkout**
`server.ts:276-301` — Install the `stripe` npm package. Replace the stub with real `stripe.checkout.sessions.create()`. Implement `stripe.webhooks.constructEvent()` signature verification in the webhook route.

**7. Move entitlement enforcement server-side**
`EntitlementService` and usage metering use `localStorage` — easily bypassed. All gating must happen in Express middleware before AI calls are made.

**8. Break up `ContractAnalyzer.tsx`**
`src/components/ContractAnalyzer.tsx` — 975+ lines in one component with multiple distinct responsibilities. Extract: `FileUploadZone`, `AnalysisResultView`, `SampleContractPicker`, `RecentDocumentList`. This is also blocking the use of the already-built `RiskCard`, `RiskSummary`, `ContractStatus`, and `AssumptionPanel` components.

**9. Wire the existing design-system components into ContractAnalyzer**
`RiskCard`, `RiskSummary`, `ContractStatus`, `AssumptionPanel`, and `ExportButton` are fully built but completely unused. Using them would eliminate approximately 200 lines of duplicated inline rendering from `ContractAnalyzer.tsx`.

**10. Add a persistent database**
PostgreSQL + Prisma recommended. No analysis, user, or subscription data survives a page reload. Required for any commercial use case.

### Medium

**11. Consolidate waterfall math to one source of truth**
The client-side waterfall in `RevenueWaterfall.tsx:51-83` and the server-side calculation in `server.ts:245-272` diverge on producer points. Either use the server endpoint in the frontend, or delete the server endpoint if it is unused.

**12. Fix `AIAssistantDrawer` to send `contractContext`**
`AIAssistantDrawer.tsx:33` — The `/api/ask-legal-assistant` endpoint accepts `contractContext` but the drawer never sends it. The AI cannot contextualize answers to the specific open contract.

**13. Add HTTP security headers**
Helmet.js recommended. No CORS config, no `X-Frame-Options`, no `Content-Security-Policy`, no `X-Content-Type-Options`.

**14. Add AI output schema validation**
Validate Gemini responses against the `ContractAnalysis` interface before rendering. Use `zod` or manual field checks. Guard against `undefined` fields that cause silent rendering gaps.

**15. Remove `autoprefixer` dead dependency and resolve dual lockfiles**
`bun.lock` + `package-lock.json` both exist. Pick one package manager and delete the other lockfile.

**16. Add error UI state in `ContractAnalyzer`**
`ContractAnalyzer.tsx:159` — Currently catches errors silently. Show a user-visible error message when AI analysis fails.

### Low

**17. Implement the mobile hamburger menu**
Current mobile layout renders a horizontal scrolling tab bar. At small widths this overflows. Add a proper hamburger + drawer.

**18. Link Rights Graph to AI output**
`src/components/RightsGraph.tsx` — When an AI analysis returns `rightsGraph.nodes`, the Rights Graph tab should display it. Currently, switching to Rights Graph always shows the hardcoded presets.

**19. Add conversation history to AI chat**
`src/components/AIAssistantDrawer.tsx` — Pass the full message history to Gemini so the AI can reference prior turns in the session.

**20. Add automated tests**
Vitest recommended for this stack. Zero tests exist. Start with `calculateWaterfall()`, `resolveEntitlements()`, `formatCurrency()`, and the `/api/health` endpoint.

---

## 14. Proposed Backlog

Listed in execution order. Items are independent unless noted.

### P0 — Production Blockers (must ship before real users)

```
P0-1   Fix Gemini model name "gemini-3.6-flash" → correct model identifier
P0-2   Wrap JSON.parse(response.text) in try/catch in server.ts (1-line fix)
P0-3   Add express-rate-limit to /api/analyze-contract and /api/ask-legal-assistant
P0-4   Implement real PDF text extraction (multer + pdf-parse, server-side)
P0-5   Implement real DOCX text extraction (multer + mammoth, server-side)
P0-6   Add user authentication (JWT or session; recommend Lucia or Passport.js)
P0-7   Add persistent database + schema (users, contracts, analyses, subscriptions)
P0-8   Install stripe npm package; implement real checkout session creation
P0-9   Implement stripe.webhooks.constructEvent() signature verification
P0-10  Move entitlement/quota enforcement into Express middleware (server-side)
P0-11  Add HTTP security headers (Helmet.js)
P0-12  Add CORS policy to server.ts
```

### P1 — Product Hardening

```
P1-1   Refactor ContractAnalyzer.tsx: extract FileUploadZone, AnalysisResultView,
         SampleContractPicker, RecentDocumentList
P1-2   Wire existing RiskCard, RiskSummary, ContractStatus, AssumptionPanel,
         ExportButton into the refactored ContractAnalyzer flow
P1-3   Add AI response validation with zod before rendering
P1-4   Add user-visible error state when AI analysis fails
P1-5   Consolidate waterfall math (pick one source; delete the other)
P1-6   Send contractContext from AIAssistantDrawer to /api/ask-legal-assistant
P1-7   Add contract history view (requires P0-7)
P1-8   Persist analyses to DB after AI returns valid result (requires P0-6, P0-7)
P1-9   Add subscription management UI (requires P0-8, P0-9)
P1-10  Add usage metering server-side (replace localStorage metering)
```

### P2 — Reliability and Testing

```
P2-1   Add Vitest; write unit tests for calculateWaterfall(), resolveEntitlements(),
         formatCurrency(), buildRiskExportModel()
P2-2   Write API integration tests for all 6 /api/* routes
P2-3   Write auth tests (requires P0-6)
P2-4   Write cross-user isolation tests (requires P0-6, P0-7)
P2-5   Write Stripe webhook tests (requires P0-8, P0-9)
P2-6   Validate TypeScript via tsc --noEmit in CI
P2-7   Set up basic CI (GitHub Actions: lint, typecheck, test on PR)
```

### P3 — Frontend Polish

```
P3-1   Implement mobile hamburger navigation
P3-2   Link Rights Graph tab to AI analysis output (dynamic graph)
P3-3   Pass AI-derived conversation context into AIAssistantDrawer
P3-4   Add loading/empty/error states consistently across all tabs
P3-5   Accessibility audit (keyboard nav, ARIA labels, focus rings)
P3-6   Resolve dual lockfiles: pick npm OR bun, delete the other
P3-7   Remove dead autoprefixer devDependency
P3-8   Remove hardcoded "Security Baseline Active" cosmetic label or
          back it with a real runtime check
```

---

*End of Phase 1 Report. No files other than this document were written, modified, or executed.*
