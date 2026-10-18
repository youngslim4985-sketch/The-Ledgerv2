import React from "react";
import { TabType } from "../types";
import {
  FileText,
  GitFork,
  DollarSign,
  BookOpen,
  FolderTree,
  ShieldCheck,
  Sparkles,
  Code2
} from "lucide-react";

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAssistant: () => void;
  isDevMode: boolean;
  onToggleDevMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAssistant,
  isDevMode,
  onToggleDevMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/10 tracking-wider border border-amber-400/30">
              TL
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-100 font-mono">
                  THE LEDGER
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-medium tracking-wide">
                Music Rights Education Platform • <span className="italic text-slate-400">Know your deal. Own your future.</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              id="tab-analyzer"
              onClick={() => setActiveTab("analyzer")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "analyzer"
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Contract Workspace</span>
            </button>

            <button
              id="tab-rights-graph"
              onClick={() => setActiveTab("rights-graph")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "rights-graph"
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>Rights Graph</span>
            </button>

            <button
              id="tab-waterfall"
              onClick={() => setActiveTab("waterfall")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "waterfall"
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Revenue Waterfall</span>
            </button>

            <button
              id="tab-education"
              onClick={() => setActiveTab("education")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "education"
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Learning Hub</span>
            </button>

            {isDevMode && (
              <button
                id="tab-repo-explorer"
                onClick={() => setActiveTab("repo-explorer")}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "repo-explorer"
                    ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <FolderTree className="w-4 h-4" />
                <span>Repo & Specs</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-950/60 text-amber-300 rounded border border-amber-500/30">
                  DEV
                </span>
              </button>
            )}
          </nav>

          {/* Action & Status Badges */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-ask-ai"
              onClick={onOpenAssistant}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-medium transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Ask AI Tutor</span>
            </button>

            {/* Developer Mode Toggle */}
            <button
              id="btn-toggle-dev-mode"
              onClick={onToggleDevMode}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
                isDevMode
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10"
                  : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
              }`}
              title={
                isDevMode
                  ? "Developer Mode Enabled (Click to hide developer tabs)"
                  : "Enable Developer Mode (Unlocks Repo & Specs)"
              }
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Dev Mode</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDevMode ? "bg-amber-400 animate-pulse" : "bg-slate-600"
                }`}
              />
            </button>

            <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>T&F Baseline</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-800/80 space-x-1">
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === "analyzer" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300"
            }`}
          >
            AI Analyzer
          </button>
          <button
            onClick={() => setActiveTab("rights-graph")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === "rights-graph" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300"
            }`}
          >
            Rights Graph
          </button>
          <button
            onClick={() => setActiveTab("waterfall")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === "waterfall" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300"
            }`}
          >
            Waterfall
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === "education" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300"
            }`}
          >
            Learning
          </button>
          {isDevMode && (
            <button
              onClick={() => setActiveTab("repo-explorer")}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
                activeTab === "repo-explorer" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300"
              }`}
            >
              Repo & Docs
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
