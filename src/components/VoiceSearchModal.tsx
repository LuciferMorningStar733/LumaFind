import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, ArrowRight } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptReady: (transcript: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onTranscriptReady
}) => {
  if (!isOpen) return null;

  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [waveformHeights, setWaveformHeights] = useState<number[]>([20, 45, 80, 60, 95, 40, 70, 30, 85, 50, 65, 30]);

  // Animated sound waves
  useEffect(() => {
    if (!isListening) return;
    const interval = setInterval(() => {
      setWaveformHeights(prev =>
        prev.map(() => Math.floor(Math.random() * 75) + 20)
      );
    }, 120);
    return () => clearInterval(interval);
  }, [isListening]);

  // Speech Recognition API or simulation
  useEffect(() => {
    let recognition: any = null;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch {
        // Fallback simulation
      }
    } else {
      // Auto typing simulation if browser does not support SpeechRecognition
      const demoQueries = [
        'Honda motorcycle battery receipt',
        'Screenshot with WiFi password',
        'Beach photos with dog in Goa'
      ];
      const selected = demoQueries[Math.floor(Math.random() * demoQueries.length)];
      let charIdx = 0;
      const typeTimer = setInterval(() => {
        if (charIdx <= selected.length) {
          setTranscript(selected.slice(0, charIdx));
          charIdx += 2;
        } else {
          clearInterval(typeTimer);
          setIsListening(false);
        }
      }, 70);

      return () => clearInterval(typeTimer);
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, []);

  const handleConfirm = () => {
    if (transcript.trim()) {
      onTranscriptReady(transcript.trim());
      onClose();
    }
  };

  const handleSelectSample = (sample: string) => {
    setTranscript(sample);
    onTranscriptReady(sample);
    onClose();
  };

  return (
    <div
      id="voice-search-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-white animate-fadeIn"
    >
      <button
        id="close-voice-modal-btn"
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-2xl glass-pill text-slate-400 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="w-full max-w-md flex flex-col items-center text-center space-y-8">
        {/* Pulsing Mic Orb */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-[2px] shadow-[0_0_50px_rgba(34,211,238,0.35)]">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Mic className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
          </div>
          {/* Animated neural ripple rings */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl -z-10 animate-ping opacity-40" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {isListening ? 'Listening to your visual memory query...' : 'Query Captured'}
          </span>
          <h3 className="text-xl font-extrabold text-slate-100 min-h-[32px]">
            {transcript ? `"${transcript}"` : 'Say what you want to recall...'}
          </h3>
        </div>

        {/* Live Audio Waveform */}
        <div className="flex items-center justify-center gap-1.5 h-16 w-full px-8">
          {waveformHeights.map((height, idx) => (
            <div
              key={idx}
              style={{ height: `${isListening ? height : 8}%` }}
              className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-violet-400 transition-all duration-100 shadow-[0_0_6px_#22d3ee]"
            />
          ))}
        </div>

        {/* Action Button */}
        {transcript && (
          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Search Visual Memory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Quick Sample Chips */}
        <div className="space-y-2 pt-4 border-t border-white/[0.08] w-full">
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Or tap an instant voice prompt:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Honda motorcycle battery receipt',
              'WiFi password screenshot',
              'Biryani restaurant in Hyderabad'
            ].map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="px-3 py-1.5 rounded-xl glass-pill text-xs text-slate-300 hover:text-cyan-300 hover:border-cyan-400"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
