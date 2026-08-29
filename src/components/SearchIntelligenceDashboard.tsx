import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  FileText, 
  Eye, 
  Brain, 
  Compass, 
  Sliders, 
  RotateCcw, 
  Info, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { 
  SearchContextState, 
  SearchContextStep, 
  SearchRelevanceWeights, 
  SearchResultGrouped, 
  QueryConcepts 
} from '../types';
import { localAi } from '../services/localAiEngine';

interface SearchIntelligenceDashboardProps {
  searchContext: SearchContextState;
  searchResults: SearchResultGrouped;
  activeConcepts: QueryConcepts | null;
  onJumpToContextStep?: (stepId: string) => void;
  onApplyCustomWeights?: (weights: SearchRelevanceWeights) => void;
}

export const SearchIntelligenceDashboard: React.FC<SearchIntelligenceDashboardProps> = ({
  searchContext,
  searchResults,
  activeConcepts,
  onJumpToContextStep,
  onApplyCustomWeights
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showNeuralTuner, setShowNeuralTuner] = useState<boolean>(false);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // Custom Tuning State
  const [customOcr, setCustomOcr] = useState<number>(35);
  const [customVisual, setCustomVisual] = useState<number>(35);
  const [customSemantic, setCustomSemantic] = useState<number>(20);
  const [customMeta, setCustomMeta] = useState<number>(10);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Determine active step
  const activeStep = searchContext.steps.find(s => s.id === (selectedStepId || searchContext.activeStepId)) 
    || (searchContext.steps.length > 0 ? searchContext.steps[searchContext.steps.length - 1] : null);

  const activeQuery = activeStep?.query || searchResults.explanation.detectedConcepts.join(' ') || 'Current Search';
  const activeStepConcepts = activeStep?.concepts || activeConcepts || {
    objects: [],
    textIntent: [],
    searchSources: ['Visual AI', 'OCR', 'Metadata', 'Semantic Search']
  };

  // Compute or get weights for the currently active/selected step
  const currentWeights: SearchRelevanceWeights = React.useMemo(() => {
    if (isCustomMode) {
      return localAi.calculateRelevanceWeights(
        activeQuery,
        activeStepConcepts,
        activeStep || undefined,
        { ocr: customOcr, visual: customVisual, semantic: customSemantic, metadata: customMeta }
      );
    }

    if (activeStep?.weights) {
      return activeStep.weights;
    }

    if (searchResults.weights) {
      return searchResults.weights;
    }

    return localAi.calculateRelevanceWeights(
      activeQuery,
      activeStepConcepts,
      activeStep || undefined
    );
  }, [
    activeStep, 
    searchResults.weights, 
    activeQuery, 
    activeStepConcepts, 
    isCustomMode, 
    customOcr, 
    customVisual, 
    customSemantic, 
    customMeta
  ]);

  // Sync tuner sliders with auto-calculated weights when step changes
  useEffect(() => {
    if (!isCustomMode) {
      setCustomOcr(currentWeights.ocrWeight);
      setCustomVisual(currentWeights.visualWeight);
      setCustomSemantic(currentWeights.semanticWeight);
      setCustomMeta(currentWeights.metadataWeight);
    }
  }, [currentWeights, isCustomMode]);

  // Handle Preset Selection
  const handleApplyPreset = (preset: 'auto' | 'ocr' | 'visual' | 'semantic' | 'balanced') => {
    if (preset === 'auto') {
      setIsCustomMode(false);
      const autoWeights = localAi.calculateRelevanceWeights(activeQuery, activeStepConcepts, activeStep || undefined);
      setCustomOcr(autoWeights.ocrWeight);
      setCustomVisual(autoWeights.visualWeight);
      setCustomSemantic(autoWeights.semanticWeight);
      setCustomMeta(autoWeights.metadataWeight);
      if (onApplyCustomWeights) onApplyCustomWeights(autoWeights);
      return;
    }

    setIsCustomMode(true);
    let o = 25, v = 25, s = 25, m = 25;
    if (preset === 'ocr') {
      o = 55; v = 20; s = 15; m = 10;
    } else if (preset === 'visual') {
      o = 15; v = 55; s = 20; m = 10;
    } else if (preset === 'semantic') {
      o = 15; v = 20; s = 55; m = 10;
    } else if (preset === 'balanced') {
      o = 30; v = 30; s = 25; m = 15;
    }
    setCustomOcr(o);
    setCustomVisual(v);
    setCustomSemantic(s);
    setCustomMeta(m);

    const tuned = localAi.calculateRelevanceWeights(
      activeQuery,
      activeStepConcepts,
      activeStep || undefined,
      { ocr: o, visual: v, semantic: s, metadata: m }
    );
    if (onApplyCustomWeights) onApplyCustomWeights(tuned);
  };

  const getDominantBadge = (dominant: string) => {
    switch (dominant) {
      case 'OCR':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          icon: FileText,
          label: 'OCR Text Prioritized'
        };
      case 'Visual AI':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          dot: 'bg-cyan-400',
          icon: Eye,
          label: 'Visual AI Prioritized'
        };
      case 'Semantic':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          dot: 'bg-purple-400',
          icon: Brain,
          label: 'Semantic Vectors Prioritized'
        };
      case 'Metadata':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
          icon: Compass,
          label: 'Metadata Geotag Prioritized'
        };
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          dot: 'bg-blue-400',
          icon: Layers,
          label: 'Multimodal Balanced'
        };
    }
  };

  const badge = getDominantBadge(currentWeights.dominantEngine);
  const DominantIcon = badge.icon;

  return (
    <div 
      id="ai-search-intelligence-dashboard" 
      className="rounded-3xl glass-panel border border-white/[0.08] bg-slate-950/80 shadow-2xl shadow-black/60 overflow-hidden transition-all duration-300"
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] bg-gradient-to-r from-slate-950 via-slate-900/60 to-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                AI Search Intelligence
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                Neural Multi-Layer
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Active Step:</span>
              <span className="font-mono text-cyan-300 font-semibold truncate max-w-[200px] sm:max-w-[320px]">
                {activeStep ? activeStep.filterLabel : activeQuery}
              </span>
              {searchContext.steps.length > 1 && (
                <span className="text-[11px] text-slate-500">
                  ({(searchContext.steps.findIndex(s => s.id === activeStep?.id) + 1) || 1} of {searchContext.steps.length})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Status Pill & Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className={`px-3 py-1 rounded-full border text-xs font-mono font-medium flex items-center gap-1.5 shadow-sm ${badge.bg}`}>
            <span className={`w-2 h-2 rounded-full animate-ping ${badge.dot}`} />
            <DominantIcon className="w-3.5 h-3.5" />
            <span className="font-semibold">{badge.label}</span>
          </div>

          <button
            type="button"
            id="toggle-neural-tuner-btn"
            onClick={() => setShowNeuralTuner(!showNeuralTuner)}
            className={`p-2 rounded-xl text-xs font-mono transition-all border ${
              showNeuralTuner || isCustomMode
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
            title="Open Neural Weights Tuner"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="collapse-intelligence-dashboard-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
            title={isExpanded ? 'Collapse Dashboard' : 'Expand Dashboard'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Expanded Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Step Selector Breadcrumb if multi-step search exists */}
          {searchContext.steps.length > 1 && (
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
              <span className="text-slate-500 font-mono shrink-0 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Step Intelligence Chain:
              </span>
              {searchContext.steps.map((step, idx) => {
                const isSelected = (selectedStepId || searchContext.activeStepId) === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      setSelectedStepId(step.id);
                      if (onJumpToContextStep && step.id !== searchContext.activeStepId) {
                        onJumpToContextStep(step.id);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 shrink-0 border ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 font-bold shadow-sm'
                        : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="opacity-60 text-[10px]">{idx + 1}.</span>
                    <span>{step.filterLabel}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 border border-white/[0.1] text-slate-400">
                      {step.totalMatches}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Interactive Stacked Multi-Layer Distribution Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Dynamic Layer Weight Synthesis (Sum: 100%)
              </span>
              <span className="text-slate-500 text-[11px]">
                {isCustomMode ? '⚙️ Custom Simulation Mode' : '⚡ Real-Time Adaptive AI'}
              </span>
            </div>

            <div className="h-4 w-full rounded-xl overflow-hidden bg-slate-900 border border-white/[0.08] flex p-0.5 gap-1">
              <div 
                style={{ width: `${currentWeights.ocrWeight}%` }} 
                className="h-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500 relative group cursor-pointer"
                title={`OCR Layer: ${currentWeights.ocrWeight}%`}
              />
              <div 
                style={{ width: `${currentWeights.visualWeight}%` }} 
                className="h-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-500 relative group cursor-pointer"
                title={`Visual AI Layer: ${currentWeights.visualWeight}%`}
              />
              <div 
                style={{ width: `${currentWeights.semanticWeight}%` }} 
                className="h-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500 relative group cursor-pointer"
                title={`Semantic Layer: ${currentWeights.semanticWeight}%`}
              />
              <div 
                style={{ width: `${currentWeights.metadataWeight}%` }} 
                className="h-full rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 transition-all duration-500 relative group cursor-pointer"
                title={`Metadata Layer: ${currentWeights.metadataWeight}%`}
              />
            </div>
          </div>

          {/* 4 Multi-Layer Relevance Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. OCR Layer */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-emerald-500/20 hover:border-emerald-500/40 transition-all space-y-3 group shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">OCR Text</span>
                </div>
                <span className="text-xl font-bold font-mono text-emerald-300">
                  {currentWeights.ocrWeight}%
                </span>
              </div>

              {/* Progress meter */}
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/[0.04]">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                  style={{ width: `${currentWeights.ocrWeight}%` }} 
                />
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Lexical Match:</span>
                  <span className="font-mono text-slate-200">
                    {activeStepConcepts.textIntent.length > 0 ? activeStepConcepts.textIntent.join(', ') : 'Standard'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Document Filter:</span>
                  <span className="font-mono text-emerald-400">
                    {activeStepConcepts.documentType || 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Visual AI Layer */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-cyan-500/20 hover:border-cyan-500/40 transition-all space-y-3 group shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">Visual AI</span>
                </div>
                <span className="text-xl font-bold font-mono text-cyan-300">
                  {currentWeights.visualWeight}%
                </span>
              </div>

              {/* Progress meter */}
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/[0.04]">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500" 
                  style={{ width: `${currentWeights.visualWeight}%` }} 
                />
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Target Objects:</span>
                  <span className="font-mono text-slate-200 truncate max-w-[120px]">
                    {activeStepConcepts.objects.length > 0 ? activeStepConcepts.objects.slice(0, 2).join(', ') : 'Scene'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Color Segmentation:</span>
                  <span className="font-mono text-cyan-300">
                    {activeStepConcepts.colors && activeStepConcepts.colors.length > 0 
                      ? activeStepConcepts.colors.join(', ') 
                      : 'Broad'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Semantic Layer */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-3 group shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <Brain className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">Semantic</span>
                </div>
                <span className="text-xl font-bold font-mono text-purple-300">
                  {currentWeights.semanticWeight}%
                </span>
              </div>

              {/* Progress meter */}
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/[0.04]">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500" 
                  style={{ width: `${currentWeights.semanticWeight}%` }} 
                />
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Concept Intent:</span>
                  <span className="font-mono text-slate-200 truncate max-w-[120px]">
                    {activeStep?.filterType !== 'initial' ? activeStep?.filterType : 'Universal'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Memory Association:</span>
                  <span className="font-mono text-purple-300">Active</span>
                </div>
              </div>
            </div>

            {/* 4. Metadata Layer */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-3 group shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">Metadata</span>
                </div>
                <span className="text-xl font-bold font-mono text-amber-300">
                  {currentWeights.metadataWeight}%
                </span>
              </div>

              {/* Progress meter */}
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/[0.04]">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500" 
                  style={{ width: `${currentWeights.metadataWeight}%` }} 
                />
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Date Bounding:</span>
                  <span className="font-mono text-slate-200 truncate max-w-[110px]">
                    {activeStepConcepts.dateRange || 'All Time'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Location:</span>
                  <span className="font-mono text-amber-300 truncate max-w-[110px]">
                    {activeStepConcepts.location || 'Global'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rationale & Contributing Signals */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Neural Weighting Rationale
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentWeights.rationale}
                </p>
              </div>
            </div>

            {/* Contributing Signals Chips */}
            {currentWeights.contributingSignals.length > 0 && (
              <div className="pt-3 border-t border-white/[0.04] space-y-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                  Active Feature Triggers ({currentWeights.contributingSignals.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentWeights.contributingSignals.map((signal, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.05] flex items-start gap-2 text-xs"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        signal.impact === 'high' 
                          ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' 
                          : signal.impact === 'medium'
                          ? 'bg-purple-400'
                          : 'bg-slate-400'
                      }`} />
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-200 font-mono text-[11px] truncate">
                            {signal.label}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-white/[0.04] text-cyan-300 border border-white/[0.06]">
                            {signal.layer}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {signal.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Neural Weights Tuner Drawer */}
          {showNeuralTuner && (
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                    Interactive Neural Weights Simulator
                  </h4>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('auto')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                      !isCustomMode
                        ? 'bg-cyan-500/30 border-cyan-400 text-white font-bold'
                        : 'bg-slate-900 border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ Auto Adaptive
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('ocr')}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-white/[0.08] text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    📄 OCR Heavy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('visual')}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-white/[0.08] text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                  >
                    👁️ Vision Heavy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('semantic')}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-white/[0.08] text-purple-300 hover:bg-purple-500/20 transition-colors"
                  >
                    🧠 Concept Heavy
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* OCR Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-semibold">OCR Weight</span>
                    <span className="text-slate-200">{customOcr}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={customOcr}
                    onChange={(e) => {
                      setIsCustomMode(true);
                      setCustomOcr(Number(e.target.value));
                    }}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                {/* Visual AI Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-semibold">Visual AI Weight</span>
                    <span className="text-slate-200">{customVisual}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={customVisual}
                    onChange={(e) => {
                      setIsCustomMode(true);
                      setCustomVisual(Number(e.target.value));
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Semantic Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-purple-400 font-semibold">Semantic Weight</span>
                    <span className="text-slate-200">{customSemantic}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={customSemantic}
                    onChange={(e) => {
                      setIsCustomMode(true);
                      setCustomSemantic(Number(e.target.value));
                    }}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-cyan-500/20">
                <span className="font-mono text-[11px]">
                  Real-time neural normalization automatically balances weights to 100%.
                </span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('auto')}
                  className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-cyan-300 text-xs font-mono flex items-center gap-1 border border-white/[0.08]"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to AI Auto
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
