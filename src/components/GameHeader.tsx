import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Trophy, Zap, Palette, Crown } from 'lucide-react';
import { ThemeDef } from '../types/game';
import { THEMES } from '../utils/themes';

interface GameHeaderProps {
  score: number;
  highScore: number;
  comboStreak: number;
  isMuted: boolean;
  theme?: ThemeDef;
  onToggleMute: () => void;
  onRestart: () => void;
  onOpenHelp: () => void;
  onOpenTheme: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  highScore,
  comboStreak,
  isMuted,
  theme = THEMES.classic3d,
  onToggleMute,
  onRestart,
  onOpenHelp,
  onOpenTheme,
}) => {
  const isLight = theme.isLight;
  const isClassic3D = theme.id === 'classic3d';

  const btnClass = isLight
    ? 'w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-sm'
    : isClassic3D
    ? 'w-9 h-9 rounded-xl bg-blue-950/60 border border-blue-400/30 text-blue-100 hover:text-white hover:bg-blue-900/80 transition-colors flex items-center justify-center cursor-pointer shadow-sm backdrop-blur-sm'
    : 'w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer';

  return (
    <header className="w-full max-w-md mx-auto flex flex-col gap-3 px-3 pt-2 pb-1 select-none">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md border border-white/30 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${theme.previewColors[0]}, ${theme.previewColors[1] || theme.previewColors[0]}, ${theme.previewColors[2] || theme.previewColors[0]})`,
              boxShadow: `0 4px 12px ${theme.previewColors[0]}50`,
            }}
          >
            <div className="w-3.5 h-3.5 rounded bg-white/95 shadow-sm" />
          </div>
          <span
            className={`font-display font-black text-xl tracking-tight ${
              isLight
                ? 'text-slate-900'
                : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
            }`}
          >
            BLOCK BLAST
          </span>
        </div>

        {/* Header action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenTheme}
            title="Ganti Tema Warna"
            aria-label="Pilih tema warna"
            className={btnClass}
          >
            <Palette size={17} />
          </button>

          <button
            onClick={onOpenHelp}
            title="Cara Bermain"
            aria-label="Petunjuk bermain"
            className={btnClass}
          >
            <HelpCircle size={17} />
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className={btnClass}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          <button
            onClick={onRestart}
            title="Mulai Ulang"
            aria-label="Mulai ulang game"
            className={btnClass}
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>

      {/* Score and High Score Display Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current Score */}
        <div
          className={`rounded-2xl ${theme.boardBg} ${theme.boardBorder} border px-4 py-2.5 flex flex-col justify-center relative overflow-hidden transition-colors duration-300 ${
            isLight ? 'shadow-sm shadow-slate-200' : 'shadow-lg'
          }`}
        >
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider ${
              isLight ? 'text-slate-500' : 'text-slate-300'
            }`}
          >
            Skor
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {score.toLocaleString()}
            </span>
          </div>
          {comboStreak > 1 && (
            <div className="absolute right-2 top-2 flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded-full animate-bounce shadow-sm">
              <Zap size={11} className="fill-amber-300 text-amber-300" />
              <span>x{comboStreak}</span>
            </div>
          )}
        </div>

        {/* High Score with Crown Icon */}
        <div
          className={`rounded-2xl ${theme.boardBg} ${theme.boardBorder} border px-4 py-2.5 flex flex-col justify-center transition-colors duration-300 ${
            isLight ? 'shadow-sm shadow-slate-200' : 'shadow-lg'
          }`}
        >
          <div
            className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
              isLight ? 'text-amber-600' : 'text-amber-300'
            }`}
          >
            <Crown size={13} className="fill-amber-400 text-amber-400 drop-shadow-sm" />
            <span>Terbaik</span>
          </div>
          <span
            className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${
              isLight ? 'text-amber-600' : 'text-amber-300 drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]'
            }`}
          >
            {highScore.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
};
