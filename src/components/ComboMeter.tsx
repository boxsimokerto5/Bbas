import React, { useMemo } from 'react';
import { Zap, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { ThemeDef } from '../types/game';
import { COMBO_TIERS, ComboTierInfo } from '../utils/shapes';

interface ComboMeterProps {
  comboStreak: number;
  multiplier: number;
  maxCombo: number;
  theme: ThemeDef;
  width: number;
}

export const ComboMeter: React.FC<ComboMeterProps> = ({
  comboStreak,
  multiplier,
  theme,
  width,
}) => {
  const isLight = theme.isLight;
  const isMaxFever = comboStreak >= 5;
  const isCharging = comboStreak > 0;

  // Active bonus percentage text
  const bonusPercentText = useMemo(() => {
    if (multiplier <= 1.0) return '+0%';
    const pct = Math.round((multiplier - 1.0) * 100);
    return `+${pct}%`;
  }, [multiplier]);

  // Color config for badge
  const badgeConfig = useMemo(() => {
    if (comboStreak === 0) {
      return {
        bg: isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-900/80 text-slate-400 border-slate-800',
        glow: '',
        iconColor: isLight ? 'text-slate-400' : 'text-slate-500',
      };
    }
    if (comboStreak === 1) {
      return {
        bg: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.35)]',
        iconColor: 'text-amber-300 fill-amber-300/40',
      };
    }
    if (comboStreak === 2) {
      return {
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
        glow: 'shadow-[0_0_14px_rgba(16,185,129,0.35)]',
        iconColor: 'text-emerald-300 fill-emerald-300/40',
      };
    }
    if (comboStreak === 3) {
      return {
        bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50',
        glow: 'shadow-[0_0_16px_rgba(6,182,212,0.4)]',
        iconColor: 'text-cyan-300 fill-cyan-300/40',
      };
    }
    if (comboStreak === 4) {
      return {
        bg: 'bg-violet-500/25 text-violet-300 border-violet-400/50',
        glow: 'shadow-[0_0_18px_rgba(139,92,246,0.45)]',
        iconColor: 'text-violet-300 fill-violet-300/40',
      };
    }
    // 5+ Fever mode
    return {
      bg: 'bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 text-white border-amber-200/90',
      glow: 'shadow-[0_0_24px_rgba(244,63,94,0.6)] animate-pulse',
      iconColor: 'text-white fill-white',
    };
  }, [comboStreak, isLight]);

  return (
    <div
      className={`relative rounded-2xl ${theme.boardBg} ${theme.boardBorder} border px-3 py-2 transition-all duration-300 overflow-hidden select-none backdrop-blur-md ${
        isMaxFever ? 'ring-2 ring-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : ''
      }`}
      style={{
        width: `${width}px`,
        maxWidth: '100%',
        boxShadow: isCharging ? `0 4px 18px rgba(0,0,0,0.25)` : theme.boardShadow,
      }}
    >
      {/* Background ambient pulse for high combo */}
      {isCharging && (
        <div
          className={`pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-500 ${
            isMaxFever
              ? 'bg-gradient-to-r from-rose-500/30 via-amber-500/30 to-yellow-400/30 animate-pulse'
              : 'bg-gradient-to-r from-amber-500/15 to-cyan-500/15'
          }`}
        />
      )}

      {/* Top Info Row */}
      <div className="flex items-center justify-between gap-2 mb-1.5 relative z-10">
        {/* Left: Dynamic Multiplier Badge */}
        <div className="flex items-center gap-1.5">
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-black tracking-wide transition-all duration-300 ${badgeConfig.bg} ${badgeConfig.glow}`}
          >
            {isMaxFever ? (
              <Flame size={13} className={`${badgeConfig.iconColor} animate-bounce`} />
            ) : isCharging ? (
              <Zap size={12} className={badgeConfig.iconColor} />
            ) : (
              <Sparkles size={11} className={badgeConfig.iconColor} />
            )}
            <span className="font-display tabular-nums tracking-tight">
              {multiplier.toFixed(1)}x
            </span>
            {isMaxFever && (
              <span className="text-[10px] font-black uppercase tracking-wider ml-0.5 bg-black/40 px-1 py-0.2 rounded">
                MAX
              </span>
            )}
          </div>

          <span
            className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
              isMaxFever
                ? 'text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                : isCharging
                ? isLight ? 'text-slate-800' : 'text-slate-200'
                : isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            {isMaxFever
              ? 'Fever Mode!'
              : isCharging
              ? `Combo x${comboStreak}`
              : 'Combo Meter'}
          </span>
        </div>

        {/* Right: Score bonus incentive text */}
        <div className="flex items-center gap-1 text-[11px] font-medium tracking-tight">
          {isCharging ? (
            <div className="flex items-center gap-1">
              <TrendingUp size={12} className={isMaxFever ? 'text-amber-300' : 'text-emerald-400'} />
              <span
                className={`font-bold tabular-nums ${
                  isMaxFever
                    ? 'text-amber-300 drop-shadow-sm'
                    : isLight ? 'text-emerald-600' : 'text-emerald-400'
                }`}
              >
                {bonusPercentText} Skor
              </span>
              <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                / langkah
              </span>
            </div>
          ) : (
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Hancurkan baris beruntun
            </span>
          )}
        </div>
      </div>

      {/* 5-Segment Progressive Energy Bar */}
      <div className="grid grid-cols-5 gap-1.5 relative z-10">
        {COMBO_TIERS.map((tierInfo: ComboTierInfo) => {
          const isFilled = comboStreak >= tierInfo.minStreak;
          const isCurrentActive =
            comboStreak === tierInfo.minStreak ||
            (tierInfo.tier === 5 && comboStreak >= 5);

          return (
            <div key={tierInfo.tier} className="flex flex-col gap-0.5">
              {/* Segment Cell Track */}
              <div
                className={`h-2.5 rounded-md relative overflow-hidden transition-all duration-300 ${
                  isLight
                    ? 'bg-slate-200/90 border border-slate-300/80'
                    : 'bg-slate-950/80 border border-white/10'
                } ${
                  isFilled && isCurrentActive
                    ? 'ring-1 ring-white/50 shadow-sm'
                    : ''
                }`}
              >
                {/* Segment Fill */}
                <div
                  className={`absolute inset-0 rounded-md transition-all duration-300 ${
                    isFilled
                      ? `bg-gradient-to-r ${tierInfo.glowColor} opacity-100`
                      : 'opacity-0 scale-x-0'
                  } ${
                    isFilled && isMaxFever ? 'animate-pulse' : ''
                  }`}
                  style={{
                    transformOrigin: 'left center',
                    boxShadow: isFilled
                      ? 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.2)'
                      : 'none',
                  }}
                >
                  {/* Glass Top Highlight */}
                  <div className="absolute inset-x-0 top-0 h-[45%] bg-white/40 pointer-events-none rounded-t" />
                </div>
              </div>

              {/* Segment Micro-Label */}
              <div className="flex items-center justify-between px-0.5">
                <span
                  className={`text-[9px] font-bold tabular-nums transition-colors duration-200 ${
                    isFilled
                      ? isLight ? 'text-slate-900' : 'text-slate-100'
                      : isLight ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {tierInfo.label}
                </span>
                <span
                  className={`text-[8px] font-medium transition-colors duration-200 hidden sm:inline ${
                    isFilled
                      ? isLight ? 'text-slate-700' : 'text-slate-300'
                      : isLight ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {tierInfo.bonusPercent}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
