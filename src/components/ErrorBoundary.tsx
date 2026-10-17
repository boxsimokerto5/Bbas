import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Block Blast Error Caught:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('blockblast_theme');
      localStorage.removeItem('blockblast_has_seen_wood_v2');
    } catch {
      // Ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
            <AlertTriangle size={32} />
          </div>
          <h2 className="font-display text-2xl font-black mb-2">Terjadi Kesalahan</h2>
          <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
            Terjadi kendala saat memuat tampilan game. Klik tombol di bawah untuk memulihkan game ke kondisi stabil.
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw size={16} />
            <span>Pulihkan & Mulai Ulang</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
