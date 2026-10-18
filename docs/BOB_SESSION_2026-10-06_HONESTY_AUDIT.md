# IBM Bob session — honesty audit of the analysis flow

**Date:** 6 October 2026
**Operator:** James Victor (frontend / UX + verification)
**Client:** Bob Shell 2.0.5, Agent Mode, account `zealousmirror@ethicsgym.com`
**Cost:** **0.528 Bobcoins**, 39k of 270k context
**Branch:** `james/brand-board`
**Files changed by Bob:** none — it was asked to review, not edit

## The question put to Bob

> Review this app's upload to extraction to analysis flow. Find places where a
> user would be shown something FALSE or MISLEADING instead of an honest error.
> For each give file, line, what the user sees, and what it should do. Rank by
> how badly it misleads.

That framing was deliberate. The Ticket 1 fix had already found one instance of
this disease — a refused scan still rendering a full risk breakdown of a sample
Employment Agreement — and the open question was whether it was one bug or a
pattern. It is a pattern.

## What Bob returned, and what survived checking

**Every claim below was verified against the source by hand.** Bob is a hosted
model reading a codebase it has never seen; a finding is a lead until the line
is opened.

| # | Finding | Verified |
|---|---|---|
| 🔴 1 | AI analysis fails silently; stale sample analysis stays on screen | **yes** |
| 🔴 2 | "Encrypted & Private Storage" is claimed; documents are not | **yes** — `ContractAnalyzer.tsx:594` |
| 🔴 3 | With no API key the server returns a hard-coded analysis | **yes, and it is live** |
| 🟠 4 | Progress bar reaches "100%" independent of real progress | **yes** — `ContractAnalyzer.tsx:222,235` |
| 🟠 5 | "Recent Documents" are hard-coded, shown as if real | **yes** — `ContractAnalyzer.tsx:99,547` |
| 🟡 6 | "Share Analysis" copies a URL that shows the recipient the sample | **yes** |
| 🟡 7 | `gemini-3.6-flash` is not a real model name | **NO — Bob is wrong** |

### #3 is the serious one, and it is live right now

`server.ts:44` — when `GEMINI_API_KEY` is unset, `/api/analyze-contract` returns
a complete fabricated analysis: `riskScore: 72`, named red flags about Grant of
Rights and Cross-Collateralization, with explanations and questions to ask.

The server is honest in its payload. It sets `fallback: true` and says *"AI key
not set on environment"* in the summary.

**The client never reads `fallback`.** One grep across `src/` finds the word
only inside an unrelated `formatCurrency` warning. So the flag the server sets
to tell the truth is discarded, and the user is shown a risk score of 72 and
specific red flags about a contract that nothing read.

**There is no `.env` in this checkout.** Every analysis the running app performs
today is that hard-coded one. This is the Ticket 1 bug again, one layer deeper
and on the server side.

### #7 is a false positive, and it is worth recording why

Bob reasoned: `gemini-3.6-flash` is not a real model → the SDK throws → the
error is swallowed by #1 → the user sees the spinner vanish. The chain is sound
and the first link is false. **`gemini-3.6-flash` is a current Gemini Flash
model**, listed in Google's own model documentation.

Bob's training predates that model, so an unfamiliar name read as a typo. This
is the ordinary failure mode of asking any model about anything newer than
itself, and it is the reason each finding here was opened rather than relayed.
Six of seven stood up. Reporting seven would have been easier and wrong.

## What was done about them

All six verified findings are fixed, each with its own commit and its own
failing-first check.

| # | Fixed in | Guard |
|---|---|---|
| 1 | `fix #3` | the swallowed catch now reaches the artist, not the console |
| 2 | `fix #2 #5 #6` | the badge says what is true |
| 3 | `fix #3` | `judgeAnalysisResponse`, 9 checks |
| 4 | `fix #4` | `stageLabel` / `stagePercent`, 6 checks |
| 5 | `fix #2 #5 #6` | the list is empty and fills from real uploads |
| 6 | `fix #2 #5 #6` | `analysisToText`, 10 checks, one asserting it is not a URL |

45 checks across two suites, `npm run test:upload` and `npm run test:share`.
Each fix was proven to fail before it was trusted: disable the branch and the
suite goes red on a named check.

Fixing #1 was not separable from #3. A refusal that leaves the previous result
on screen is the same lie by a different route, so the catch had to be made
honest for #3's guarantee to hold at all.

## What this does not claim

Bob did not fix anything and did not write to the repository. It found them;
the repairs above are mine, and each one is checked.
