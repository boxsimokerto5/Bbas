import React from 'react';
import { X, Sparkles, Layers, Zap, WifiOff, Hammer } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Tutup petunjuk"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="mb-4">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Panduan Bermain
          </span>
          <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-0.5">
            Cara Main Block Blast
          </h3>
        </div>

        <div className="space-y-3.5 text-xs text-slate-300">
          <div className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
              <Layers size={15} />
            </div>
            <div>
              <p className="font-bold text-white mb-0.5">1. Tarik & Pratinjau Bayangan (Drop Preview)</p>
              <p className="text-slate-400 leading-relaxed">
                Tarik balok ke papan. Bayangan balok (ghost preview) akan menempel magnetis ke posisi valid terdekat dan menyoroti garis yang akan meledak sebelum jari dilepas!
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={15} />
            </div>
            <div>
              <p className="font-bold text-white mb-0.5">2. Ledakkan Garis</p>
              <p className="text-slate-400 leading-relaxed">
                Penuhi seluruh baris horizontal atau kolom vertikal untuk meledakkannya dan mengosongkan ruang.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Zap size={15} />
            </div>
            <div>
              <p className="font-bold text-white mb-0.5">3. Isi Combo Meter & Multiplier</p>
              <p className="text-slate-400 leading-relaxed">
                Hancurkan baris secara beruntun untuk mengisi Combo Meter! Multiplier meningkat dari 1.5x hingga 5.0x MAX, melipatgandakan perolehan skor tiap langkah.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Hammer size={15} />
            </div>
            <div>
              <p className="font-bold text-white mb-0.5">4. Gunakan Booster Bantuan</p>
              <p className="text-slate-400 leading-relaxed">
                Manfaatkan Palu (hancurkan 1 kotak), Putar (ubah orientasi balok 90°), dan Acak (ganti balok baru). Dapatkan gratis dari kombo tinggi & misi prestasi!
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <WifiOff size={15} />
            </div>
            <div>
              <p className="font-bold text-white mb-0.5">5. 100% Offline</p>
              <p className="text-slate-400 leading-relaxed">
                Bisa dimainkan tanpa internet kapan saja. Skor tertinggi dan statistik tersimpan permanen di perangkat.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          Mengerti, Main Sekarang!
        </button>
      </div>
    </div>
  );
};
