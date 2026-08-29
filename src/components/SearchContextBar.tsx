import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  RotateCcw, 
  Layers, 
  SlidersHorizontal,
  Palette,
  FileText,
  Calendar,
  MapPin,
  Tag,
  HelpCircle
} from 'lucide-react';
import { SearchContextState, SearchContextStep, ContextFilterType } from '../types';

interface SearchContextBarProps {
  searchContext: SearchContextState;
  onRemoveStep: (stepId: string) => void;
  onJumpToStep: (stepId: string) => void;
  onClearContext: () => void;
  onToggleContextMode: () => void;
  isRefining?: boolean;
}

export const SearchContextBar: React.FC<SearchContextBarProps> = ({
  searchContext,
  onRemoveStep,
  onJumpToStep,
  onClearContext,
  onToggleContextMode,
  isRefining = false
}) => {
  if (searchContext.steps.length === 0) {
    return null;
  }

  const getStepIcon = (filterType: ContextFilterType) => {
    switch (filterType) {
      case 'color':
        return <Palette className="w-3 h-3 text-rose-400" />;
      case 'document_type':
      case 'category':
        return <FileText className="w-3 h-3 text-cyan-400" />;
      case 'date':
        return <Calendar className="w-3 h-3 text-amber-400" />;
      case 'location':
        return <MapPin className="w-3 h-3 text-emerald-400" />;
      case 'refinement':
        return <SlidersHorizontal className="w-3 h-3 text-violet-400" />;
      default:
        return <Tag className="w-3 h-3 text-indigo-400" />;
    }
  };

  const activeStep = searchContext.steps[searchContext.steps.length - 1];
  const rootStep = searchContext.steps[0];
  const isMultiStep = searchContext.steps.length > 1;

  return (
    <div id="search-context-bar" className="w-full mb-3">
      <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/25 rounded-xl p-2.5 shadow-lg shadow-cyan-950/20">
        {/* Header line: Title & Context mode toggle */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 tracking-wide uppercase">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Search Context Memory</span>
            </div>
            {isMultiStep && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {searchContext.steps.length} filters chained
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle context engine */}
            <button
              id="toggle-context-memory"
              onClick={onToggleContextMode}
              title={searchContext.isEnabled ? 'Context chaining active' : 'Context chaining paused'}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                searchContext.isEnabled 
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/50' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Context: {searchContext.isEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Clear All */}
            <button
              id="clear-search-context-chain"
              onClick={onClearContext}
              title="Reset search context and start fresh"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-800/40 transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Steps Breadcrumbs Flow */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <AnimatePresence mode="popLayout">
            {searchContext.steps.map((step, idx) => {
              const isLast = idx === searchContext.steps.length - 1;
              const isInitial = idx === 0;

              return (
                <React.Fragment key={step.id}>
                  {idx > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  )}

                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.85, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className={`group flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isLast
                        ? 'bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 text-cyan-200 border-cyan-500/50 shadow-sm shadow-cyan-900/30'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onJumpToStep(step.id)}
                      className="flex items-center gap-1.5 hover:underline focus:outline-none"
                      title={`Jump back to step: ${step.filterLabel}`}
                    >
                      {getStepIcon(step.filterType)}
                      <span className="font-mono truncate max-w-[130px]">
                        {isInitial ? `"${step.query}"` : step.filterLabel}
                      </span>
                      <span className="px-1 py-0.2 rounded text-[10px] font-mono bg-slate-900/60 text-slate-400 border border-slate-700/50">
                        {step.totalMatches}
                      </span>
                    </button>

                    {/* Step removal button (for refinements) */}
                    {!isInitial && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveStep(step.id);
                        }}
                        title={`Remove refinement: ${step.filterLabel}`}
                        className="p-0.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Refinement Context Summary banner */}
        {isMultiStep && activeStep && (
          <div className="mt-2 pt-1.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-cyan-400 font-medium">Narrowed:</span>
              <span className="truncate">
                Showing {activeStep.totalMatches} {activeStep.totalMatches === 1 ? 'result' : 'results'} matching all {searchContext.steps.length} context filters
              </span>
            </div>
            <div className="text-[10px] text-slate-500 hidden sm:block whitespace-nowrap pl-2">
              (Searched "{rootStep.query}" ➔ refined by {searchContext.steps.slice(1).map(s => s.query).join(' + ')})
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
