import React from 'react';
import { Trophy, Zap, RotateCcw, Flame, CheckCircle2, TrendingUp } from 'lucide-react';
import { getComboMultiplier } from '../utils/shapes';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  maxCombo: number;
  linesCleared: number;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHighScore,
  maxCombo,
  linesCleared,
  onPlayAgain,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 inset-x-0 h-32 bg-rose-500/10 blur-2xl pointer-events-none rounded-full" />

        {/* Title */}
        <div className="mb-2">
          {isNewHighScore ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full mb-2">
              <Trophy size={14} className="fill-amber-400" />
              <span>REKOR BARU TERCAPAI!</span>
            </div>
          ) : (
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Permainan Berakhir
            </span>
          )}
          <h2 className="font-display text-3xl font-black text-white tracking-tight">
            GAME OVER
          </h2>
        </div>

        {/* Score banner */}
        <div className="w-full my-4 py-4 px-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center justify-center">
          <span className="text-xs font-medium text-slate-400">Skor Akhir</span>
          <span className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums mt-0.5">
            {score.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-semibold mt-2">
            <Trophy size={13} />
            <span>Skor Terbaik: {highScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="w-full grid grid-cols-3 gap-2 mb-6">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
              <Flame size={11} className="text-amber-400" />
              <span>Kombo</span>
            </div>
            <span className="font-display text-lg sm:text-xl font-bold text-white tabular-nums mt-0.5">
              {maxCombo > 0 ? `x${maxCombo}` : '-'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
              <TrendingUp size={11} className="text-emerald-400" />
              <span>Multiplier</span>
            </div>
            <span className="font-display text-lg sm:text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
              {maxCombo > 0 ? `${getComboMultiplier(maxCombo).toFixed(1)}x` : '1.0x'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
              <Zap size={11} className="text-cyan-400" />
              <span>Garis</span>
            </div>
            <span className="font-display text-lg sm:text-xl font-bold text-white tabular-nums mt-0.5">
              {linesCleared}
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw size={18} />
          <span>Main Lagi</span>
        </button>

        {/* Offline indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-4">
          <CheckCircle2 size={12} className="text-emerald-400" />
          <span>100% Offline — Data tersimpan di browser</span>
        </div>
      </div>
    </div>
  );
};
