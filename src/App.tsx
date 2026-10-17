/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TabType } from "./types";
import { Header } from "./components/Header";
import { ContractAnalyzer } from "./components/ContractAnalyzer";
import { RightsGraph } from "./components/RightsGraph";
import { RevenueWaterfall } from "./components/RevenueWaterfall";
import { LearningHub } from "./components/LearningHub";
import { RepoExplorer } from "./components/RepoExplorer";
import { AIAssistantDrawer } from "./components/AIAssistantDrawer";
import { ShieldCheck, Code2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("analyzer");
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isDevMode, setIsDevMode] = useState<boolean>(false);

  const handleToggleDevMode = () => {
    setIsDevMode((prev) => {
      const next = !prev;
      if (!next && activeTab === "repo-explorer") {
        setActiveTab("analyzer");
      }
      return next;
    });
  };
  
  // Cross-component state transfers
  const [waterfallEstimates, setWaterfallEstimates] = useState<{
    artistRoyaltyRate?: number;
    advanceAmount?: number;
    labelShareRate?: number;
  }>({});

  const handleNavigateToWaterfall = (estimates?: { artistRoyaltyRate: number; advanceAmount: number; labelShareRate: number }) => {
    if (estimates) {
      setWaterfallEstimates(estimates);
    }
    setActiveTab("waterfall");
  };

  const handleNavigateToRightsGraph = (_dealType: string) => {
    setActiveTab("rights-graph");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
      
      {/* Navigation Header */}
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          isDevMode={isDevMode}
          onToggleDevMode={handleToggleDevMode}
        />

        {/* Homepage Hero Banner */}
        {activeTab === "analyzer" && (
          <section
            aria-label="THE LEDGER introduction"
            className="w-full overflow-hidden bg-[#080807] border-b border-amber-500/20"
          >
            <img
              src="/images/ledger-hero.png"
              alt="THE LEDGER — Know Your Deal. Own Your Future."
              className="block w-full h-auto max-h-[560px] object-contain mx-auto"
              fetchPriority="high"
            />
          </section>
        )}

        {/* Main Workspace View */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "analyzer" && (
            <ContractAnalyzer
              onNavigateToWaterfall={handleNavigateToWaterfall}
              onNavigateToRightsGraph={handleNavigateToRightsGraph}
            />
          )}

          {activeTab === "rights-graph" && <RightsGraph />}

          {activeTab === "waterfall" && (
            <RevenueWaterfall initialEstimates={waterfallEstimates} />
          )}

          {activeTab === "education" && <LearningHub />}

          {activeTab === "repo-explorer" && (
            isDevMode ? (
              <RepoExplorer />
            ) : (
              <div className="bg-slate-900/90 rounded-2xl p-8 border border-slate-800 text-center space-y-4 max-w-lg mx-auto my-12">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                  <Code2 className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold font-mono text-slate-100">Developer Mode Restricted</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The Repository & Specs Explorer is reserved for developer mode. Enable Developer Mode in the header to inspect internal documentation, system registry, and codebase structure.
                </p>
                <button
                  onClick={handleToggleDevMode}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono tracking-wider transition-all cursor-pointer"
                >
                  Enable Developer Mode
                </button>
              </div>
            )
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950/90 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              TL
            </div>
            <div>
              <div className="font-bold text-slate-200">THE LEDGER</div>
              <div className="text-[11px] text-slate-400">Music Rights Education Platform</div>
            </div>
          </div>

          <div className="text-center md:text-left text-slate-400 text-[11px]">
            <span>Know your rights before you sign.</span>
            <span className="mx-2">•</span>
            <span>T&F Media Division</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <button
              onClick={handleToggleDevMode}
              className={`flex items-center space-x-1.5 px-2 py-1 rounded transition-colors cursor-pointer ${
                isDevMode ? "text-amber-400 bg-amber-500/10 border border-amber-500/30" : "hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Dev Mode: {isDevMode ? "ON" : "OFF"}</span>
            </button>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Security Baseline Active</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

    </div>
  );
}
