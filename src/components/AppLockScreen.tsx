import React, { useState } from 'react';
import { Fingerprint, Lock, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface AppLockScreenProps {
  pinCode: string;
  onUnlock: () => void;
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({
  pinCode = '1234',
  onUnlock
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);

  const handleDigitPress = (digit: string) => {
    if (enteredPin.length < 4) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);

      if (newPin.length === 4) {
        if (newPin === pinCode) {
          setTimeout(onUnlock, 150);
        } else {
          setIsError(true);
          setTimeout(() => {
            setEnteredPin('');
            setIsError(false);
          }, 800);
        }
      }
    }
  };

  const handleBiometricSimulate = () => {
    setIsScanningBiometric(true);
    setTimeout(() => {
      setIsScanningBiometric(false);
      onUnlock();
    }, 1000);
  };

  return (
    <div
      id="app-lock-screen"
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-white select-none animate-fadeIn"
    >
      {/* Visual background ambient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xs flex flex-col items-center space-y-6 z-10">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-[1.5px] shadow-2xl shadow-cyan-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Lock className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
            LumaFind Vault
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Encrypted Visual Memory Protected
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex gap-4 py-2">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                isError
                  ? 'border-rose-500 bg-rose-500 animate-shake'
                  : enteredPin.length > idx
                  ? 'border-cyan-400 bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                  : 'border-white/20 bg-white/5'
              }`}
            />
          ))}
        </div>

        {isError && (
          <span className="text-xs text-rose-400 font-mono flex items-center gap-1 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. (Default: 1234)
          </span>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleDigitPress(num)}
              className="w-16 h-16 rounded-full glass-panel border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-xl font-bold font-mono mx-auto flex items-center justify-center active:scale-95 transition-all text-slate-100"
            >
              {num}
            </button>
          ))}

          {/* Biometric trigger */}
          <button
            onClick={handleBiometricSimulate}
            className="w-16 h-16 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center active:scale-95 transition-all hover:bg-cyan-500/20"
            title="Biometric Fingerprint / Face ID"
          >
            <Fingerprint className={`w-7 h-7 ${isScanningBiometric ? 'animate-pulse text-cyan-300' : ''}`} />
          </button>

          <button
            onClick={() => handleDigitPress('0')}
            className="w-16 h-16 rounded-full glass-panel border border-white/10 hover:border-cyan-400/50 text-xl font-bold font-mono mx-auto flex items-center justify-center active:scale-95 transition-all text-slate-100"
          >
            0
          </button>

          {/* Backspace */}
          <button
            onClick={() => setEnteredPin(prev => prev.slice(0, -1))}
            className="w-16 h-16 rounded-full glass-panel border border-white/10 text-xs font-mono text-slate-400 mx-auto flex items-center justify-center active:scale-95 transition-all hover:text-white"
          >
            Del
          </button>
        </div>

        {/* Biometric hint */}
        <button
          onClick={handleBiometricSimulate}
          className="text-xs font-mono text-cyan-400/80 hover:text-cyan-300 flex items-center gap-1.5 pt-2"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Tap to authenticate with Biometrics</span>
        </button>
      </div>
    </div>
  );
};
