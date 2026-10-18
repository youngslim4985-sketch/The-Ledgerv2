# Demo video script, draft

**Hard limits from the rules.** Rule 6.3.5: pre-recorded, **no longer than
three (3) minutes**, **uploaded to YouTube**, link supplied with the submission.
Its stated brief is "the technical strengths, usability, and performance of the
solution". Rule 6.4 freezes everything at 23:59 ET on 18 October, so the upload
and the link have to exist before then, not the file alone.

**Budget.** 180 seconds, and the limit is a rule rather than a guideline. The
narration below is **393 words**. Timed across normal speaking paces:

| pace | runtime | verdict |
|---|---|---|
| 140 wpm, measured and careful | 168s | fits |
| 150 wpm, normal | 157s | fits |
| 160 wpm, brisk | 147s | fits |

It was cut to fit at **140 wpm**, not at 150, because a first draft of this
script came to 435 words and that ran **186 seconds** at the careful pace. A
narrator reading their own work reads slowly. If you still run long, cut from
section 5, never from sections 3 and 4.


## Before you record: measured 2026-10-13

Three of the seven sections cannot be filmed yet. Measured by running them, not
assumed.

| section | state | what it needs |
|---|---|---|
| 1 Hook | blocked | `GEMINI_API_KEY` in the shell that runs `npm run dev`. Without it the results panel correctly shows nothing, so there is no hook shot to take. |
| 2 Before | **ready** | the tag `pre-bob-baseline-2026-09-29` exists and the line is in the baseline file. Verified. |
| 3 Real extraction | blocked | the same key. This is the section the budget note says never to cut. |
| 4 Honest no | ready once the server is up | the refusal is decided in the browser, so it needs the app running but not the key. Film it in the same sitting as section 3 and in the same window, or the framing will not match. |
| 5 How Bob was used | **ready** | both documents exist on `james/modernization-log`. |
| 6 Verification | **ready** | all six suites now run in one checkout on `james/integration`. The two-branch workaround below is obsolete. |
| 7 Close | **shot 2026-10-18** | filmed against the live deployment at http://65.108.146.243/. Shows the app, the Rights Graph and the Revenue Waterfall, then the end card. |

The key is not something that can be set for you. It is a credential and it has
to go into the server's own environment by hand. There is no `.env` in the repo
today, only `.env.example` with a placeholder.

Screen recording on this machine works. `screencapture -v -R x,y,w,h out.mov`
records a region, and `-V <seconds>` caps the length.

---

## The script

### 1. Hook — 0:00 to 0:12
**On screen:** The Ledger open, a contract already loaded, results visible.

> An artist gets a contract, a deadline, and no lawyer. The Ledger reads it
> first and explains it in plain language. We spent three weeks making it stop
> guessing.

### 2. The before — 0:12 to 0:30
**On screen:** your editor, `src/components/ContractAnalyzer.tsx` at the
baseline, line 82 highlighted. Then the terminal showing the tag.

> Here is the version we started from, tagged before we touched it. One line:
> the results panel's analysis defaults to a sample contract. So when the app
> could not read your document, it showed you a confident reading of somebody
> else's.

**The two things to put on screen, nothing more:**

    const [analysis, setAnalysis] = useState<ContractAnalysis>(SAMPLE_CONTRACTS[0].analysis);

    git show pre-bob-baseline-2026-09-29 --stat

**Do not run the baseline app.** It ships only `bun.lock` and bun is not
installed on this machine, so standing it up is a detour that buys nothing. The
line of code and the tag prove the same point in twelve seconds.

### 3. Real extraction — 0:30 to 1:05
**On screen:** upload a real PDF. Let the extraction and analysis actually run.
Do not cut the wait; the wait is the performance claim.

> Now the same upload. A real PDF, parsed in the browser. Text comes out of the
> actual document, the clauses are identified, and each one is rated. The risky
> terms are named, with the question to put to a lawyer beside them. Nothing
> here is invented. If the model is not configured, the server answers with a
> 503 instead of failing further in.

### 4. The honest no — 1:05 to 1:35
**On screen:** upload a scanned PDF. Hold on the refusal. **Scroll down to show
there is nothing beneath it.** That empty space is the whole shot.

> The more important case is the one where it cannot help. A scanned contract
> has no extractable text. It says so, and it stops. There is no risk score
> underneath, no clause list, nothing borrowed from a sample. Six different
> refusals each say what went wrong: wrong type, too big, not a PDF, a scan, a
> password, a corrupt file. An honest no is a feature.

### 5. How Bob was used — 1:35 to 2:05
**On screen:** `docs/IBM_BOB_PHASE1_ASSESSMENT.md`, then
`docs/IBM_BOB_MODERNIZATION_LOG.md` scrolled to Entry 3.

> IBM Bob opened all of this. A read-only audit of architecture, API, the AI
> flow, security and tests, committed unedited. Then plans, not patches. And Bob
> was wrong five times. It called a current model non-existent, twice. It said
> our JSON parse sat outside its try and catch when it sat inside. Every
> correction is in the log, because a tool you cannot correct is a tool you are
> not really using.

### 6. Verification — 2:05 to 2:35
**On screen:** terminal. Run the suites live. Then show one planted defect going
red, and the fix going green again.

> Then we checked each other. A hundred and thirty-nine automated checks across six suites,
> where the baseline had none. Review found two defects that neither Bob nor the
> author caught: the phantom analysis you just saw, and the word undefined
> printed into an artist's PDF. Every gate was shown failing on a deliberately
> broken build before we trusted it. A test that has never gone red proves
> nothing. Type checking and the production build are clean.

**Commands. CORRECTED 2026-10-13, after running every one of them.** The four
commands as first written cannot be run in one terminal, because the three
suites live on two different branches.

| suite | real command | branch it lives on | re-measured 13 Oct |
|---|---|---|---|
| upload decisions | `npm run test:upload` | `james/wire-upload-rules` | **25 of 25** |
| analysis contract | `npm run test:analysis` | `james/ticket2-verification` | **22 of 22** |
| validator | `npm run test` | `james/ticket2-verification` | **21 of 21** |
| types | `npm run lint` | either | silent, which is clean |

**Superseded 2026-10-13: the total is now 139 across six suites, all in one checkout on `james/integration`.** What follows described the pre-merge state. But
`npm run test:analysis` does not exist on the branch carrying the upload suite,
and `npm run test:upload` does not exist on the branch carrying the other two.
So this section cannot be filmed as one continuous terminal take until an
integration branch exists.

**Merging them is not mechanical and should not be done just to get a shot.**
`main` has evolved its own version of `src/lib/uploadDecision.ts` by way of
`james/fallback-honesty`. A trial merge of `james/wire-upload-rules` into `main`
produced 23 conflict hunks across 7 files, with conflicts inside
`uploadDecision.ts` and its own test file. Choosing which implementation wins is
a decision about the honesty guarantee itself, so it belongs to a deliberate
sitting, not to a recording session.

Until then, the only honest way to film this section is two takes on two
branches, said out loud as two branches. Do not imply one checkout.

### 7. Close — 2:35 to 2:55
**On screen:** the app, results view. End card with the three links.

> Next: calibrate the threshold that separates a scan from a short contract with
> real documents, report real upload progress instead of fixed waypoints, and
> add DOCX. What it does not know, it now says it does not know. That is the
> change that matters to someone about to sign.

---

## Recording checklist

- **Zoom the browser and the editor until no text on screen is under 16px.**
  House rule for anything screen-recorded, and judges watch on laptops.
- **1080p, 16:9.** Match the deck so the two read as one submission.
- **Use a fixture contract, never a real one.** No real artist, label or
  counterparty names on screen, and check the filename in the upload dialog too.
- **Close every other tab.** The browser tab strip is in frame for the whole
  video.
- **Record narration separately** and lay it over the screen capture, so a
  stumble costs one line instead of a whole take. If you would rather not use
  your own voice, the Brooks voice id already used on the narrated YouTube
  upload is available and keeps the voice consistent across your channel.
- **One take per section.** Seven short clips are easier to fix than one long
  one, and sections 3 and 4 are the only ones that need real app timing.
- **Watch it once at full length against a timer before uploading.** Three
  minutes is a rule, not a guideline.

## Nothing is still needed from elsewhere, 2026-10-18

- **Deployed URL** (rule 6.3.6): http://65.108.146.243/ — live, and in section 7's end card.
- **YouTube link** (rule 6.3.5): https://youtu.be/BXjVQ60cC4I — public, 3:25.

Final cut: `THE_LEDGER_SUBMISSION_20261018_324.mp4`, **3:24.48**, 1920x1080,
16.6 MB. Section 5 was cut to bring it under the three minute thirty mark.
Removing it also removed the section Terrance named as his favourite, the
corrections to Bob's initial findings; he was told so in writing and offered a
middle option.
