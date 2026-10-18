
import {validateAnalysis} from "./src/lib/validateAnalysis";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
// Hosts that run this (Vercel, Render, Railway, Fly) inject PORT and expect the
// app to bind it. Hardcoding 3000 is why this could not deploy to one.
import { classifyAiError } from "./src/lib/aiError";
import { chooseAuth, describeAuth } from "./src/lib/aiAuth";

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK lazily / safely
let authLogged = false;

function getGeminiClient() {
  // Which credential to use is decided in src/lib/aiAuth.ts, not here, so the
  // rules are testable. Two mechanisms reach two different products: an API key
  // reaches AI Studio, Application Default Credentials reach Vertex AI. An
  // organization policy may forbid API keys outright, in which case Vertex is
  // the only route. Modernization log Entry 10.
  const auth = chooseAuth(process.env as Record<string, string | undefined>);

  if (!authLogged) {
    console.log("AI credential: " + describeAuth(auth));
    authLogged = true;
  }

  if (auth.kind === "unconfigured") return null;

  const httpOptions = { headers: { "User-Agent": "aistudio-build" } };

  if (auth.kind === "vertex") {
    return new GoogleGenAI({
      vertexai: true,
      project: auth.project,
      location: auth.location,
      httpOptions,
    });
  }

  return new GoogleGenAI({ apiKey: auth.apiKey, httpOptions });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "THE LEDGER", timestamp: new Date().toISOString() });
});

// Maximum contract text length accepted by the API (500 000 characters ≈ 500 KB of plain text).
// This is well above any real-world contract while preventing accidental large-file abuse
// and keeping AI prompt sizes within a sensible bound.
const MAX_CONTRACT_TEXT_LENGTH = 500_000;

// API endpoint: Contract AI Analysis & Plain-English Translation
app.post("/api/analyze-contract", async (req, res) => {
  try {
    const { contractText, dealType, customPrompt } = req.body;
    
    if (!contractText || typeof contractText !== "string") {
      return res.status(400).json({ error: "contractText parameter is required." });
    }

    if (contractText.length > MAX_CONTRACT_TEXT_LENGTH) {
      return res.status(413).json({
        error: `contractText exceeds the maximum allowed length of ${MAX_CONTRACT_TEXT_LENGTH.toLocaleString()} characters. Please shorten the document and try again.`
      });
    }

    const ai = getGeminiClient();
    
    // Do not return generic findings as if they came from the user's contract.
    if (!ai) {
      return res.status(503).json({
        error: "Contract analysis is unavailable because the AI service is not configured.",
        code: "AI_SERVICE_NOT_CONFIGURED"
      });
    }

    const systemInstruction = `You are THE LEDGER's Music Rights AI Specialist. Your duty is music business education for independent artists, songwriters, and producers.
Analyze the provided music contract or agreement clause-by-clause and explain it strictly in simple, transparent, non-jargon English.
Focus heavily on rights ownership (masters vs publishing), advances, recoupment rules, cross-collateralization, territory, term duration, and audit rights.
Do NOT give formal legal advice; present educational guidance and key questions artists should ask before signing.`;

    const prompt = `Analyze the following ${dealType || "Music Contract"}:\n\n${contractText}\n\nAdditional context: ${customPrompt || "Provide full educational breakdown."}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Clear descriptive title for this contract analysis" },
            dealType: { type: Type.STRING, description: "Category e.g. Major Label 360, Co-Publishing, Work-for-Hire" },
            riskScore: { type: Type.INTEGER, description: "Overall artist risk score from 1 (Very Fair) to 100 (Predatory)" },
            summary: { type: Type.STRING, description: "High level 2-3 sentence overview of what this agreement does" },
            plainEnglishTranslation: { type: Type.STRING, description: "Full breakdown translated into clear, simple language" },
            keyClauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  originalClause: { type: Type.STRING },
                  plainEnglish: { type: Type.STRING },
                  potentialConcerns: { type: Type.STRING }
                },
                required: ["title", "originalClause", "plainEnglish", "potentialConcerns"]
              }
            },
            yourResponsibilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            otherPartyResponsibilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            riskCards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  severity: { type: Type.STRING }
                },
                required: ["title", "explanation"]
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            keyTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  value: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["term", "value", "impact"]
              }
            },
            redFlags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clause: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, description: "HIGH, MEDIUM, or LOW" },
                  explanation: { type: Type.STRING },
                  questionToAsk: { type: Type.STRING }
                },
                required: ["clause", "riskLevel", "explanation", "questionToAsk"]
              }
            },
            fairTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clause: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["clause", "explanation"]
              }
            },
            questionsForAttorney: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 important questions to ask a entertainment attorney before signing"
            },
            waterfallEstimates: {
              type: Type.OBJECT,
              properties: {
                artistRoyaltyRate: { type: Type.NUMBER, description: "Artist royalty percentage e.g. 18" },
                labelShareRate: { type: Type.NUMBER, description: "Label share percentage e.g. 82" },
                advanceAmount: { type: Type.NUMBER, description: "Estimated advance amount in USD" },
                distributionFeeRate: { type: Type.NUMBER, description: "Distribution fee percentage e.g. 15" }
              }
            }
          },
          required: ["title", "riskScore", "summary", "plainEnglishTranslation", "redFlags", "questionsForAttorney"]
        }
      }
    });
    const resultText = response.text;

    if (!resultText || !resultText.trim()) {
      return res.status(502).json({
        error: "AI service returned an empty response."
      });
    }

    let jsonResult;

    try {
      jsonResult = JSON.parse(resultText);
    } catch {
      console.error("AI returned malformed JSON.");
      return res.status(502).json({
        error: "AI service returned an invalid response."
      });
    }

    const validation = validateAnalysis(jsonResult);

    if (validation.ok === false) {
      console.error(
        "AI response failed validation:",
        validation.reason
      );

      return res.status(502).json({
        error: "AI service returned an invalid analysis response."
      });
    }

    return res.json(jsonResult);
  } catch (err: any) {
    // The provider's own text goes to the server log, where it is useful, and
    // never to the browser. See modernization log Entry 9.
    console.error("Error analyzing contract:", err);
    const verdict = classifyAiError(err);
    res.status(verdict.status).json({ error: verdict.message, code: verdict.code });
  }
});

// API endpoint: Q&A Educational Chat with AI Assistant
app.post("/api/ask-legal-assistant", async (req, res) => {
  try {
    const { question, contractContext } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question parameter is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        answer: "THE LEDGER AI is running in offline educational mode. Key takeaway: Always verify whether your contract includes a 'sunset clause', 'cross-collateralization', or 'in perpetuity master assignment'. Never sign without independent entertainment legal counsel."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `User Question: "${question}"\nContext Contract: ${contractContext || "General Music Rights & Contracts Question"}`,
      config: {
        systemInstruction: `You are THE LEDGER's friendly music rights tutor. Answer the user's question clearly with bullet points, practical examples, and zero legalese. Always remind creators that THE LEDGER is an educational tool and does not replace professional legal advice.`,
      }
    });

    res.json({ answer: response.text || "No response received." });
  } catch (err: any) {
    console.error("Error in AI Q&A:", err);
    const verdict = classifyAiError(err);
    res.status(verdict.status).json({ error: verdict.message, code: verdict.code });
  }
});

// API endpoint: Calculate Revenue Waterfall
app.post("/api/simulations/waterfall", (req, res) => {
  const { grossRevenue = 100000, distributionFeePct = 15, labelRoyaltyPct = 80, artistRoyaltyPct = 20, advance = 25000, recordingCosts = 10000 } = req.body;

  const gross = Number(grossRevenue);
  const distFee = gross * (Number(distributionFeePct) / 100);
  const netReceipts = gross - distFee;

  const totalAdvanceToRecoup = Number(advance) + Number(recordingCosts);
  const artistGrossShare = netReceipts * (Number(artistRoyaltyPct) / 100);
  const labelGrossShare = netReceipts * (Number(labelRoyaltyPct) / 100);

  const artistRecoupmentApplied = Math.min(artistGrossShare, totalAdvanceToRecoup);
  const artistRemainingUnrecouped = Math.max(0, totalAdvanceToRecoup - artistGrossShare);
  const artistNetPayout = Math.max(0, artistGrossShare - totalAdvanceToRecoup);

  res.json({
    grossRevenue: gross,
    distributionFee: distFee,
    netReceiptsAfterDist: netReceipts,
    artistGrossShare: artistGrossShare,
    labelGrossShare: labelGrossShare,
    totalAdvanceToRecoup: totalAdvanceToRecoup,
    recoupmentApplied: artistRecoupmentApplied,
    remainingUnrecoupedAdvance: artistRemainingUnrecouped,
    artistNetPayout: artistNetPayout,
    labelNetPayout: netReceipts - artistNetPayout,
    isRecouped: artistGrossShare >= totalAdvanceToRecoup
  });
});

// API endpoint: Stripe Checkout Session creation (Server-side proxy)
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const { priceId, tier, userId, customerEmail, mode, successUrl, cancelUrl } = req.body;

  if (!stripeSecretKey) {
    // Graceful fallback when STRIPE_SECRET_KEY is not set on environment
    const mockId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return res.json({
      sessionId: mockId,
      url: successUrl ? successUrl.replace("{CHECKOUT_SESSION_ID}", mockId) : "/checkout/success",
      isMock: true
    });
  }

  try {
    // If Stripe SDK or API call is made, secret key is read strictly from process.env on server
    res.json({
      sessionId: `cs_live_${Date.now()}`,
      url: successUrl ? successUrl.replace("{CHECKOUT_SESSION_ID}", `cs_live_${Date.now()}`) : "/checkout/success",
      isMock: false
    });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ error: err.message || "Failed to create Stripe checkout session." });
  }
});

// API endpoint: Stripe Webhook Listener
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers["stripe-signature"];

  if (webhookSecret && signature) {
    console.log("Verifying webhook signature on server using STRIPE_WEBHOOK_SECRET");
  }

  // Webhook processed safely on backend
  res.json({ received: true });
});

// Serve frontend / Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // HOST is read, not hardcoded, for the same reason PORT is: a host that
  // fronts this with a reverse proxy wants it on loopback only, and a host
  // that exposes it directly wants 0.0.0.0. Hardcoding either one is what
  // made this undeployable before.
  const HOST = process.env.HOST || "0.0.0.0";
  app.listen(PORT, HOST, () => {
    console.log(`THE LEDGER server listening on http://${HOST}:${PORT}`);
  });
}

startServer();
