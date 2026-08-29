import React, { useState } from 'react';
import { AppSettings, IndexingStatus } from '../types';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Wifi, 
  BatteryCharging, 
  Sliders, 
  Trash2, 
  Sparkles, 
  Layers,
  Database,
  CheckCircle2
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  indexingStatus: IndexingStatus;
  onReindex: () => void;
  onResetSeedData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  indexingStatus,
  onReindex,
  onResetSeedData
}) => {
  if (!isOpen) return null;

  const [pinInput, setPinInput] = useState(settings.pinCode || '1234');
  const [resetConfirmed, setResetConfirmed] = useState(false);

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="w-full max-w-lg rounded-3xl glass-panel-glow border border-cyan-500/30 bg-slate-950/95 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              LumaFind Preferences
            </h3>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl glass-pill text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 no-scrollbar">
          {/* 1. AI Processing Engine Architecture */}
          <div className="space-y-3">
            <h4 className="font-mono uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              AI Reasoning Engine
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="ai-mode-local-btn"
                onClick={() => onUpdateSettings({ aiMode: 'local' })}
                className={`p-3 rounded-2xl border text-left space-y-1 transition-all ${
                  settings.aiMode === 'local'
                    ? 'border-emerald-500/60 bg-emerald-950/30 text-white'
                    : 'border-white/10 glass-panel text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1 text-emerald-300">
                    <ShieldCheck className="w-4 h-4" /> Private On-Device
                  </span>
                  {settings.aiMode === 'local' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Zero cloud uploads. All OCR, object detection & embeddings processed locally.
                </p>
              </button>

              <button
                id="ai-mode-cloud-btn"
                onClick={() => onUpdateSettings({ aiMode: 'cloud_gemini' })}
                className={`p-3 rounded-2xl border text-left space-y-1 transition-all ${
                  settings.aiMode === 'cloud_gemini'
                    ? 'border-cyan-500/60 bg-cyan-950/30 text-white'
                    : 'border-white/10 glass-panel text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1 text-cyan-300">
                    <Sparkles className="w-4 h-4" /> Gemini 3.7 Flash
                  </span>
                  {settings.aiMode === 'cloud_gemini' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Server-side multimodal understanding for complex inquiries & deep synthesis.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Background Indexing Engine */}
          <div className="space-y-3">
            <h4 className="font-mono uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" />
              Neural Indexing & Power
            </h4>

            <div className="p-3.5 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Library Index Status</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {indexingStatus.indexed} / {indexingStatus.total} Media Items Indexed
                  </span>
                </div>
                <button
                  id="reindex-gallery-btn"
                  onClick={onReindex}
                  disabled={indexingStatus.isIndexing}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold hover:bg-cyan-500/30 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${indexingStatus.isIndexing ? 'animate-spin' : ''}`} />
                  <span>{indexingStatus.isIndexing ? 'Indexing...' : 'Re-index'}</span>
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5 text-slate-400" />
                    <span>Index only on Wi-Fi</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.reindexWifiOnly}
                    onChange={e => onUpdateSettings({ reindexWifiOnly: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <BatteryCharging className="w-3.5 h-3.5 text-slate-400" />
                    <span>Index only when charging</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.reindexChargingOnly}
                    onChange={e => onUpdateSettings({ reindexChargingOnly: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4 rounded"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 3. Security & App Lock */}
          <div className="space-y-3">
            <h4 className="font-mono uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              Privacy & Biometric Lock
            </h4>

            <div className="p-3.5 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-200 block">Require Authentication</span>
                  <span className="text-[11px] text-slate-400">Lock app with Biometrics or PIN</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.isAppLocked}
                  onChange={e => onUpdateSettings({ isAppLocked: e.target.checked })}
                  className="accent-cyan-400 w-4 h-4 rounded"
                />
              </label>

              {settings.isAppLocked && (
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-slate-400">Security PIN Code:</span>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={e => {
                      setPinInput(e.target.value);
                      if (e.target.value.length === 4) {
                        onUpdateSettings({ pinCode: e.target.value });
                      }
                    }}
                    className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 text-center font-mono text-cyan-300 font-bold"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 4. Reset & Seed Data */}
          <div className="space-y-2 pt-2 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-300 block">Reset Demo Gallery</span>
                <span className="text-[11px] text-slate-500">Restore all seed photos, receipts & documents</span>
              </div>
              <button
                id="reset-seed-data-btn"
                onClick={() => {
                  onResetSeedData();
                  setResetConfirmed(true);
                  setTimeout(() => setResetConfirmed(false), 2500);
                }}
                className="px-3 py-1.5 rounded-xl glass-pill text-rose-300 hover:bg-rose-500/20 text-xs font-semibold"
              >
                {resetConfirmed ? 'Reset Complete!' : 'Reset Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
