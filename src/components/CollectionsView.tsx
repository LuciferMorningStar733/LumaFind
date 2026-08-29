import React, { useState } from 'react';
import { MediaItem } from '../types';
import { 
  FolderKanban, 
  Receipt, 
  Smartphone, 
  Car, 
  Utensils, 
  FileText, 
  MapPin, 
  Sparkles, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check,
  ChevronRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

interface CollectionsViewProps {
  gallery: MediaItem[];
  onSelectMediaItem: (item: MediaItem) => void;
  onDeleteMediaItems: (itemIds: string[]) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  gallery,
  onSelectMediaItem,
  onDeleteMediaItems
}) => {
  const [activeTab, setActiveTab] = useState<'smart' | 'cleanup'>('smart');
  const [selectedSmartCategory, setSelectedSmartCategory] = useState<string | null>(null);
  const [cleanupSelectedIds, setCleanupSelectedIds] = useState<string[]>([]);
  const [cleanupSuccessMessage, setCleanupSuccessMessage] = useState<string | null>(null);

  // 1. Smart Collection categorization
  const vehicleItems = gallery.filter(g => 
    g.detectedObjects.some(o => /motorcycle|bike|car|audi|vehicle|scooter/i.test(o))
  );

  const receiptItems = gallery.filter(g => 
    g.type === 'receipt' || !!g.documentMetadata || /receipt|invoice|bill/i.test(g.title)
  );

  const screenshotItems = gallery.filter(g => 
    g.type === 'screenshot' || /screenshot/i.test(g.title)
  );

  const foodItems = gallery.filter(g => 
    g.detectedObjects.some(o => /food|biryani|pizza|coffee|espresso|dining/i.test(o))
  );

  const documentItems = gallery.filter(g => 
    g.type === 'document' || g.documentMetadata?.documentType === 'id_card' || g.documentMetadata?.documentType === 'insurance' || g.documentMetadata?.documentType === 'ticket'
  );

  const travelItems = gallery.filter(g => 
    g.semanticTags.some(t => /travel|goa|araku|trip|beach|vacation/i.test(t))
  );

  const highlightItems = gallery.filter(g => g.qualityScore >= 95 || g.isFavorite);

  // Smart Cleanup Categorization
  const duplicateItems = gallery.filter(g => !!g.isDuplicate);
  const blurryItems = gallery.filter(g => !!g.isBlurry || g.qualityScore < 60);

  const smartCollections = [
    {
      id: 'vehicles',
      name: 'Vehicles & Rides',
      count: vehicleItems.length,
      icon: Car,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
      description: 'Motorcycles, sports cars, scooters & two-wheelers',
      items: vehicleItems
    },
    {
      id: 'receipts',
      name: 'Receipts & Expenses',
      count: receiptItems.length,
      icon: Receipt,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      description: 'Tax invoices, spare parts, UPI & store receipts',
      items: receiptItems,
      extraBadge: '₹9,049 Tracked'
    },
    {
      id: 'screenshots',
      name: 'Screenshots Intelligence',
      count: screenshotItems.length,
      icon: Smartphone,
      color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30',
      description: 'WiFi passwords, courier tracking, shopping & payments',
      items: screenshotItems
    },
    {
      id: 'food',
      name: 'Food & Culinary',
      count: foodItems.length,
      icon: Utensils,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      description: 'Hyderabadi Biryani, woodfired pizza, coffee houses',
      items: foodItems
    },
    {
      id: 'documents',
      name: 'Official Documents',
      count: documentItems.length,
      icon: FileText,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
      description: 'Passports, ICICI insurance policies & boarding passes',
      items: documentItems
    },
    {
      id: 'travel',
      name: 'Travel & Expeditions',
      count: travelItems.length,
      icon: MapPin,
      color: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30',
      description: 'Araku Valley mist, Goa beaches & mountain waterfalls',
      items: travelItems
    },
    {
      id: 'highlights',
      name: 'AI Quality Highlights',
      count: highlightItems.length,
      icon: Sparkles,
      color: 'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30',
      description: 'Highest sharpness, cinematic composition & favorites',
      items: highlightItems
    }
  ];

  const handleToggleCleanupSelect = (id: string) => {
    setCleanupSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllCleanup = () => {
    const allIds = [...duplicateItems, ...blurryItems].map(i => i.id);
    setCleanupSelectedIds(Array.from(new Set(allIds)));
  };

  const handleExecuteCleanup = () => {
    if (cleanupSelectedIds.length === 0) return;
    const count = cleanupSelectedIds.length;
    onDeleteMediaItems(cleanupSelectedIds);
    setCleanupSelectedIds([]);
    setCleanupSuccessMessage(`Cleaned ${count} duplicate and blurry files safely.`);
    setTimeout(() => setCleanupSuccessMessage(null), 4000);
  };

  const currentCategoryData = smartCollections.find(c => c.id === selectedSmartCategory);

  return (
    <div id="lumafind-collections-view" className="space-y-6 pb-28 pt-2">
      {/* 1. Header & Switcher */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
              Smart Collections
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Neural auto-clustering & intelligent storage maintenance
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="p-1 rounded-2xl glass-panel flex items-center gap-1 border border-white/[0.08] mt-3">
          <button
            id="tab-smart-collections"
            onClick={() => {
              setActiveTab('smart');
              setSelectedSmartCategory(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'smart'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Auto Collections ({smartCollections.length})</span>
          </button>

          <button
            id="tab-smart-cleanup"
            onClick={() => setActiveTab('cleanup')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'cleanup'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Smart Cleanup ({duplicateItems.length + blurryItems.length})</span>
          </button>
        </div>
      </section>

      {/* 2. Collections Mode */}
      {activeTab === 'smart' ? (
        <section className="px-4 space-y-4">
          {currentCategoryData ? (
            /* Inside a selected collection */
            <div className="space-y-4">
              <button
                id="back-to-collections-btn"
                onClick={() => setSelectedSmartCategory(null)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 glass-pill px-3 py-1.5 rounded-xl w-fit"
              >
                ← Back to Collections
              </button>

              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${currentCategoryData.color} border`}>
                    <currentCategoryData.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      {currentCategoryData.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {currentCategoryData.count} items indexed • {currentCategoryData.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of collection items */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentCategoryData.items.map(item => (
                  <div
                    key={item.id}
                    id={`collection-item-${item.id}`}
                    onClick={() => onSelectMediaItem(item)}
                    className="rounded-2xl overflow-hidden glass-panel border border-white/[0.08] hover:border-cyan-400/50 transition-all duration-200 cursor-pointer group aspect-[4/5] relative bg-slate-900"
                  >
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                    {item.documentMetadata?.amount && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 font-mono font-bold text-[10px]">
                        {item.documentMetadata.amount}
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-xs font-bold text-slate-100 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {item.location?.name || item.detectedObjects.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Collection Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {smartCollections.map(col => {
                const Icon = col.icon;
                const previewItem = col.items[0];

                return (
                  <div
                    key={col.id}
                    id={`smart-collection-${col.id}`}
                    onClick={() => setSelectedSmartCategory(col.id)}
                    className="p-4 rounded-3xl glass-panel border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 cursor-pointer group shadow-lg shadow-black/40 flex items-center justify-between bg-slate-950/70"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${col.color} border shadow-inner`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                            {col.name}
                          </h3>
                          {col.extraBadge && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300">
                              {col.extraBadge}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {col.description}
                        </p>

                        <span className="text-[11px] font-mono text-cyan-400/90 font-medium">
                          {col.count} items auto-organized
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        /* 3. Smart Cleanup Mode */
        <section className="px-4 space-y-6">
          <div className="p-4 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-rose-200">
                  AI Space Optimization & Cleanup
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  LumaFind identified near-duplicate burst photos, motion-blurred captures, and low-utility accidental screenshots. Photos are never deleted without your explicit review and confirmation.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 text-xs">
              <button
                id="select-all-cleanup-btn"
                onClick={handleSelectAllCleanup}
                className="font-semibold text-rose-300 hover:text-rose-200 underline"
              >
                Select All Candidates ({duplicateItems.length + blurryItems.length})
              </button>

              <button
                id="execute-cleanup-btn"
                onClick={handleExecuteCleanup}
                disabled={cleanupSelectedIds.length === 0}
                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all duration-200 ${
                  cleanupSelectedIds.length > 0
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/50 hover:bg-rose-600'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clean ({cleanupSelectedIds.length}) Selected</span>
              </button>
            </div>
          </div>

          {cleanupSuccessMessage && (
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{cleanupSuccessMessage}</span>
            </div>
          )}

          {/* Duplicates Candidates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              Near-Duplicate & Burst Photos ({duplicateItems.length})
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {duplicateItems.map(item => {
                const isSelected = cleanupSelectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    id={`cleanup-dup-${item.id}`}
                    onClick={() => handleToggleCleanupSelect(item.id)}
                    className={`p-2.5 rounded-2xl glass-panel border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-rose-500/60 bg-rose-950/20'
                        : 'border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 relative">
                      <img src={item.thumbnailUrl || item.url} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full border border-white/40 flex items-center justify-center bg-slate-950/80">
                        {isSelected && <Check className="w-3 h-3 text-rose-400" />}
                      </div>
                    </div>

                    <div className="mt-2 text-xs">
                      <p className="font-bold text-slate-200 truncate">{item.title}</p>
                      <span className="text-[10px] font-mono text-rose-400">
                        Burst Duplicate • {item.fileSize}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blurry / Low Quality Candidates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Blurry & Accidental Screenshots ({blurryItems.length})
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {blurryItems.map(item => {
                const isSelected = cleanupSelectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    id={`cleanup-blur-${item.id}`}
                    onClick={() => handleToggleCleanupSelect(item.id)}
                    className={`p-2.5 rounded-2xl glass-panel border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-rose-500/60 bg-rose-950/20'
                        : 'border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 relative">
                      <img src={item.thumbnailUrl || item.url} alt={item.title} className="w-full h-full object-cover opacity-70" />
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full border border-white/40 flex items-center justify-center bg-slate-950/80">
                        {isSelected && <Check className="w-3 h-3 text-rose-400" />}
                      </div>
                    </div>

                    <div className="mt-2 text-xs">
                      <p className="font-bold text-slate-200 truncate">{item.title}</p>
                      <span className="text-[10px] font-mono text-amber-400">
                        Quality Score: {item.qualityScore}/100 • {item.fileSize}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
