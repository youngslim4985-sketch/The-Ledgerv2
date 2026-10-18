# Ticket 1 — verification, and one defect found

**Branch** `james/ticket1-verification`, based on `bob/pdf-extraction` @ 9eaf044
**Owner of this slice** James / Zealous Mirror — states, refusal path, verification
**Owner of extraction** Terrance — `src/lib/extractPdfText.ts`, the validation rules

This builds on the extraction branch. It does not touch the extractor.

---

## What was already right

`bob/pdf-extraction` removed both fabricated-contract blocks and replaced them
with real pdfjs extraction plus a validation chain that is genuinely good:

- unsupported type, with a specific message for DOC/DOCX
- 10 MB size limit
- **%PDF- magic bytes** — a file named `.pdf` is not a PDF, and this catches it
- **scanned / image-only detection** — the hard case, since a scan opens
  perfectly and yields nothing
- password-protected, via a typed `PasswordProtectedError`
- corrupt / unreadable

Each one refuses and returns without analysing. That is the right behaviour and
it is the core of Ticket 1.

---

## The defect

**A refusal correctly declines to analyse, and the results panel renders anyway.**

`analysis` is initialised to `SAMPLE_CONTRACTS[0].analysis`, and the results
section had no condition on it. So:

> An artist uploads a scanned 360 deal. They are correctly told *"No extractable
> text found. This may be a scanned or image-only PDF."* Directly beneath that
> message sits a complete risk score, clause breakdown and recommendations — for
> a sample Employment Agreement they have never seen.

Same shape as the fabricated text, one layer up: findings on screen that the
system has not established about this document. The first version was a sentence
the product made up; this one is a real analysis of the wrong contract.

**Fix:** `mayShowAnalysis()` in `src/lib/uploadDecision.ts`, applied as a gate on
the results section. A refusal hides findings. A sample contract still renders.
An upload shows findings only once it has produced them.

---

## What this branch adds

**`src/lib/uploadDecision.ts`** — the same rules, same thresholds, same messages,
same order, lifted out of the async handler as pure functions. No behaviour
changes. The point is that the validation was previously tangled with six pieces
of React state and could not be exercised without a DOM.

**`src/lib/uploadDecision.test.ts`** — 20 cases, no new dependency, runs on the
repo's existing `tsx`. **Seven are planted and must refuse**, so the guard is
shown to reject rather than merely to pass:

- a whitespace-only extraction still refuses
- 49 characters is not a contract
- a renamed non-PDF is refused
- a refused upload shows no analysis
- a refusal hides even a previously successful analysis

```bash
npm run test:upload   # 20/20
npm run lint          # clean
npm run build         # clean
```

---

## Two things worth a decision, not fixed here

**The 50-character threshold.** A 49-character PDF is called a scan; a
51-character one is analysed as a contract. Neither is a contract. The number
should probably be a few hundred, but it is Terrance's rule and changing a
threshold silently is how thresholds stop meaning anything. Raised, not changed.

**Progress is still waypoints.** `setUploadProgress(10)`, `(40)`, `(100)` are
fixed points, not measurement — the bar moves at the same rate for a 2-page
letter and a 200-page deal. pdfjs exposes `numPages` and per-page resolution, so
real progress is available if it is worth the wiring.

---

## Note on the parallel branch

I had independently built `james/ticket1-extraction-states` before seeing this
branch — a typed state machine with a branded `ExtractedText` that makes the
fabrication unrepresentable rather than merely removed. **That branch duplicates
work already done here and should not be merged.** The one idea in it worth
porting, if wanted later, is the brand: it makes "analyse this text" impossible
to call with text no reader produced, so a future edit cannot reintroduce the
fallback. Everything else here is Terrance's and is better for being his.
