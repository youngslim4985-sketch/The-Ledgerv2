/**
 * Regenerates the upload fixtures.
 *
 * These existed only in dist/ and were untracked, so a `npm run build` deleted
 * them and the demo could not be filmed. They are test inputs, so they belong
 * in public/fixtures (vite copies that into dist) and in git. This script makes
 * them reproducible rather than precious.
 */
import { jsPDF } from "jspdf";
import { writeFileSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const OUT = "public/fixtures";

const CONTRACT = `EXCLUSIVE RECORDING AGREEMENT (SAMPLE DOCUMENT FOR DEMONSTRATION ONLY - NOT A REAL CONTRACT)

This Agreement is made between the Company and the Artist.

1. TERM
The initial period begins on the Effective Date and continues for two (2) years.
The Company holds three (3) separate options to extend, each for one (1) year,
exercisable at the Company's sole discretion.

2. GRANT OF RIGHTS
The Artist grants the Company exclusive ownership of all master recordings
delivered under this Agreement, in perpetuity, throughout the universe, in all
media now known or later devised.

3. ROYALTIES
The Company shall pay the Artist twelve percent (12%) of Net Receipts,
calculated after deduction of all recording costs, marketing costs, video costs
and tour support.

4. RECOUPMENT
All advances and costs are fully recoupable from the Artist's royalty share
before any royalty is payable.

5. CONTROLLED COMPOSITIONS
Mechanical royalties are limited to seventy-five percent (75%) of the statutory
rate, capped at ten (10) compositions per album.

6. RE-RECORDING RESTRICTION
The Artist shall not re-record any composition delivered hereunder for a period
of five (5) years following the end of the Term.

7. ACCOUNTING
Statements are rendered semi-annually. Any objection must be raised within
twelve (12) months or is permanently waived.`;

// 1. A real text PDF: extraction must succeed.
const doc = new jsPDF({ unit: "pt", format: "letter" });
doc.setFont("courier", "normal");
doc.setFontSize(10);
let y = 56;
for (const line of CONTRACT.split("\n")) {
  if (y > 740) { doc.addPage(); y = 56; }
  doc.text(line, 48, y);
  y += 13;
}
writeFileSync(`${OUT}/sample-recording-agreement.pdf`, Buffer.from(doc.output("arraybuffer")));
console.log("  wrote sample-recording-agreement.pdf");

// 2. A genuinely scanned PDF: rasterise page 1, then wrap the image. No text layer.
execSync(`pdftoppm -png -r 110 -f 1 -l 1 "${OUT}/sample-recording-agreement.pdf" "${process.env.TMPDIR}/scanpage"`);
const png = readFileSync(`${process.env.TMPDIR}/scanpage-1.png`);
const scan = new jsPDF({ unit: "pt", format: "letter" });
scan.addImage(`data:image/png;base64,${png.toString("base64")}`, "PNG", 0, 0, 612, 792);
writeFileSync(`${OUT}/scanned-360-deal.pdf`, Buffer.from(scan.output("arraybuffer")));
console.log("  wrote scanned-360-deal.pdf");
