import React from 'react';
import { X, Check, Palette, Sun, Moon } from 'lucide-react';
import { ThemeDef, ThemeId } from '../types/game';
import { THEMES } from '../utils/themes';
import { sound } from '../utils/audio';

interface ThemeModalProps {
  isOpen: boolean;
  activeThemeId: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  activeThemeId,
  onSelectTheme,
  onClose,
}) => {
  if (!isOpen) return null;

  const themeList: ThemeDef[] = Object.values(THEMES);

  const handlePick = (themeId: ThemeId) => {
    sound.playPick();
    onSelectTheme(themeId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Palette size={17} />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                Pilih Tema Warna
              </h3>
              <p className="text-xs text-slate-400">
                Tersedia pilihan tema cerah dan gelap
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup pemilih tema"
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Theme List */}
        <div className="overflow-y-auto py-3 space-y-2.5 pr-1 my-1">
          {themeList.map((t) => {
            const isSelected = t.id === activeThemeId;

            return (
              <button
                key={t.id}
                onClick={() => handlePick(t.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                      {t.name}
                    </span>
                    {t.isLight ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        <Sun size={10} />
                        Cerah
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                        <Moon size={10} />
                        Gelap
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Aktif
                      </span>
                    )}
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-amber-400 border-amber-400 text-slate-950'
                        : 'border-slate-700 bg-slate-800 text-transparent group-hover:border-slate-600'
                    }`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-normal">{t.tagline}</p>

                {/* Color swatches preview */}
                <div className="flex items-center gap-1.5 pt-1">
                  {Object.values(t.colorDefs).slice(0, 7).map((c) => (
                    <div
                      key={c.id}
                      className={`w-6 h-6 rounded-md bg-gradient-to-br ${c.gradient} ${c.border} border block-bevel relative shadow-sm`}
                      title={c.name}
                    />
                  ))}
                  <div
                    className={`w-6 h-6 rounded-md ${t.boardBg} ${t.boardBorder} border grid-socket flex items-center justify-center ml-1`}
                    title="Papan"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${t.socketDot}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tema tersimpan otomatis di perangkat</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
