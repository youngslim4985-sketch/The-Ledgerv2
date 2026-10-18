# Pitch deck: outline, argument, and speaker notes

The deck itself is built and renders to PDF, which is what rule 6.3.4 asks for.
This file is its content in text, so the argument can be reviewed, corrected and
version-controlled without opening the deck, and so rule 6.3.1 is satisfied:
"The Team must save all submission items onto the GitHub Repo."

**Track:** Theme 2, Experienced Developers, Modernize What Matters. Its own
description is the closest available fit: "analyze and transform an existing or
legacy application without disrupting its core functionality", with "better test
coverage" and "modernization documentation" among its named use cases. **If the
team was registered under Theme 1, this needs changing on the cover.**

**Design:** Source Serif 4 over IBM Plex Sans. Ink navy `#121A2B`, warm paper
`#FAF8F4`, ochre accent `#B4762A`, slate-blue second accent `#2D5F8A`.

## Why the slides are in this order

The deck is sequenced against rule 10.2's weightings rather than against the
story we would tell by instinct.

| slides | criterion | weight |
|---|---|---|
| 2 Problem, 3 What it does | Innovation & Use Case Relevance | 30% |
| 4 Before Bob, 5 How we used Bob, 6 Where Bob was wrong | Tool Usage & Depth of Adoption | 30% |
| 7 Change one, 8 Change two, 9 Verification, 10 Evidence | Functionality & Technical Execution | 30% |
| 11 Learnings and next steps, 12 Close | Presentation & Clarity | 10% |

Slide 6 is the centrepiece. Two of the four criteria name Bob, so 40% of the
score is decided by what the deck and the video say about Bob, not by the code.

## The twelve slides

**1. Cover.** The Ledger. "Artists sign contracts they cannot read. The Ledger
reads them first, in plain language, before anyone signs." Track and team named.
*Notes: we did not start this during the hackathon, we modernized it, which is
exactly Theme 2. Fifteen seconds, then move.*

**2. The problem.** An artist is handed a contract, a deadline, and no lawyer.
Three cards: Ownership, Revenue, Duration.
*Notes: no invented statistics. The barrier is comprehension and timing, not
that every contract is predatory.*

**3. What The Ledger does.** Upload, Extract, Analyse, Explain. Closes on the
boundary: education, not legal advice, and the product says so to the artist.
*Notes: judges notice when a team knows what its tool is not.*

**4. What existed before Bob.** The baseline tag `pre-bob-baseline-2026-09-29`
at commit `41339c6`, and the defect at the centre of it: no PDF extraction at
all, with canned sample text substituted for a real document. Plus leaked
provider errors, no tests, README ahead of code.
*Notes: this slide earns the right to claim an improvement. Say the tag out
loud.*

**5. How we used Bob.** Audit, Verify, Plan, Build, each producing a committed
artefact. Two callouts: the `.bobignore` bounding what Bob may read, and the
early run that wrote a file despite a no-write instruction, which we caught on
review and discarded.
*Notes: the second callout is the one to say out loud. Bob broke a constraint,
we noticed because we were checking, and we threw the work away. That is what
depth of adoption looks like.*

**6. Where Bob was wrong.** Five claims that did not survive checking, as a
table of what Bob said, what we found, and the outcome: the model-does-not-exist
claim (twice), the JSON.parse placement, the lockfile count, the overstated
privacy claim, and the incomplete library plan.
*Notes: the criterion asks whether Bob was core to the workflow, not whether Bob
was right. Five corrections in a written log prove we read its output instead of
pasting it.*

**7. Change one: real extraction.** The canned text is gone. Six refusals, each
with its own message. A server-side cap on contract text length, which was our
amendment rather than Bob's plan. The rules live in one module the component
calls, so each is testable without a browser.
*Notes: owner Terrance, with our amendment. The line that matters: when it
cannot read the document it says so.*

> **Corrected 2026-10-12.** This slide first said the rules were "lifted into
> pure functions". Three of the five had been copied rather than moved, with the
> inline originals still running, so the tests for them guarded nothing. Found
> while rehearsing the demo video and fixed on `james/wire-upload-rules`
> (`65ac98d`); recorded as Entry 8 of the modernization log. The 139 checks are
> unchanged in number and now exercise the path a user actually takes, which is
> the stronger claim. **The deck slide carries the corrected wording.**

**8. Change two: AI reliability.** Guarded parsing, provider errors no longer
reaching the browser, a 503 when the model is not configured, and a reply
missing optional detail degraded rather than discarded.
*Notes: degrade rather than discard is a product decision, worth naming as one.*

**9. Independent verification.** The four defects review found that neither Bob
nor the author caught: a refusal with a sample contract's analysis rendered
underneath it, and the word `undefined` printed into an artist's PDF.
*Notes: do not claim Bob found these. It did not.*

**10. The evidence.** 139 automated checks across six suites where the baseline
had none, 9 log entries, 5 Bob claims corrected, 4 defects found in review.
Every gate shown failing on a deliberately broken build before being trusted.
*Notes: the plant-proven line is the quality argument and the likeliest
technical question. The six suites are the upload rules, the share text, CI coverage, the validator review,
and the validator itself.*

**11. Learnings and next steps.** Learned: the dangerous failure is a plausible
answer, not a crash; Bob opened the work and people closed it; freeze first.
Next: calibrate the scan threshold against real documents, report honest upload
progress, add DOCX while refusing legacy .doc rather than guessing at it.

**12. Close.** "An artist should know what they are signing." Repo link, demo
video link, live demo link.

## Both placeholders are resolved, 2026-10-18

Both were separate required deliverables in their own right. Both now exist and
were verified rather than assumed.

- **Rule 6.3.5, the demo video** — https://youtu.be/BXjVQ60cC4I
  Public on the Zealous Mirror channel, 3:25. Confirmed by reading the live
  page back: `isPrivate: false`, `isUnlisted: false`, copyright checks complete
  with no issues.
- **Rule 6.3.6, the live working environment** — http://65.108.146.243/
  Served by nginx on a Hetzner VPS under systemd, with the app port closed to
  the internet so nginx is the only route in. Confirmed from outside the host:
  `/`, `/api/health`, `/api/rights` and `/api/waterfall` all return 200.

Both go on slide 12, and both are in the video's end card.

**One limit stated plainly:** the deployed service runs without AI credentials,
so `POST /api/analyze-contract` returns `503 AI_SERVICE_NOT_CONFIGURED`. The
live analysis shown in section 3 of the video was filmed against a development
build running on Vertex. Do not describe the deployed URL as performing live
analysis until a key is placed in the server environment.

## Numbers used, and where each came from

Nothing here is estimated. If a figure changes, change it in both the deck and
the video script.

| figure | source |
|---|---|
| 139 automated checks | re-measured on `james/integration` 2026-10-13 by running each suite: 35 `test:upload` + 10 `test:share` + 6 `test:ci` + 21 `test` (validator) + 22 `test:analysis` + 45 `test:aierror`. |
| 6 suites | the six `test` / `test:*` scripts in `package.json`, every one of which `ci.yml` runs. `test:ci` asserts that CI runs each, and it failed twice during the merge as new scripts arrived, which is how the gap was found. |
| 9 log entries | `docs/IBM_BOB_MODERNIZATION_LOG.md`, counted by `grep -c "^## Entry"` |
| 5 Bob claims corrected | log entries 3 and 4 |
| 4 defects found in review | log entries 5, 6, 8 and 9, counted by the `Defect found` line in each |
| 6 refusals | the upload rules in `src/lib/uploadDecision.ts` |

> **Re-derived 2026-10-13 against `james/integration`.** Nine branches were merged
> into one and every figure here was re-measured by running it, not carried over.
> Checks rose from 68 to 139 and suites from 3 to 6: `main` carried three suites
> the earlier count never included, and the AI error mapping added a sixth. The
> merge surfaced two further defects, both recorded, both now fixed: `main`'s
> component had never been hardened for `strictNullChecks`, and `ci.yml` was not
> running the newly arrived suites.

No adoption figures, user counts or performance numbers appear anywhere, because
we do not have any.
