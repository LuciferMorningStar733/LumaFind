import React, { useState, useEffect } from 'react';
import { Search, Mic, Image as ImageIcon, Sparkles, X, ArrowRight, Loader2, Filter } from 'lucide-react';
import { QueryConcepts, SearchContextState } from '../types';
import { localAi } from '../services/localAiEngine';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onOpenVoiceSearch: () => void;
  onOpenImageSearch: () => void;
  isSearching?: boolean;
  activeConcepts?: QueryConcepts | null;
  searchContext?: SearchContextState;
  onSelectConcept?: (concept: string) => void;
}

const ROTATING_EXAMPLES = [
  'Honda motorcycle battery receipt',
  'Screenshot with WiFi password',
  'Beach photos from last summer',
  'Red car near a building',
  'Pizza receipt',
  'Documents containing passport number',
  'Photos of my dog at the beach'
];

const CONTEXT_FOLLOWUP_EXAMPLES = [
  'Red ones',
  'Only receipts & bills',
  'From 2026',
  'In Hyderabad',
  'Photos only',
  'With puppy',
  'Taken in Goa'
];

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearchSubmit,
  onOpenVoiceSearch,
  onOpenImageSearch,
  isSearching = false,
  activeConcepts,
  searchContext
}) => {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const hasActiveContext = searchContext && searchContext.isEnabled && searchContext.steps.length > 0;
  const activeStep = hasActiveContext ? searchContext.steps[searchContext.steps.length - 1] : null;

  // Rotate placeholder examples every 3.5 seconds when not focused or empty
  useEffect(() => {
    if (isFocused || query.length > 0) return;
    const timer = setInterval(() => {
      setExampleIndex(prev => (prev + 1) % (hasActiveContext ? CONTEXT_FOLLOWUP_EXAMPLES.length : ROTATING_EXAMPLES.length));
    }, 3500);
    return () => clearInterval(timer);
  }, [isFocused, query, hasActiveContext]);

  const currentPlaceholder = hasActiveContext
    ? `Refine ${activeStep?.filterLabel} (e.g. "${CONTEXT_FOLLOWUP_EXAMPLES[exampleIndex % CONTEXT_FOLLOWUP_EXAMPLES.length]}")`
    : ROTATING_EXAMPLES[exampleIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
    } else {
      // Use currently highlighted example if user presses enter with empty box
      onQueryChange(currentPlaceholder);
      onSearchSubmit(currentPlaceholder);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    onQueryChange(suggestion);
    onSearchSubmit(suggestion);
  };

  // Preview classification of query in context
  const previewClassification = query.trim() && searchContext 
    ? localAi.classifyQueryInContext(query, searchContext) 
    : null;

  return (
    <div id="ai-smart-search-container" className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex items-center rounded-2xl transition-all duration-300 ${
            isFocused
              ? 'glass-panel-glow ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-500/20 bg-slate-900/90'
              : 'glass-panel hover:border-cyan-500/30 bg-slate-950/70 shadow-lg shadow-black/40'
          }`}
        >
          {/* Neural Search Icon */}
          <div className="pl-4 pr-2 flex items-center justify-center text-cyan-400">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            ) : hasActiveContext ? (
              <Filter className="w-5 h-5 text-cyan-400 animate-pulse" />
            ) : (
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            )}
          </div>

          {/* Main Input */}
          <input
            id="ai-search-main-input"
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={currentPlaceholder}
            className="w-full py-3.5 bg-transparent text-slate-100 placeholder:text-slate-400 focus:outline-none text-[15px] font-normal tracking-wide"
            aria-label="Multimodal Search"
          />

          {/* Clear button */}
          {query.length > 0 && (
            <button
              type="button"
              id="clear-search-btn"
              onClick={() => {
                onQueryChange('');
              }}
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Search Button */}
          <button
            type="button"
            id="voice-search-trigger-btn"
            onClick={onOpenVoiceSearch}
            className="p-2 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Voice Visual Search"
            aria-label="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Image Visual Search Button */}
          <button
            type="button"
            id="image-search-trigger-btn"
            onClick={onOpenImageSearch}
            className="p-2 text-slate-400 hover:text-violet-300 transition-colors"
            title="Search by Photo / Image"
            aria-label="Image Search"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Submit Arrow */}
          <button
            type="submit"
            id="submit-search-btn"
            className="my-1.5 mr-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold flex items-center justify-center transition-all duration-200 shadow-md shadow-cyan-500/30 active:scale-95"
            aria-label="Execute search"
          >
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </form>

      {/* Real-time Dynamic Concept Chips & Context Intent Visualizer */}
      {query.trim().length > 1 && (
        <div className="mt-2.5 px-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {/* Contextual Refinement Indicator Pill */}
            {previewClassification && previewClassification.isFollowUp && activeStep && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shrink-0 animate-fadeIn shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Refining "{activeStep.query}" ➔ {previewClassification.filterLabel}
              </span>
            )}

            {!previewClassification?.isFollowUp && (
              <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Concepts:
              </span>
            )}
            
            {/* Auto-extracted concept chips */}
            {(() => {
              const concepts = activeConcepts || localAi.parseQuery(query);
              const chips = [
                ...(concepts.colors ? concepts.colors.map(c => ({ text: `Color: ${c}`, color: 'border-rose-500/30 bg-rose-500/10 text-rose-300' })) : []),
                ...concepts.objects.map(o => ({ text: o, type: 'object', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' })),
                ...(concepts.documentType ? [{ text: concepts.documentType, type: 'doc', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' }] : []),
                ...(concepts.dateRange ? [{ text: concepts.dateRange, type: 'date', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300' }] : []),
                ...(concepts.location ? [{ text: concepts.location, type: 'loc', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' }] : [])
              ];

              return chips.map((chip, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${chip.color} shrink-0 animate-fadeIn`}
                >
                  {chip.text}
                </span>
              ));
            })()}

            <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-auto pl-2">
              Visual AI • OCR • Metadata
            </span>
          </div>
        </div>
      )}

      {/* Suggested Quick Prompts if search input is focused with no query */}
      {isFocused && !query && (
        <div className="mt-2 p-3 rounded-2xl glass-panel border border-white/[0.08] shadow-xl animate-fadeIn">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {hasActiveContext ? `Follow-up suggestions for "${activeStep?.query}"` : 'Try Natural Language Memory Prompts'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(hasActiveContext ? CONTEXT_FOLLOWUP_EXAMPLES : ROTATING_EXAMPLES).map((example, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={() => handleApplySuggestion(example)}
                className="text-[12px] px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-200 border border-white/[0.06] hover:border-cyan-500/30 transition-colors text-left"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
