import React, { useState } from 'react';
import { MediaItem, MemoryEvent, LifeRecap } from '../types';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Play, 
  Clock, 
  GitFork, 
  ChevronRight, 
  X, 
  Flame, 
  Layers,
  ArrowRight,
  Share2,
  Heart
} from 'lucide-react';

interface MemoriesViewProps {
  gallery: MediaItem[];
  memoryEvents: MemoryEvent[];
  lifeRecaps: LifeRecap[];
  onSelectMediaItem: (item: MediaItem) => void;
  onSelectMemoryEvent: (event: MemoryEvent) => void;
  onFilterByKeyword: (keyword: string) => void;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({
  gallery,
  memoryEvents,
  lifeRecaps,
  onSelectMediaItem,
  onSelectMemoryEvent,
  onFilterByKeyword
}) => {
  const [activeStoryRecap, setActiveStoryRecap] = useState<LifeRecap | null>(null);
  const [storySlideIndex, setStorySlideIndex] = useState(0);
  const [activeGraphFilter, setActiveGraphFilter] = useState<string | null>(null);

  // Time machine comparison
  const aug2025Items = gallery.filter(g => g.timestamp.startsWith('2025-08'));
  const aug2026Items = gallery.filter(g => g.timestamp.startsWith('2026-08'));

  // Knowledge graph nodes
  const knowledgeNodes = [
    { id: 'honda', label: 'Honda CB350', type: 'vehicle', count: 4, color: 'border-cyan-400 bg-cyan-500/20 text-cyan-300' },
    { id: 'hyderabad', label: 'Hyderabad', type: 'place', count: 6, color: 'border-indigo-400 bg-indigo-500/20 text-indigo-300' },
    { id: 'araku', label: 'Araku Valley', type: 'place', count: 2, color: 'border-emerald-400 bg-emerald-500/20 text-emerald-300' },
    { id: 'goa', label: 'Goa Coast', type: 'place', count: 2, color: 'border-amber-400 bg-amber-500/20 text-amber-300' },
    { id: 'receipts', label: 'Receipts & Bills', type: 'doc', count: 3, color: 'border-purple-400 bg-purple-500/20 text-purple-300' },
    { id: 'biryani', label: 'Hyderabadi Dining', type: 'food', count: 2, color: 'border-rose-400 bg-rose-500/20 text-rose-300' },
    { id: 'golden', label: 'Golden Retriever', type: 'pet', count: 2, color: 'border-yellow-400 bg-yellow-500/20 text-yellow-300' }
  ];

  const handleOpenStory = (recap: LifeRecap) => {
    setActiveStoryRecap(recap);
    setStorySlideIndex(0);
  };

  const handleNextSlide = () => {
    if (!activeStoryRecap) return;
    if (storySlideIndex < activeStoryRecap.highlightItemIds.length - 1) {
      setStorySlideIndex(prev => prev + 1);
    } else {
      setActiveStoryRecap(null);
    }
  };

  const handlePrevSlide = () => {
    if (storySlideIndex > 0) {
      setStorySlideIndex(prev => prev - 1);
    }
  };

  return (
    <div id="lumafind-memories-view" className="space-y-8 pb-28 pt-2">
      {/* 1. Header */}
      <section className="px-4">
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
          Visual Memories & Recaps
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          Synthesized chapters of your life, milestones and visual timelines
        </p>
      </section>

      {/* 2. Life Recap Stories (Instagram / Google Photos style) */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Interactive Story Recaps
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Tap to play
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {lifeRecaps.map(recap => {
            const cover = gallery.find(g => g.id === recap.coverItemId) || gallery[0];
            return (
              <div
                key={recap.id}
                id={`story-recap-${recap.id}`}
                onClick={() => handleOpenStory(recap)}
                className="relative flex-none w-36 h-56 rounded-3xl overflow-hidden glass-panel border-2 border-cyan-500/40 hover:border-cyan-400 cursor-pointer group shadow-xl shadow-cyan-950/30 transition-all duration-300 bg-slate-900"
              >
                <img
                  src={cover.thumbnailUrl || cover.url}
                  alt={recap.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/20" />

                {/* Ambient pulse ring */}
                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-cyan-500/80 flex items-center justify-center text-slate-950 shadow-md">
                  <Play className="w-3.5 h-3.5 fill-slate-950 translate-x-0.5" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                  <span className="text-[9px] font-mono uppercase text-cyan-300 font-bold block">
                    {recap.timeframe}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {recap.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono block pt-0.5">
                    {recap.highlightItemIds.length} highlights
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Luma Time Machine: 1 Year Ago Today */}
      <section className="px-4">
        <div className="p-4 rounded-3xl glass-panel border border-cyan-500/30 space-y-3 bg-slate-950/80 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Luma Time Machine
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              August 2025 ⟷ August 2026
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Exactly 1 year ago, you were on the beach in Goa with your Golden Retriever and sunset views. Today in August 2026, you tuned your Honda CB350 motorcycle and captured city architecture in Hyderabad.
          </p>

          {/* Side by side comparison */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {aug2025Items[0] && (
              <div
                onClick={() => onSelectMediaItem(aug2025Items[0])}
                className="aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-white/10 relative cursor-pointer group"
              >
                <img src={aug2025Items[0].url} alt="1 Year Ago" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-[9px] font-mono text-amber-300 font-bold block uppercase">
                    1 Year Ago • Aug 2025
                  </span>
                  <p className="text-xs font-bold text-white truncate">Goa Beach Sunset</p>
                </div>
              </div>
            )}

            {aug2026Items[0] && (
              <div
                onClick={() => onSelectMediaItem(aug2026Items[0])}
                className="aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-white/10 relative cursor-pointer group"
              >
                <img src={aug2026Items[0].url} alt="This Year" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-[9px] font-mono text-cyan-300 font-bold block uppercase">
                    This Month • Aug 2026
                  </span>
                  <p className="text-xs font-bold text-white truncate">Honda CB350 Upgrade</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Interactive Visual Knowledge Graph */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Visual Knowledge Graph
            </h3>
          </div>
          <span className="text-[11px] font-mono text-violet-400">
            Tap node to filter
          </span>
        </div>

        <div className="p-4 rounded-3xl glass-panel border border-violet-500/20 bg-slate-950/70 space-y-3">
          <p className="text-xs text-slate-400">
            Explore how your places, vehicles, food, receipts and events are interconnected in your visual memory:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {knowledgeNodes.map(node => (
              <button
                key={node.id}
                id={`graph-node-${node.id}`}
                onClick={() => onFilterByKeyword(node.label)}
                className={`px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all duration-200 flex items-center gap-2 hover:scale-105 ${node.color}`}
              >
                <span>{node.label}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-mono font-normal">
                  {node.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Memory Chapters Timeline */}
      <section className="px-4 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Synthesized Memory Events
        </h3>

        <div className="space-y-4">
          {memoryEvents.map(event => {
            const eventItems = event.itemIds.map(id => gallery.find(g => g.id === id)).filter(Boolean) as MediaItem[];

            return (
              <div
                key={event.id}
                id={`memory-event-full-${event.id}`}
                onClick={() => onSelectMemoryEvent(event)}
                className="p-4 rounded-3xl glass-panel border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 cursor-pointer group shadow-lg shadow-black/40 bg-slate-950/80 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{event.dateRange}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {event.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                {/* Thumbnails row */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {eventItems.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-900">
                      <img src={item.thumbnailUrl || item.url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Full Screen Story Player Modal (if opened) */}
      {activeStoryRecap && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between animate-fadeIn">
          {/* Top Progress Bars */}
          <div className="px-4 pt-4 flex gap-1.5 z-20">
            {activeStoryRecap.highlightItemIds.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-cyan-400 transition-all duration-300 ${
                    idx < storySlideIndex ? 'w-full' : idx === storySlideIndex ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Story Header */}
          <div className="px-4 py-3 flex items-center justify-between z-20 text-white">
            <div>
              <h4 className="text-sm font-bold">{activeStoryRecap.title}</h4>
              <p className="text-[11px] text-cyan-300 font-mono">{activeStoryRecap.timeframe}</p>
            </div>
            <button
              id="close-story-player-btn"
              onClick={() => setActiveStoryRecap(null)}
              className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo Slide */}
          {(() => {
            const currentItemId = activeStoryRecap.highlightItemIds[storySlideIndex];
            const currentItem = gallery.find(g => g.id === currentItemId) || gallery[0];
            const stat = activeStoryRecap.stats[storySlideIndex % activeStoryRecap.stats.length];

            return (
              <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden">
                <img
                  src={currentItem.url}
                  alt={currentItem.title}
                  className="max-h-[70vh] w-auto rounded-3xl object-contain shadow-2xl"
                />

                {/* Left/Right Touch navigation triggers */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full cursor-pointer" onClick={handlePrevSlide} />
                  <div className="w-1/2 h-full cursor-pointer" onClick={handleNextSlide} />
                </div>

                {/* Bottom Story Storytelling text */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 text-white space-y-2 pointer-events-none">
                  {stat && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20">
                        {stat.label}: {stat.value}
                      </span>
                    </div>
                  )}
                  <h5 className="text-base font-bold">{currentItem.title}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentItem.aiDescription || currentItem.ocrText}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Bottom Action bar */}
          <div className="px-4 pb-6 pt-2 flex items-center justify-between z-20">
            <span className="text-xs text-slate-400 font-mono">
              {storySlideIndex + 1} of {activeStoryRecap.highlightItemIds.length}
            </span>
            <button
              onClick={handleNextSlide}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <span>{storySlideIndex < activeStoryRecap.highlightItemIds.length - 1 ? 'Next' : 'Done'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
