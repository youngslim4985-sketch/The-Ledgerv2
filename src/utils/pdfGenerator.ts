import jsPDF from "jspdf";
import { ContractAnalysis, DEAL_TYPE_UNKNOWN } from "../types";

export interface RiskExportModel {
  score: number;
  label: string;
  concern: string;
  redFlagsCount: number;
  fairTermsCount: number;
}

export function buildRiskExportModel(analysis: ContractAnalysis): RiskExportModel {
  const score = analysis.riskScore || 50;
  let label = "MODERATE RISK";
  if (score >= 75) {
    label = "CRITICAL RISK";
  } else if (score < 30) {
    label = "LOW RISK";
  }

  const concern =
    analysis.redFlags?.[0]?.clause ||
    analysis.riskCards?.[0]?.title ||
    "Contract contains clauses requiring review by legal counsel.";

  return {
    score,
    label,
    concern,
    redFlagsCount: analysis.redFlags?.length || analysis.riskCards?.length || 0,
    fairTermsCount: analysis.fairTerms?.length || 0
  };
}

export function generateContractPDF(analysis: ContractAnalysis): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 40;
  const contentWidth = pageWidth - margin * 2; // 515.28 pt

  let y = 0;

  // Colors
  const COLOR_SLATE_900 = [15, 23, 42]; // #0F172A
  const COLOR_SLATE_800 = [30, 41, 59]; // #1E293B
  const COLOR_SLATE_700 = [51, 65, 85];
  const COLOR_SLATE_600 = [71, 85, 105];
  const COLOR_SLATE_200 = [226, 232, 240];
  const COLOR_SLATE_100 = [241, 245, 249];
  const COLOR_AMBER = [217, 119, 6]; // #D97706
  const COLOR_AMBER_BG = [254, 243, 199]; // amber-100
  const COLOR_RED = [225, 29, 72]; // rose-600
  const COLOR_RED_BG = [254, 226, 226];
  const COLOR_GREEN = [16, 185, 129];
  const COLOR_GREEN_BG = [209, 250, 229];

  // Helper to ensure page bounds
  const checkNewPage = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 50) {
      doc.addPage();
      y = 45; // Top margin for subsequent pages
      return true;
    }
    return false;
  };

  // Helper to draw section title banner
  const drawSectionHeader = (title: string, iconSymbol: string = "■") => {
    checkNewPage(40);
    y += 10;
    
    // Header background line
    doc.setFillColor(COLOR_SLATE_900[0], COLOR_SLATE_900[1], COLOR_SLATE_900[2]);
    doc.roundedRect(margin, y, contentWidth, 24, 4, 4, "F");

    // Title text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(245, 158, 11); // Amber text
    doc.text(`${iconSymbol}  ${title.toUpperCase()}`, margin + 10, y + 16);

    y += 32;
  };

  // --- HEADER BANNER ---
  doc.setFillColor(COLOR_SLATE_900[0], COLOR_SLATE_900[1], COLOR_SLATE_900[2]);
  doc.rect(0, 0, pageWidth, 75, "F");

  // Gold brand accent line
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 72, pageWidth, 3, "F");

  // Title in header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("THE LEDGER", margin, 34);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(245, 158, 11);
  doc.text("AI CONTRACT AUDIT & LEGAL RISK REPORT", margin, 48);

  // Date and Metadata right aligned
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`Generated: ${currentDate}`, pageWidth - margin, 34, { align: "right" });
  doc.text(`Doc ID: LEDGER-${Math.floor(100000 + Math.random() * 900000)}`, pageWidth - margin, 48, { align: "right" });

  y = 95;

  // --- CONTRACT TITLE & RISK SCORE CARD ---
  checkNewPage(90);

  // Box background
  doc.setFillColor(COLOR_SLATE_100[0], COLOR_SLATE_100[1], COLOR_SLATE_100[2]);
  doc.setDrawColor(COLOR_SLATE_200[0], COLOR_SLATE_200[1], COLOR_SLATE_200[2]);
  doc.roundedRect(margin, y, contentWidth, 80, 8, 8, "FD");

  // Contract Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(COLOR_SLATE_900[0], COLOR_SLATE_900[1], COLOR_SLATE_900[2]);
  const splitTitle = doc.splitTextToSize(analysis.title, contentWidth - 140);
  doc.text(splitTitle, margin + 15, y + 25);

  // Deal Type Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_SLATE_600[0], COLOR_SLATE_600[1], COLOR_SLATE_600[2]);
  doc.text(`Category / Deal Type: ${analysis.dealType || DEAL_TYPE_UNKNOWN}`, margin + 15, y + 45);

  // Risk Badge on Right using buildRiskExportModel
  const riskExport = buildRiskExportModel(analysis);
  const riskScore = riskExport.score;
  const riskLabel = riskExport.label;
  let riskBadgeColor = COLOR_AMBER;
  let riskBgColor = COLOR_AMBER_BG;

  if (riskScore >= 75) {
    riskBadgeColor = COLOR_RED;
    riskBgColor = COLOR_RED_BG;
  } else if (riskScore < 30) {
    riskBadgeColor = COLOR_GREEN;
    riskBgColor = COLOR_GREEN_BG;
  }

  // Risk Badge Box
  const badgeWidth = 110;
  const badgeX = pageWidth - margin - badgeWidth - 15;
  doc.setFillColor(riskBgColor[0], riskBgColor[1], riskBgColor[2]);
  doc.setDrawColor(riskBadgeColor[0], riskBadgeColor[1], riskBadgeColor[2]);
  doc.roundedRect(badgeX, y + 15, badgeWidth, 50, 6, 6, "FD");

  // Risk Score Number
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(riskBadgeColor[0], riskBadgeColor[1], riskBadgeColor[2]);
  doc.text(`${riskScore}/100`, badgeX + badgeWidth / 2, y + 36, { align: "center" });

  // Risk Label text
  doc.setFontSize(7);
  doc.text(riskLabel, badgeX + badgeWidth / 2, y + 52, { align: "center" });

  y += 95;

  // --- EXECUTIVE SUMMARY ---
  drawSectionHeader("Executive Summary & Plain-English Overview", "📋");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(COLOR_SLATE_800[0], COLOR_SLATE_800[1], COLOR_SLATE_800[2]);

  const summaryText = analysis.summary || analysis.plainEnglishTranslation || "No summary provided.";
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 20);

  checkNewPage(splitSummary.length * 13 + 20);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(COLOR_SLATE_200[0], COLOR_SLATE_200[1], COLOR_SLATE_200[2]);
  doc.roundedRect(margin, y, contentWidth, splitSummary.length * 13 + 18, 6, 6, "FD");

  doc.text(splitSummary, margin + 10, y + 16);
  y += splitSummary.length * 13 + 30;

  // --- KEY TERMS ---
  if (analysis.keyTerms && analysis.keyTerms.length > 0) {
    drawSectionHeader("Key Contractual Terms", "🔑");

    analysis.keyTerms.forEach((kt) => {
      checkNewPage(35);

      doc.setFillColor(COLOR_SLATE_100[0], COLOR_SLATE_100[1], COLOR_SLATE_100[2]);
      doc.setDrawColor(COLOR_SLATE_200[0], COLOR_SLATE_200[1], COLOR_SLATE_200[2]);
      doc.roundedRect(margin, y, contentWidth, 28, 4, 4, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(COLOR_SLATE_900[0], COLOR_SLATE_900[1], COLOR_SLATE_900[2]);
      doc.text(kt.term, margin + 10, y + 17);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(COLOR_AMBER[0], COLOR_AMBER[1], COLOR_AMBER[2]);
      doc.text(kt.value, margin + 160, y + 17);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(COLOR_SLATE_600[0], COLOR_SLATE_600[1], COLOR_SLATE_600[2]);
      const impactTruncated = doc.splitTextToSize(kt.impact, contentWidth - 300);
      doc.text(impactTruncated[0] || "", margin + 290, y + 17);

      y += 33;
    });

    y += 10;
  }

  // --- RISK CARDS & RED FLAGS ---
  const hasRiskCards = analysis.riskCards && analysis.riskCards.length > 0;
  const hasRedFlags = analysis.redFlags && analysis.redFlags.length > 0;

  if (hasRiskCards || hasRedFlags) {
    drawSectionHeader("Identified Risks & Hazard Warnings", "⚠️");

    if (hasRiskCards) {
      analysis.riskCards!.forEach((rc) => {
        const expLines = doc.splitTextToSize(rc.explanation, contentWidth - 30);
        const cardHeight = 25 + expLines.length * 12;

        checkNewPage(cardHeight + 10);

        doc.setFillColor(COLOR_RED_BG[0], COLOR_RED_BG[1], COLOR_RED_BG[2]);
        doc.setDrawColor(252, 165, 165); // red-300
        doc.roundedRect(margin, y, contentWidth, cardHeight, 6, 6, "FD");

        // Hazard icon and Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(190, 18, 60); // rose-700
        doc.text(`[!] ${rc.title}`, margin + 10, y + 16);

        // Severity tag
        if (rc.severity) {
          doc.setFontSize(7.5);
          doc.text(`[${rc.severity} SEVERITY]`, pageWidth - margin - 80, y + 16);
        }

        // Explanation text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(COLOR_SLATE_800[0], COLOR_SLATE_800[1], COLOR_SLATE_800[2]);
        doc.text(expLines, margin + 10, y + 30);

        y += cardHeight + 8;
      });
    } else if (hasRedFlags) {
      analysis.redFlags!.forEach((rf) => {
        const expLines = doc.splitTextToSize(rf.explanation, contentWidth - 30);
        const cardHeight = 35 + expLines.length * 12;

        checkNewPage(cardHeight + 10);

        doc.setFillColor(COLOR_RED_BG[0], COLOR_RED_BG[1], COLOR_RED_BG[2]);
        doc.setDrawColor(252, 165, 165);
        doc.roundedRect(margin, y, contentWidth, cardHeight, 6, 6, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(190, 18, 60);
        doc.text(`[!] ${rf.clause}`, margin + 10, y + 16);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(COLOR_SLATE_800[0], COLOR_SLATE_800[1], COLOR_SLATE_800[2]);
        doc.text(expLines, margin + 10, y + 30);

        if (rf.questionToAsk) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(COLOR_AMBER[0], COLOR_AMBER[1], COLOR_AMBER[2]);
          const qText = doc.splitTextToSize(`Attorney Inquiry: "${rf.questionToAsk}"`, contentWidth - 30);
          doc.text(qText[0] || "", margin + 10, y + cardHeight - 8);
        }

        y += cardHeight + 8;
      });
    }

    y += 10;
  }

  // --- KEY CLAUSES BREAKDOWN ---
  if (analysis.keyClauses && analysis.keyClauses.length > 0) {
    drawSectionHeader("Key Clauses Dissection", "📜");

    analysis.keyClauses.forEach((clause) => {
      const origLines = doc.splitTextToSize(`"${clause.originalClause}"`, contentWidth - 30);
      const plainLines = doc.splitTextToSize(clause.plainEnglish, contentWidth - 30);
      const concernLines = doc.splitTextToSize(clause.potentialConcerns, contentWidth - 30);

      const blockHeight = 25 + origLines.length * 11 + plainLines.length * 11 + concernLines.length * 11 + 20;

      checkNewPage(blockHeight + 10);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(COLOR_SLATE_200[0], COLOR_SLATE_200[1], COLOR_SLATE_200[2]);
      doc.roundedRect(margin, y, contentWidth, blockHeight, 6, 6, "FD");

      // Clause Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(COLOR_SLATE_900[0], COLOR_SLATE_900[1], COLOR_SLATE_900[2]);
      doc.text(clause.title, margin + 10, y + 16);

      let innerY = y + 30;

      // Original text
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(COLOR_SLATE_600[0], COLOR_SLATE_600[1], COLOR_SLATE_600[2]);
      doc.text(origLines, margin + 10, innerY);
      innerY += origLines.length * 11 + 6;

      // Plain English
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(COLOR_AMBER[0], COLOR_AMBER[1], COLOR_AMBER[2]);
      doc.text("Plain-English Meaning:", margin + 10, innerY);
      innerY += 12;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLOR_SLATE_800[0], COLOR_SLATE_800[1], COLOR_SLATE_800[2]);
      doc.text(plainLines, margin + 10, innerY);
      innerY += plainLines.length * 11 + 6;

      // Concerns
      doc.setFont("helvetica", "bold");
      doc.setTextColor(190, 18, 60);
      doc.text("Potential Concerns:", margin + 10, innerY);
      innerY += 12;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLOR_SLATE_800[0], COLOR_SLATE_800[1], COLOR_SLATE_800[2]);
      doc.text(concernLines, margin + 10, innerY);

      y += blockHeight + 10;
    });

    y += 10;
  }

  // --- RIGHTS & RESPONSIBILITIES ---
  if (
    (analysis.yourResponsibilities && analysis.yourResponsibilities.length > 0) ||
    (analysis.otherPartyResponsibilities && analysis.otherPartyResponsibilities.length > 0)
  ) {
    drawSectionHeader("Rights & Responsibilities Breakdown", "⚖️");

    if (analysis.yourResponsibilities && analysis.yourResponsibilities.length > 0) {
      checkNewPage(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(COLOR_AMBER[0], COLOR_AMBER[1], COLOR_AMBER[2]);
      doc.text("YOUR RESPONSIBILITIES:", margin, y);
      y += 14;

      analysis.yourResponsibilities.forEach((resp) => {
        const lines = doc.splitTextToSize(`• ${resp}`, contentWidth - 20);
        checkNewPage(lines.length * 12);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(COLOR_SLATE_800[0], COLOR_SLATE_800[1], COLOR_SLATE_800[2]);
        doc.text(lines, margin + 10, y);
        y += lines.length * 12 + 2;
      });

      y += 10;
    }

    if (analysis.otherPartyResponsibilities && analysis.otherPartyResponsibilities.length > 0) {
      checkNewPage(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(37, 99, 235); // blue-600
      doc.text("OTHER PARTY'S RESPONSIBILITIES:", margin, y);
      y += 14;

      analysis.otherPartyResponsibilities.forEach((resp) => {
        const lines = doc.splitTextToSize(`• ${resp}`, contentWidth - 20);
        checkNewPage(lines.length * 12);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(COLOR_SLATE_800[0], COLOR_SLATE_800[1], COLOR_SLATE_800[2]);
        doc.text(lines, margin + 10, y);
        y += lines.length * 12 + 2;
      });

      y += 10;
    }
  }

  // --- ACTIONABLE RECOMMENDATIONS ---
  if (analysis.recommendations && analysis.recommendations.length > 0) {
    drawSectionHeader("AI Negotiation Recommendations", "⚡");

    analysis.recommendations.forEach((rec, idx) => {
      const recLines = doc.splitTextToSize(`${idx + 1}. ${rec}`, contentWidth - 20);
      const recHeight = recLines.length * 12 + 10;

      checkNewPage(recHeight);

      doc.setFillColor(COLOR_GREEN_BG[0], COLOR_GREEN_BG[1], COLOR_GREEN_BG[2]);
      doc.setDrawColor(110, 231, 183);
      doc.roundedRect(margin, y, contentWidth, recHeight, 4, 4, "FD");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(6, 78, 59); // emerald-900
      doc.text(recLines, margin + 10, y + 14);

      y += recHeight + 6;
    });

    y += 10;
  }

  // --- QUESTIONS FOR ATTORNEY CHECKLIST ---
  if (analysis.questionsForAttorney && analysis.questionsForAttorney.length > 0) {
    drawSectionHeader("Questions for Legal Counsel Checklist", "❓");

    analysis.questionsForAttorney.forEach((q, idx) => {
      const qLines = doc.splitTextToSize(`[  ] ${idx + 1}. ${q}`, contentWidth - 20);
      checkNewPage(qLines.length * 13 + 6);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(COLOR_SLATE_800[0], COLOR_SLATE_800[1], COLOR_SLATE_800[2]);
      doc.text(qLines, margin + 10, y);

      y += qLines.length * 13 + 4;
    });
  }

  // --- FOOTERS & PAGE NUMBERS ACROSS ALL PAGES ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(COLOR_SLATE_200[0], COLOR_SLATE_200[1], COLOR_SLATE_200[2]);
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);

    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_SLATE_600[0], COLOR_SLATE_600[1], COLOR_SLATE_600[2]);
    doc.text(
      "CONFIDENTIAL • Generated by The Ledger AI Contract Workspace • For Educational & Legal Preparation Use Only",
      margin,
      pageHeight - 22
    );

    // Page Number right aligned
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 22, { align: "right" });
  }

  // Save PDF document
  const sanitizeFilename = (analysis.title || "Contract_Analysis").replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`${sanitizeFilename}_AI_Audit_Report.pdf`);
}
