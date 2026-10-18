import React, { useState } from 'react';
import {
  Phase,
  LedgersAnalysisModel,
  LedgersWaterfallModel,
  ReconciliationState,
  ExportButtonState,
  AssumptionItem
} from '../types/ledger';
import { ContractStatus } from '../components/ContractStatus';
import { RiskSummary } from '../components/RiskSummary';
import { RiskCard } from '../components/RiskCard';
import { RevenueWaterfall } from '../components/RevenueWaterfall';
import { ReconciliationBadge } from '../components/ReconciliationBadge';
import { ExportButton } from '../components/ExportButton';
import { AssumptionPanel } from '../components/AssumptionPanel';
import { generateContractPDF } from '../utils/pdfGenerator';
import { SAMPLE_CONTRACTS, DEFAULT_SAMPLE, DEFAULT_SAMPLE_INDEX } from '../data/sampleContracts';
import { formatCurrency } from '../lib/formatCurrency';
import { ShieldCheck, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { DEAL_TYPE_UNKNOWN } from "../types";

export const LedgerPage: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('ready');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(DEFAULT_SAMPLE_INDEX);
  const [exportState, setExportState] = useState<ExportButtonState>('enabled');

  const currentSample = SAMPLE_CONTRACTS[selectedSampleIndex] || DEFAULT_SAMPLE;
  const analysis = currentSample.analysis;

  // Domain Waterfall calculations state derived for Ledger page
  const grossRevenue = 100000;
  const distFeePct = 15;
  const distFee = grossRevenue * (distFeePct / 100);
  const netAfterDist = grossRevenue - distFee;
  const artistRoyaltyPct = analysis.waterfallEstimates?.artistRoyaltyRate ?? 20;
  const labelRoyaltyPct = analysis.waterfallEstimates?.labelShareRate ?? 80;
  const advanceAmount = analysis.waterfallEstimates?.advanceAmount ?? 25000;
  
  const artistGrossShare = netAfterDist * (artistRoyaltyPct / 100);
  const labelGrossShare = netAfterDist * (labelRoyaltyPct / 100);
  const recoupmentApplied = Math.min(artistGrossShare, advanceAmount);
  const remainingAdvance = Math.max(0, advanceAmount - artistGrossShare);
  const artistNetPayout = Math.max(0, artistGrossShare - advanceAmount);

  const waterfallModel: LedgersWaterfallModel = {
    grossRevenue,
    distributionFeePct: distFeePct,
    netAfterDist,
    advanceAmount,
    recoupmentApplied,
    remainingAdvance,
    artistShare: artistGrossShare,
    labelShare: labelGrossShare,
    producerShare: netAfterDist * 0.03,
    publisherShare: netAfterDist * 0.5,
    reconciliationState: 'balanced' as ReconciliationState,
    reconciliationDelta: 0,
    steps: [
      { id: '1', name: 'Gross DSP Revenues', description: 'Raw streaming and sales income', amount: grossRevenue, remainingBalance: grossRevenue, type: 'gross' },
      { id: '2', name: 'Distribution Fee (15%)', description: 'Aggregator distribution fee deduction', amount: distFee, remainingBalance: netAfterDist, type: 'fee' },
      { id: '3', name: 'Advance Recoupment', description: 'Label advance repayment from artist share', amount: recoupmentApplied, remainingBalance: netAfterDist - recoupmentApplied, type: 'recoupment' },
      { id: '4', name: 'Label Net Share (80%)', description: 'Record label gross share + recouped advance', amount: labelGrossShare + recoupmentApplied, remainingBalance: artistNetPayout, type: 'split' },
      { id: '5', name: 'Artist Net Payout (20%)', description: 'Final net cash payout to artist bank account', amount: artistNetPayout, remainingBalance: 0, type: 'payout', recipient: 'Artist' }
    ],
    assumptions: [
      'Royalty base calculated on Net Receipts after distribution fees',
      'Advance treated as 100% recoupable from artist royalties only',
      'Video and recording budgets excluded from cross-collateralization unless noted'
    ],
    warnings: [
      'Artist royalty rate (20%) is significantly below independent market median (50%-85%)',
      'Ancillary revenue streams (merch, touring) cross-collateralized in 360 clause'
    ]
  };

  const assumptionsList: AssumptionItem[] = [
    {
      id: 'a1',
      type: 'verified',
      label: 'Royalty Base Structure',
      detail: 'Interpreted as Net Receipts after deducting distribution costs.',
      sourceClause: 'Section 4.1'
    },
    {
      id: 'a2',
      type: 'inferred',
      label: 'Advance Recoupment Terms',
      detail: 'Modeled as 100% recoupable against artist mechanical and master royalties.',
      sourceClause: 'Section 6.2'
    },
    {
      id: 'a3',
      type: 'warning',
      label: '360 Ancillary Income Scope',
      detail: 'Includes touring (15%), merchandise (20%), and publishing (25%).',
      sourceClause: 'Section 12.3'
    },
    {
      id: 'a4',
      type: 'missing',
      label: 'Audit Rights Lookback Limit',
      detail: 'Contract fails to specify standard 3-year audit limitation window.',
      sourceClause: 'Omitted'
    }
  ];

  const handleExportPDF = () => {
    setExportState('exporting');
    setPhase('pdf-exporting');

    setTimeout(() => {
      try {
        generateContractPDF(analysis);
        setExportState('enabled');
        setPhase('ready');
      } catch (err) {
        console.error('PDF generation error:', err);
        setExportState('enabled');
        setPhase('ready');
      }
    }, 600);
  };

  return (
    <div id="ledger-page-container" className="space-y-8 animate-fadeIn pb-12">
      
      {/* Contract Lifecycle Status Component */}
      <ContractStatus
        phase={phase}
        fileName={currentSample.title}
        progressPct={100}
      />

      {/* Contract Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>CONTRACT INTELLIGENCE WORKSPACE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100">
            {analysis.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Category: <span className="text-slate-300 font-medium">{analysis.dealType || DEAL_TYPE_UNKNOWN}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedSampleIndex}
            onChange={(e) => setSelectedSampleIndex(Number(e.target.value))}
            className="bg-slate-950 text-slate-200 text-xs font-mono rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500"
          >
            {SAMPLE_CONTRACTS.map((sample, idx) => (
              <option key={sample.id} value={idx}>
                Sample: {sample.title}
              </option>
            ))}
          </select>

          <ExportButton
            state={exportState}
            onExport={handleExportPDF}
            label="Export Audit PDF"
          />
        </div>
      </div>

      {/* Risk Summary Component */}
      <RiskSummary
        score={100 - (analysis.riskScore || 50)}
        level={
          analysis.riskScore > 70
            ? 'critical'
            : analysis.riskScore > 40
            ? 'high'
            : analysis.riskScore > 20
            ? 'medium'
            : 'low'
        }
        redFlagsCount={analysis.redFlags?.length || 0}
        fairTermsCount={analysis.fairTerms?.length || 0}
        topConcern={analysis.redFlags?.[0]?.clause || '360 Ancillary Income Entrapment'}
      />

      {/* Risk Cards & Red Flags Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <span>Critical Clause Risk Cards ({analysis.redFlags?.length || 0})</span>
          </h3>
          <ReconciliationBadge state="balanced" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.redFlags?.slice(0, 4).map((rf, idx) => (
            <RiskCard
              key={idx}
              title={rf.clause}
              explanation={rf.explanation}
              severity={rf.riskLevel === 'HIGH' ? 'high' : rf.riskLevel === 'MEDIUM' ? 'medium' : 'low'}
              questionToAsk={rf.questionToAsk}
            />
          ))}
        </div>
      </div>

      {/* Assumption Panel — Trust & Transparency Layer */}
      <AssumptionPanel
        assumptions={assumptionsList}
        warnings={waterfallModel.warnings}
      />

      {/* Revenue Waterfall Component */}
      <RevenueWaterfall
        initialEstimates={{
          artistRoyaltyRate: artistRoyaltyPct,
          advanceAmount: advanceAmount,
          labelShareRate: labelRoyaltyPct
        }}
      />
    </div>
  );
};
