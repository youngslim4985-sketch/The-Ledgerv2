# 🎵 The Ledger

Music-rights education and contract-analysis tools for artists, producers, creators, and independent music professionals.

THE LEDGER helps creators explore contract terms, understand common risks, and prepare questions for independent legal counsel. Its contract-analysis interface supports a clearly labeled demo mode; live AI analysis is not verified for this submission.

---

## Why The Ledger?

Many independent artists sign agreements without fully understanding their rights.

The Ledger was built to make contract review more accessible by providing:

- 📄 PDF contract upload
- 🤖 Contract-analysis interface with clearly labeled demo results
- ⚠️ Risk scoring
- 💬 Plain-English explanations
- 📊 Contract insights dashboard

---

## Features

- Upload music contracts
- Contract-analysis workflow with demo-mode support
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
- Optional live AI integration (not verified for this submission)
- Node.js and TypeScript backend with automated validation tests

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

# Configure free demonstration mode in .env
cp .env.example .env
# Set DEMO_MODE=true in .env

npm run dev
```

---

## Vision

Our mission is to make contract transparency available to every creator—not just those who can afford an attorney.

The Ledger empowers artists to make informed decisions before signing agreements.

---

## IBM Bob Hackathon — Modernize What Matters

THE LEDGER is being submitted to the IBM Bob Hackathon.

Documented engineering improvements include:
- Stronger validation of contract-analysis responses.
- 21 automated validator tests.
- Explicit handling when live AI is not configured.
- A demo mode that works without paid AI access.

**Demo limitation:** When `DEMO_MODE=true`, contract analysis displays illustrative sample data; it does not analyze the uploaded contract. Live AI analysis must not be assumed to be working.

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
