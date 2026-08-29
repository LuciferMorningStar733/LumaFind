import React from 'react';
import { ShieldCheck, Cpu, SlidersHorizontal, Camera, Sparkles } from 'lucide-react';
import { AppSettings, IndexingStatus } from '../types';

interface HeaderProps {
  settings: AppSettings;
  indexingStatus: IndexingStatus;
  onOpenSettings: () => void;
  onOpenUpload: () => void;
  onQuickAiAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  indexingStatus,
  onOpenSettings,
  onOpenUpload
}) => {
  return (
    <header
      id="lumafind-app-header"
      className="sticky top-0 z-30 px-4 pt-3 pb-3 bg-slate-950/85 backdrop-blur-xl border-b border-white/[0.06]"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            {/* Ambient neural ring */}
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-md -z-10 animate-neural" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                LumaFind
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                NEURAL
              </span>
            </div>
            <p className="text-[12px] text-slate-400 font-medium">
              Your visual memory
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Privacy / AI Mode Badge */}
          <div
            id="header-ai-status-badge"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-pill text-xs text-slate-300"
            title={settings.aiMode === 'local' ? 'Private On-Device AI Active' : 'Cloud Gemini Enhanced'}
          >
            {settings.aiMode === 'local' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-mono text-emerald-300">Private AI</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-[11px] font-mono text-cyan-300">Gemini 3.7</span>
              </>
            )}
          </div>

          {/* Quick Upload / Capture Button */}
          <button
            id="header-upload-btn"
            onClick={onOpenUpload}
            className="flex items-center justify-center w-9 h-9 rounded-xl glass-pill text-slate-200 hover:text-cyan-300 hover:bg-cyan-500/15 transition-all duration-200"
            aria-label="Upload or capture photo"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Settings Trigger */}
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            className="flex items-center justify-center w-9 h-9 rounded-xl glass-pill text-slate-200 hover:text-cyan-300 hover:bg-cyan-500/15 transition-all duration-200"
            aria-label="Open Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Indexing Progress Ribbon (if indexing) */}
      {indexingStatus.isIndexing && (
        <div className="max-w-4xl mx-auto mt-2 pt-1 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Building visual memory: {indexingStatus.indexed} / {indexingStatus.total} images</span>
          </div>
          <span className="text-cyan-400">{Math.round((indexingStatus.indexed / indexingStatus.total) * 100)}%</span>
        </div>
      )}
    </header>
  );
};
