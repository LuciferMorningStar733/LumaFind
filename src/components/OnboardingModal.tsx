import React, { useState } from 'react';
import { Sparkles, Search, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Ask Your Visual Memory Anything',
      subtitle: 'Multimodal Natural Language Search',
      description: 'LumaFind goes far beyond standard photo galleries. Search naturally for "Honda motorcycle battery receipt", "Screenshot with WiFi password", or "Goa beach photos".',
      icon: Search,
      highlight: 'Honda motorcycle battery receipt'
    },
    {
      title: '5-Layer Neural Analysis Engine',
      subtitle: 'OCR • Vision AI • Semantics • Metadata',
      description: 'Every photo, screenshot and invoice is transcribed and understood locally. Extract merchant names, amounts, WiFi keys, and places effortlessly.',
      icon: Sparkles,
      highlight: '₹4,500 Battery Invoice • 12V 9Ah'
    },
    {
      title: 'Private & Encrypted by Default',
      subtitle: 'On-Device AI Processing',
      description: 'Your personal photos and sensitive receipts stay securely on your device with local neural embeddings, biometric locks, and encrypted search.',
      icon: ShieldCheck,
      highlight: 'Zero data leaves your device'
    }
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div
      id="onboarding-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn select-none"
    >
      <div className="w-full max-w-md rounded-3xl glass-panel-glow border border-cyan-500/30 bg-slate-950/95 p-6 text-center space-y-6 shadow-2xl">
        {/* Step dots */}
        <div className="flex justify-center gap-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === step ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Step Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-[1.5px] mx-auto shadow-xl shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Icon className="w-9 h-9 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-widest block">
            {currentStep.subtitle}
          </span>
          <h3 className="text-xl font-extrabold text-white">
            {currentStep.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto pt-1">
            {currentStep.description}
          </p>
        </div>

        {/* Highlight pill */}
        <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          ✨ {currentStep.highlight}
        </div>

        <button
          id="onboarding-next-btn"
          onClick={handleNext}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <span>{step === steps.length - 1 ? 'Enter LumaFind' : 'Continue'}</span>
          {step === steps.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
