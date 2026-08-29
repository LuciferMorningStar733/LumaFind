import React, { useState } from 'react';
import { MediaItem, MemoryEvent, AppSettings } from '../types';
import { SearchBar } from './SearchBar';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  FileText, 
  Receipt, 
  Smartphone, 
  Heart, 
  ChevronRight,
  Filter,
  Eye,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

interface HomeViewProps {
  gallery: MediaItem[];
  memoryEvents: MemoryEvent[];
  settings: AppSettings;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onOpenVoiceSearch: () => void;
  onOpenImageSearch: () => void;
  onSelectMediaItem: (item: MediaItem) => void;
  onSelectMemoryEvent: (event: MemoryEvent) => void;
  onToggleFavorite: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  gallery,
  memoryEvents,
  settings,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenVoiceSearch,
  onOpenImageSearch,
  onSelectMediaItem,
  onSelectMemoryEvent,
  onToggleFavorite
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'receipt' | 'screenshot' | 'document' | 'photo' | 'favorites'>('all');

  // Filter items
  const filteredItems = gallery.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'favorites') return !!item.isFavorite;
    return item.type === selectedFilter;
  });

  // Group items by timeline: Today, Yesterday, This Week, This Month, Earlier
  const now = new Date('2026-08-28T22:00:00Z'); // Using current context time
  const timelineGroups: { title: string; subtitle?: string; items: MediaItem[] }[] = [];

  const thisMonthItems: MediaItem[] = [];
  const earlier2026Items: MediaItem[] = [];
  const year2025Items: MediaItem[] = [];

  filteredItems.forEach(item => {
    const itemDate = new Date(item.timestamp);
    const year = itemDate.getFullYear();
    const month = itemDate.getMonth();

    if (year === 2026 && month === 7) { // August 2026 (0-indexed 7)
      thisMonthItems.push(item);
    } else if (year === 2026) {
      earlier2026Items.push(item);
    } else {
      year2025Items.push(item);
    }
  });

  if (thisMonthItems.length > 0) {
    timelineGroups.push({
      title: 'This Month — August 2026',
      subtitle: `${thisMonthItems.length} moments indexed`,
      items: thisMonthItems
    });
  }

  if (earlier2026Items.length > 0) {
    timelineGroups.push({
      title: 'Earlier in 2026',
      subtitle: `${earlier2026Items.length} moments • Araku Valley, Hyderabad Dining & Projects`,
      items: earlier2026Items
    });
  }

  if (year2025Items.length > 0) {
    timelineGroups.push({
      title: '2025 — Goa Coastal Holiday & Archive',
      subtitle: `${year2025Items.length} memories`,
      items: year2025Items
    });
  }

  return (
    <div id="lumafind-home-view" className="space-y-6 pb-28 pt-2">
      {/* 1. Large Futuristic AI Search Bar */}
      <section className="px-4">
        <SearchBar
          query={searchQuery}
          onQueryChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          onOpenVoiceSearch={onOpenVoiceSearch}
          onOpenImageSearch={onOpenImageSearch}
        />
      </section>

      {/* 2. Featured AI Moments Carousel */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold tracking-wide uppercase text-slate-300">
              AI Moment Recall
            </h2>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Auto-synthesized
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 snap-x">
          {memoryEvents.map(event => {
            const coverItem = gallery.find(g => g.id === event.coverItemId) || gallery[0];
            return (
              <div
                key={event.id}
                id={`moment-card-${event.id}`}
                onClick={() => onSelectMemoryEvent(event)}
                className="relative flex-none w-[280px] sm:w-[320px] rounded-3xl overflow-hidden glass-panel border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group snap-start shadow-xl shadow-black/60"
              >
                {/* Background photo */}
                <div className="h-36 w-full relative overflow-hidden bg-slate-900">
                  <img
                    src={coverItem.url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full glass-pill text-[10px] font-mono text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                    {event.itemIds.length} items
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 space-y-1.5 bg-slate-950/90">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>{event.dateRange}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {event.title}
                  </h3>

                  <p className="text-[12px] text-slate-400 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[200px]">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Quick Category & Media Type Filters */}
      <section className="px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Memories', icon: Sparkles },
            { id: 'receipt', label: 'Receipts & Bills', icon: Receipt },
            { id: 'screenshot', label: 'Screenshots', icon: Smartphone },
            { id: 'document', label: 'Documents', icon: FileText },
            { id: 'photo', label: 'Photos', icon: Eye },
            { id: 'favorites', label: 'Favorites', icon: Heart }
          ].map(filter => {
            const Icon = filter.icon;
            const isSelected = selectedFilter === filter.id;
            return (
              <button
                key={filter.id}
                id={`filter-chip-${filter.id}`}
                onClick={() => setSelectedFilter(filter.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/30'
                    : 'glass-panel text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Timeline Gallery Groupings */}
      <section className="px-4 space-y-8">
        {timelineGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-3">
            {/* Timeline Header */}
            <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-100 tracking-tight">
                  {group.title}
                </h3>
                {group.subtitle && (
                  <p className="text-xs text-slate-400 font-mono">
                    {group.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Masonry / Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {group.items.map(item => {
                const isReceipt = item.type === 'receipt';
                const isScreenshot = item.type === 'screenshot';
                const isDoc = item.type === 'document';

                return (
                  <div
                    key={item.id}
                    id={`gallery-item-${item.id}`}
                    onClick={() => onSelectMediaItem(item)}
                    className="group relative rounded-2xl overflow-hidden glass-panel border border-white/[0.08] hover:border-cyan-400/50 transition-all duration-300 cursor-pointer shadow-md shadow-black/40 aspect-[4/5] bg-slate-900 flex flex-col"
                  >
                    {/* Media thumbnail */}
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                    {/* Top badging */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      {/* Media Type Badge */}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-semibold backdrop-blur-md bg-slate-950/70 border border-white/10 text-slate-200">
                        {isReceipt ? 'Receipt' : isScreenshot ? 'Screenshot' : isDoc ? 'Doc' : 'Photo'}
                      </span>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        id={`fav-btn-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.id);
                        }}
                        className="pointer-events-auto w-7 h-7 rounded-full backdrop-blur-md bg-slate-950/60 hover:bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-rose-400 transition-colors"
                        aria-label="Toggle Favorite"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            item.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Bottom Metadata & OCR / Entity Peek */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 space-y-1">
                      {/* Document Amount Peek if available */}
                      {item.documentMetadata?.amount && (
                        <div className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300">
                          {item.documentMetadata.amount}
                        </div>
                      )}

                      <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h4>

                      {/* Detected tags / OCR text snippet */}
                      <p className="text-[10px] text-slate-400 truncate font-mono">
                        {item.ocrText ? item.ocrText.split('\n')[0] : item.detectedObjects.slice(0, 2).join(' • ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
