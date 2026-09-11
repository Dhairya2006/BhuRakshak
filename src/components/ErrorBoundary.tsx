import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-200 p-6">
          <div className="glass-panel max-w-md w-full p-8 rounded-2xl border border-rose-500/30 bg-slate-900/50 text-center">
            <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-2xl font-bold text-slate-100 mb-2">System Module Error</h1>
            <p className="text-slate-400 mb-6 text-sm">
              A critical fault occurred in the rendering pipeline. The system has safely halted the affected module to prevent cascading failure.
            </p>
            <div className="bg-slate-950 p-4 rounded text-left text-xs font-mono text-rose-400 mb-6 overflow-auto max-h-32 border border-slate-800">
              {this.state.error?.message}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors border border-slate-700"
            >
              <RefreshCcw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children as ReactNode;
  }
}
