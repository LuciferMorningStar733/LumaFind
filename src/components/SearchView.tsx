import React, { useState, useMemo } from 'react';
import { 
  MediaItem, 
  SearchResultGrouped, 
  SearchResultItem, 
  QueryConcepts,
  SearchContextState,
  SearchRelevanceWeights
} from '../types';
import { SearchBar } from './SearchBar';
import { SearchContextBar } from './SearchContextBar';
import { SearchIntelligenceDashboard } from './SearchIntelligenceDashboard';
import { localAi } from '../services/localAiEngine';
import { 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Eye, 
  Receipt, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Filter, 
  Calendar, 
  MapPin,
  ChevronDown,
  ChevronUp,
  Cpu,
  CornerDownRight
} from 'lucide-react';

interface SearchViewProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  searchResults: SearchResultGrouped;
  activeConcepts: QueryConcepts | null;
  searchContext?: SearchContextState;
  onRemoveContextStep?: (stepId: string) => void;
  onJumpToContextStep?: (stepId: string) => void;
  onClearContext?: () => void;
  onToggleContextMode?: () => void;
  isSearching: boolean;
  onOpenVoiceSearch: () => void;
  onOpenImageSearch: () => void;
  onSelectMediaItem: (item: MediaItem) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  query,
  onQueryChange,
  onSearchSubmit,
  searchResults,
  activeConcepts,
  searchContext,
  onRemoveContextStep,
  onJumpToContextStep,
  onClearContext,
  onToggleContextMode,
  isSearching,
  onOpenVoiceSearch,
  onOpenImageSearch,
  onSelectMediaItem
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'text' | 'visual' | 'documents' | 'memories'>('all');
  const [copiedOcrId, setCopiedOcrId] = useState<string | null>(null);

  const handleCopyOcr = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedOcrId(id);
    setTimeout(() => setCopiedOcrId(null), 2000);
  };

  const handleFollowUpClick = (followUpQuery: string) => {
    onQueryChange(followUpQuery);
    onSearchSubmit(followUpQuery);
  };

  const hasResults = searchResults.bestMatches.length > 0;

  // Compute dynamic contextual suggestions tailored to the current result set and search context
  const dynamicSuggestions = useMemo(() => {
    return localAi.generateContextualSuggestions(searchResults, searchContext);
  }, [searchResults, searchContext]);

  const hasActiveContext = searchContext && searchContext.steps.length > 0;

  return (
    <div id="lumafind-search-view" className="space-y-4 pb-28 pt-2">
      {/* 1. Header Search Bar */}
      <section className="px-4">
        <SearchBar
          query={query}
          onQueryChange={onQueryChange}
          onSearchSubmit={onSearchSubmit}
          onOpenVoiceSearch={onOpenVoiceSearch}
          onOpenImageSearch={onOpenImageSearch}
          isSearching={isSearching}
          activeConcepts={activeConcepts}
          searchContext={searchContext}
        />
      </section>

      {/* 2. Active Search Context Bar (Interactive Refinement Chain) */}
      {hasActiveContext && onRemoveContextStep && onJumpToContextStep && onClearContext && onToggleContextMode && (
        <section className="px-4">
          <SearchContextBar
            searchContext={searchContext}
            onRemoveStep={onRemoveContextStep}
            onJumpToStep={onJumpToContextStep}
            onClearContext={onClearContext}
            onToggleContextMode={onToggleContextMode}
            isRefining={isSearching}
          />
        </section>
      )}

      {/* 3. AI Search Intelligence Dashboard (Dynamic Relevance Weightings for Active Step) */}
      {(hasResults || hasActiveContext || query.trim().length > 0) && searchContext && (
        <section className="px-4">
          <SearchIntelligenceDashboard
            searchContext={searchContext}
            searchResults={searchResults}
            activeConcepts={activeConcepts}
            onJumpToContextStep={onJumpToContextStep}
          />
        </section>
      )}

      {/* 4. Contextual Follow-Up Refinement Chips */}
      {hasResults && dynamicSuggestions.length > 0 && (
        <section className="px-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Follow-up filter:
            </span>
            {dynamicSuggestions.map((refinement, idx) => (
              <button
                key={idx}
                id={`refine-chip-${idx}`}
                onClick={() => handleFollowUpClick(refinement)}
                className="px-3 py-1.5 rounded-xl glass-pill text-xs text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-500/40 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <span>{refinement}</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 5. Section Tabs: All, Text Matches, Visual Matches, Documents, Memories */}
      {hasResults && (
        <section className="px-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: `Best Matches (${searchResults.bestMatches.length})` },
              { id: 'text', label: `Text Matches (${searchResults.textMatches.length})` },
              { id: 'visual', label: `Visual (${searchResults.visualMatches.length})` },
              { id: 'documents', label: `Documents & Receipts (${searchResults.documentMatches.length})` },
              { id: 'memories', label: `Memories (${searchResults.relatedMemories.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                id={`search-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 6. Results Grids */}
      {hasResults ? (
        <section className="px-4 space-y-6">
          {/* Main Selected Section */}
          <div className="space-y-4">
            {/* Grid of Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(activeTab === 'all'
                ? searchResults.bestMatches
                : activeTab === 'text'
                ? searchResults.textMatches
                : activeTab === 'visual'
                ? searchResults.visualMatches
                : activeTab === 'documents'
                ? searchResults.documentMatches
                : searchResults.relatedMemories
              ).map((res, idx) => {
                const item = res.item;
                return (
                  <div
                    key={item.id}
                    id={`search-result-card-${item.id}`}
                    onClick={() => onSelectMediaItem(item)}
                    className="rounded-3xl overflow-hidden glass-panel border border-white/[0.08] hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group shadow-xl shadow-black/50 flex flex-col bg-slate-950/80"
                  >
                    {/* Media preview */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                      {/* Overall AI Match Score Pill */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full backdrop-blur-md bg-slate-950/80 border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300 flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        {res.overallScore}% AI Match
                      </div>

                      {/* Document amount badge if receipt */}
                      {item.documentMetadata?.amount && (
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 text-[11px] font-mono font-bold shadow-md">
                          {item.documentMetadata.amount}
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-mono uppercase font-semibold text-cyan-400">
                            {item.type}
                          </span>
                          <span className="font-mono">
                            {new Date(item.timestamp).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {item.title}
                        </h4>

                        {/* Highlight Reason / Matched OCR Snippet */}
                        {res.matchedHighlights.matchedOcrSnippet && (
                          <div className="mt-2 p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200 font-mono relative">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold">
                                Matched OCR Text:
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleCopyOcr(e, item.id, item.ocrText)}
                                className="p-1 text-cyan-400 hover:text-white"
                                title="Copy full OCR text"
                              >
                                {copiedOcrId === item.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <p className="line-clamp-2 italic">
                              "{res.matchedHighlights.matchedOcrSnippet}"
                            </p>
                          </div>
                        )}

                        {/* Visual detected objects tags */}
                        {item.detectedObjects.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.detectedObjects.slice(0, 3).map((obj, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-slate-300 border border-white/[0.06]"
                              >
                                {obj}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Location footer */}
                      {item.location && (
                        <div className="pt-2 border-t border-white/[0.04] flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate">{item.location.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : query.trim() || hasActiveContext ? (
        <section className="px-4 text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mx-auto text-slate-400">
            <Sparkles className="w-8 h-8 text-cyan-400/50" />
          </div>
          <h3 className="text-base font-bold text-slate-200">
            No direct matches found in current context
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try removing a context filter step above or searching for another concept, e.g. "Honda motorcycle", "WiFi password", "Araku Valley", or "Receipts from August".
          </p>
          {hasActiveContext && onClearContext && (
            <button
              onClick={onClearContext}
              className="mt-3 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
            >
              Reset Search Context Chain
            </button>
          )}
        </section>
      ) : (
        <section className="px-4 py-8 space-y-4 text-center">
          <div className="p-6 rounded-3xl glass-panel border border-cyan-500/20 max-w-md mx-auto space-y-3">
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
            <h3 className="text-sm font-bold text-slate-100">
              Multimodal Neural Search Ready
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask your visual memory anything. Search by object description, visible words in photos, document totals, or past trips.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

