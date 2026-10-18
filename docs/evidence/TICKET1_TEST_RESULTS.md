# Ticket 1 - PDF/TXT Regression Results
Date: 2026-10-09
Branch: bob/ticket-2

| File | Result | Message shown |
|---|---|---|
| good.pdf | PASS | Raw text box showed the real extracted text (TEST ARTIST AGREEMENT, Net 30, 36 months) |
| encrypted.pdf | PASS | "This PDF is password-protected. Please provide an unlocked copy." |
| oversize.pdf | PASS | "File exceeds the 10 MB limit. Please upload a smaller document." |
| short.txt | PASS | "No extractable text found. The file appears to be empty or too short to analyze." |

Not yet tested: image-only PDF, a renamed image (.jpg as .pdf).
Open item: one generic "Could not read the file" error was seen once; the source file was not identified and was not reproduced with these four files.
Analysis runs without a Gemini key, so results use the server's static fallback. Extraction was verified through the raw text box.
Independent review: pending.
