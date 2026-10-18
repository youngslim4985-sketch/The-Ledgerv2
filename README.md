# 🎵 The Ledger

AI-powered contract analysis for artists, producers, creators, and independent music professionals.

The Ledger helps creators understand contracts before they sign by using AI to identify risky clauses, explain legal language in plain English, and provide an easy-to-understand risk score.

---

## Why The Ledger?

Many independent artists sign agreements without fully understanding their rights.

The Ledger was built to make contract review more accessible by providing:

- 📄 PDF contract upload
- 🤖 AI-powered clause analysis
- ⚠️ Risk scoring
- 💬 Plain-English explanations
- 📊 Contract insights dashboard

---

## Features

- Upload music contracts
- AI contract parsing
- Fairness & risk scoring
- Revenue and royalty analysis
- Interactive dashboard
- Modern responsive UI

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Express (API server)
- pdfjs-dist (PDF text extraction, in the browser)
- Google Gemini via `@google/genai` (contract analysis)

---

## Demo

Live Demo:
https://the-ledgerv2.vercel.app/

GitHub Repository:
https://github.com/youngslim4985-sketch/The-Ledgerv2

---

## Getting Started

```bash
git clone https://github.com/youngslim4985-sketch/The-Ledgerv2.git

cd The-Ledgerv2

npm install

npm run dev
```

Then open http://localhost:3000.

`GEMINI_API_KEY` is optional for running the UI. Without it the server replies
with `fallback: true` and the app says plainly that the contract has not been
read, rather than showing a risk score for a document nothing analysed.

### Verifying it

```bash
npm run lint         # tsc --noEmit
npm run test:upload  # upload, extraction and refusal decisions
npm run test:share   # what the copy button puts on the clipboard
npm run test:ci      # that CI actually runs every suite above
npm run build
```

Every one of these runs on every push and pull request
(`.github/workflows/ci.yml`). Many of the checks are planted: they are written
to fail against the version of the code that had the bug, so a regression is a
named red check rather than a silent pass.

---

## Vision

Our mission is to make contract transparency available to every creator—not just those who can afford an attorney.

The Ledger empowers artists to make informed decisions before signing agreements.

---

## Hackathon

Built for the **IBM Bob Hackathon 2026**.

Contract analysis runs on **Google Gemini** through `@google/genai`. There is no
Python, no PyTorch and no ROCm anywhere in this repository; an earlier version of
this section claimed AMD ROCm acceleration, which `docs/IBM_BOB_PHASE1_ASSESSMENT.md`
had already recorded as false. It is corrected here rather than left on the front
page of a public repo.

IBM Bob's part in the work is logged, including what it got wrong:
`docs/BOB_SESSION_2026-10-06_HONESTY_AUDIT.md`.

---

## Future Roadmap

- Multi-language support
- AI negotiation suggestions
- Royalty forecasting
- Contract comparison
- Mobile application

---

## License

MIT License
