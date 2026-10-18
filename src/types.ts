export * from "./types/ledger";

export type TabType = "analyzer" | "rights-graph" | "waterfall" | "education" | "repo-explorer";

export interface RedFlag {
  clause: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  explanation: string;
  questionToAsk: string;
}


export interface FairTerm {
  clause: string;
  explanation: string;
}

export interface KeyTerm {
  term: string;
  value: string;
  impact: string;
}

export interface KeyClause {
  title: string; // e.g. "Payment Terms", "Termination", "Confidentiality", "Intellectual Property", "Liability", "Governing Law"
  originalClause: string;
  plainEnglish: string;
  potentialConcerns: string;
}

export interface RiskCard {
  title: string; // e.g. "Automatic Renewal", "Unlimited Liability", "Non-Compete", "Arbitration"
  explanation: string;
  severity?: "HIGH" | "MEDIUM" | "LOW";
}

export interface RecentDocument {
  id: string;
  name: string;
  status: "Complete" | "Processing" | "Queued";
  lastOpened: string;
  fileSize?: string;
  sampleContractId?: string;
}

// dealType, keyTerms and fairTerms are OPTIONAL as of 2026-10-11. They were
// declared required and validateAnalysis never checked them, so a Gemini
// response missing all three passed validation and the type was asserting
// something untrue of real data. Requiring them in the validator was the other
// option and it is the worse one: it would 502 an artist whose contract was
// read correctly but came back without a label, and refusing to help someone
// over a missing badge is a worse failure than a blank badge. Every read of
// the three is guarded; tsc enumerated the sites.
/** Shown wherever dealType is absent. Named once so the product says the same
 *  thing in all three places, and so it is never interpolated as "undefined". */
export const DEAL_TYPE_UNKNOWN = "Not identified";

export interface ContractAnalysis {
  title: string;
  dealType?: string;
  riskScore: number; // 1 to 100
  summary: string;
  plainEnglishTranslation: string;
  keyTerms?: KeyTerm[];
  redFlags: RedFlag[];
  fairTerms?: FairTerm[];
  questionsForAttorney: string[];
  keyClauses?: KeyClause[];
  yourResponsibilities?: string[];
  otherPartyResponsibilities?: string[];
  riskCards?: RiskCard[];
  recommendations?: string[];
  waterfallEstimates?: {
    artistRoyaltyRate: number;
    labelShareRate: number;
    advanceAmount: number;
    distributionFeeRate: number;
  };
}

export interface SampleContract {
  id: string;
  title: string;
  category: string;
  description: string;
  summaryText: string;
  defaultRiskScore: number;
  fullText: string;
  analysis: ContractAnalysis;
}

export interface RightsNode {
  id: string;
  label: string;
  type: "creator" | "entity" | "right" | "distributor";
  role: string;
  ownershipPercent?: number;
  royaltyPercent?: number;
  description: string;
  keyObligations: string[];
  riskFactor: "Low" | "Medium" | "High" | "Critical";
  x?: number;
  y?: number;
}

export interface RightsEdge {
  from: string;
  to: string;
  label: string;
  type: "ownership" | "royalty" | "service" | "obligation";
}

export interface RightsGraphPreset {
  id: string;
  name: string;
  description: string;
  nodes: RightsNode[];
  edges: RightsEdge[];
}

export interface WaterfallConfig {
  grossRevenue: number; // e.g. 100000
  distributionFeePct: number; // e.g. 15%
  labelRoyaltyPct: number; // e.g. 80% label / 20% artist
  artistRoyaltyPct: number; // e.g. 20%
  producerPointsPct: number; // e.g. 3% off top or net
  advanceAmount: number; // e.g. 25000
  recordingCosts: number; // e.g. 10000
  videoBudget: number; // e.g. 5000
  publisherSharePct: number; // e.g. 50%
}

export interface WaterfallResult {
  grossRevenue: number;
  distributionFee: number;
  netAfterDist: number;
  producerPayout: number;
  labelGrossShare: number;
  artistGrossShare: number;
  totalAdvanceToRecoup: number;
  recoupmentApplied: number;
  remainingUnrecoupedAdvance: number;
  artistNetPayout: number;
  labelNetPayout: number;
  isRecouped: boolean;
}

export interface EducationLesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  keyPoints: string[];
  clauseExample: string;
  plainEnglishExplanation: string;
  questionsToAsk: string[];
}

export interface EducationModule {
  id: string;
  title: string;
  category: string;
  iconName: string;
  description: string;
  badge: string;
  lessons: EducationLesson[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface RepoFileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: RepoFileNode[];
  content?: string;
  language?: string;
  description?: string;
}

export interface EcosystemRegistry {
  name: string;
  display_name: string;
  category: string;
  division: string;
  description: string;
  tagline: string;
  foundation: string;
  security_baseline: boolean;
  ci_enabled: boolean;
  status: string;
}
