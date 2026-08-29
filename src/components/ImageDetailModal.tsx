import React, { useState } from 'react';
import { MediaItem } from '../types';
import { 
  X, 
  Heart, 
  Share2, 
  Trash2, 
  Sparkles, 
  FileText, 
  MapPin, 
  Calendar, 
  Camera, 
  Copy, 
  Check, 
  Layers, 
  Info, 
  Scan, 
  Eye, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ImageDetailModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onSearchConcept: (concept: string) => void;
  allGalleryItems: MediaItem[];
}

export const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  item,
  onClose,
  onToggleFavorite,
  onDelete,
  onSearchConcept,
  allGalleryItems
}) => {
  if (!item) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'ocr' | 'objects' | 'exif'>('info');
  const [copiedOcr, setCopiedOcr] = useState(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCopyOcr = () => {
    if (!item.ocrText) return;
    navigator.clipboard.writeText(item.ocrText);
    setCopiedOcr(true);
    setTimeout(() => setCopiedOcr(false), 2000);
  };

  const similarItems = allGalleryItems.filter(g => 
    g.id !== item.id && (
      g.type === item.type ||
      g.detectedObjects.some(o => item.detectedObjects.includes(o)) ||
      (item.location && g.location && item.location.city === g.location.city)
    )
  ).slice(0, 4);

  return (
    <div
      id="image-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto animate-fadeIn"
    >
      {/* 1. Top Bar */}
      <div className="sticky top-0 z-30 px-4 py-3 bg-slate-950/80 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between">
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          className="p-2 rounded-xl glass-pill text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-[200px] truncate">
          <h3 className="text-xs font-bold text-slate-100 truncate">{item.title}</h3>
          <span className="text-[10px] font-mono text-cyan-400 uppercase">{item.type}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite Button */}
          <button
            id="detail-fav-btn"
            onClick={() => onToggleFavorite(item.id)}
            className="p-2 rounded-xl glass-pill text-slate-300 hover:text-rose-400"
          >
            <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Delete Button */}
          <button
            id="detail-delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl glass-pill text-slate-300 hover:text-rose-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Alert */}
      {showDeleteConfirm && (
        <div className="mx-4 my-2 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-white flex items-center justify-between">
          <span>Remove this item from visual memory?</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 rounded-lg glass-panel text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(item.id);
                onClose();
              }}
              className="px-3 py-1 rounded-lg bg-rose-500 font-bold text-white shadow"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* 2. Main High-Res Image & Bounding Box Overlay */}
      <div className="relative flex-1 flex items-center justify-center p-4 min-h-[340px] max-h-[50vh] bg-slate-950/50">
        <div className="relative max-h-full max-w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <img
            src={item.url}
            alt={item.title}
            className="max-h-[48vh] w-auto object-contain rounded-2xl"
          />

          {/* Bounding box overlays */}
          {showBoundingBoxes && item.boundingBoxes && item.boundingBoxes.map((bb, idx) => (
            <div
              key={idx}
              style={{
                top: `${bb.box[0]}%`,
                left: `${bb.box[1]}%`,
                height: `${bb.box[2] - bb.box[0]}%`,
                width: `${bb.box[3] - bb.box[1]}%`
              }}
              className="absolute border-2 border-cyan-400 bg-cyan-500/10 rounded-lg pointer-events-none flex flex-col justify-between p-1"
            >
              <span className="text-[9px] font-mono font-bold text-slate-950 bg-cyan-400 px-1 py-0.2 rounded w-fit shadow">
                {bb.label} ({Math.round(bb.confidence * 100)}%)
              </span>
            </div>
          ))}

          {/* Overlay Toggle Pill */}
          {item.boundingBoxes && item.boundingBoxes.length > 0 && (
            <button
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className="absolute bottom-2 right-2 px-2 py-1 rounded-lg backdrop-blur-md bg-black/70 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 flex items-center gap-1"
            >
              <Scan className="w-3 h-3" />
              <span>{showBoundingBoxes ? 'Hide AI Boxes' : 'Show AI Boxes'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Deep AI Intelligence & Metadata Inspector Panel */}
      <div className="p-4 bg-slate-950 rounded-t-3xl border-t border-cyan-500/20 space-y-4 max-w-3xl mx-auto w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-white/[0.08] pb-2">
          {[
            { id: 'info', label: 'AI Summary', icon: Sparkles },
            { id: 'ocr', label: `OCR Text (${item.ocrText ? 'Found' : 'None'})`, icon: FileText },
            { id: 'objects', label: `Objects (${item.detectedObjects.length})`, icon: Eye },
            { id: 'exif', label: 'EXIF & GPS', icon: Camera }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`modal-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: AI Summary & Document Intelligence */}
        {activeTab === 'info' && (
          <div className="space-y-3 animate-fadeIn">
            {/* AI Visual Description */}
            <div className="p-3.5 rounded-2xl glass-panel border border-cyan-500/20 space-y-1 bg-slate-900/50">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 font-bold uppercase">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Visual Intelligence Synthesis
                </span>
                <span className="text-emerald-400">Quality: {item.qualityScore}/100</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {item.aiDescription || 'High resolution captured photograph indexed into LumaFind visual neural memory.'}
              </p>
            </div>

            {/* Document / Receipt Entities Card (if present) */}
            {item.documentMetadata && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Document / Financial Intelligence
                  </span>
                  {item.documentMetadata.amount && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 font-mono font-extrabold text-xs">
                      {item.documentMetadata.amount}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  {item.documentMetadata.vendor && (
                    <div className="p-2 rounded-xl bg-white/[0.04]">
                      <span className="text-slate-400 block text-[10px]">Merchant / Vendor</span>
                      <span className="text-slate-100 font-bold">{item.documentMetadata.vendor}</span>
                    </div>
                  )}
                  {item.documentMetadata.invoiceNumber && (
                    <div className="p-2 rounded-xl bg-white/[0.04]">
                      <span className="text-slate-400 block text-[10px]">Invoice / Policy #</span>
                      <span className="text-slate-100 font-bold">{item.documentMetadata.invoiceNumber}</span>
                    </div>
                  )}
                  {item.documentMetadata.warranty && (
                    <div className="p-2 rounded-xl bg-white/[0.04]">
                      <span className="text-slate-400 block text-[10px]">Warranty Status</span>
                      <span className="text-emerald-300 font-bold">{item.documentMetadata.warranty}</span>
                    </div>
                  )}
                  {item.documentMetadata.date && (
                    <div className="p-2 rounded-xl bg-white/[0.04]">
                      <span className="text-slate-400 block text-[10px]">Document Date</span>
                      <span className="text-slate-100 font-bold">{item.documentMetadata.date}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location & Time Context */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl glass-panel border border-white/[0.06] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 block font-mono">Timestamp</span>
                  <span className="font-semibold text-slate-200">{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {item.location && (
                <div className="p-3 rounded-2xl glass-panel border border-white/[0.06] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block font-mono">Location</span>
                    <span className="font-semibold text-slate-200 truncate">{item.location.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Verbatim OCR Inspector */}
        {activeTab === 'ocr' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Transcribed Text ({item.ocrText ? item.ocrText.split('\n').length : 0} lines)
              </span>
              {item.ocrText && (
                <button
                  onClick={handleCopyOcr}
                  className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 hover:bg-cyan-500/30"
                >
                  {copiedOcr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedOcr ? 'Copied' : 'Copy All Text'}</span>
                </button>
              )}
            </div>

            {item.ocrText ? (
              <pre className="p-4 rounded-2xl bg-slate-900 border border-white/10 font-mono text-xs text-cyan-200 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48">
                {item.ocrText}
              </pre>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                No prominent text detected in this photograph.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Detected Objects & Semantic Tags */}
        {activeTab === 'objects' && (
          <div className="space-y-3 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                Visual Detected Objects (Tap to search)
              </span>
              <div className="flex flex-wrap gap-2">
                {item.detectedObjects.map((obj, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSearchConcept(obj);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 flex items-center gap-1"
                  >
                    <span>{obj}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                Semantic & Conceptual Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {item.semanticTags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSearchConcept(tag);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] text-xs font-medium text-slate-300 hover:text-white border border-white/[0.08]"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: EXIF & Camera Details */}
        {activeTab === 'exif' && (
          <div className="space-y-3 animate-fadeIn text-xs font-mono">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-3 rounded-2xl glass-panel border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px]">Camera Model</span>
                <span className="text-slate-100 font-bold">{item.camera?.make} {item.camera?.model || 'Sony Alpha 7 IV'}</span>
              </div>
              <div className="p-3 rounded-2xl glass-panel border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px]">Lens / Focal Length</span>
                <span className="text-slate-100 font-bold">{item.camera?.focalLength || '35mm f/1.8 G'}</span>
              </div>
              <div className="p-3 rounded-2xl glass-panel border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px]">Exposure / ISO</span>
                <span className="text-slate-100 font-bold">{item.camera?.aperture || 'f/1.8'} • ISO {item.camera?.iso || 100}</span>
              </div>
              <div className="p-3 rounded-2xl glass-panel border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px]">Resolution</span>
                <span className="text-slate-100 font-bold">{item.dimensions.width} × {item.dimensions.height}</span>
              </div>
              <div className="p-3 rounded-2xl glass-panel border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px]">File Size</span>
                <span className="text-slate-100 font-bold">{item.fileSize}</span>
              </div>
              <div className="p-3 rounded-2xl glass-panel border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px]">GPS Coordinates</span>
                <span className="text-cyan-300 font-bold">{item.location?.latitude?.toFixed(4) || '17.4375'}°, {item.location?.longitude?.toFixed(4) || '78.4482'}°</span>
              </div>
            </div>
          </div>
        )}

        {/* Similar Visual Memories Section */}
        {similarItems.length > 0 && (
          <div className="pt-2 border-t border-white/[0.06]">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase block mb-2">
              Related Visual Memories
            </span>
            <div className="grid grid-cols-4 gap-2">
              {similarItems.map(sim => (
                <div
                  key={sim.id}
                  onClick={() => onSearchConcept(sim.title)}
                  className="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-cyan-400 cursor-pointer group"
                >
                  <img src={sim.thumbnailUrl || sim.url} alt={sim.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
