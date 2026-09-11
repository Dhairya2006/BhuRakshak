import React from 'react';
import { Brain, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

export function ModelDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
          <Brain className="text-purple-400" />
          AI Model Performance
        </h1>
        <p className="text-sm text-slate-400 mt-1">Metrics for the currently active production ML model.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Model Version" value="XGB-v2.4.1" icon={Cpu} color="text-slate-300" />
        <MetricCard title="Precision" value="0.92" icon={ShieldCheck} color="text-emerald-400" />
        <MetricCard title="Recall (Sensitivity)" value="0.88" icon={Activity} color="text-blue-400" />
        <MetricCard title="F1-Score" value="0.90" icon={Brain} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confusion Matrix */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-800/20">
          <h2 className="text-sm font-semibold text-slate-200 mb-6">Confusion Matrix (Validation Set)</h2>
          <div className="flex flex-col gap-2 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex text-xs font-medium text-slate-400 text-center">
              <div className="w-24"></div>
              <div className="flex-1">Predicted: Negative</div>
              <div className="flex-1">Predicted: Positive</div>
            </div>
            <div className="flex items-stretch gap-2">
              <div className="w-24 flex items-center justify-center text-xs font-medium text-slate-400">
                <span className="-rotate-90 whitespace-nowrap">Actual: Negative</span>
              </div>
              <div className="flex-1 bg-slate-800/50 p-4 rounded text-center border border-slate-700 flex flex-col justify-center">
                <span className="text-2xl font-bold text-slate-200">1,245</span>
                <span className="text-xs text-slate-500">True Negatives</span>
              </div>
              <div className="flex-1 bg-rose-500/10 p-4 rounded text-center border border-rose-500/20 flex flex-col justify-center">
                <span className="text-2xl font-bold text-rose-400">42</span>
                <span className="text-xs text-rose-500">False Positives</span>
              </div>
            </div>
            <div className="flex items-stretch gap-2">
              <div className="w-24 flex items-center justify-center text-xs font-medium text-slate-400">
                <span className="-rotate-90 whitespace-nowrap">Actual: Positive</span>
              </div>
              <div className="flex-1 bg-amber-500/10 p-4 rounded text-center border border-amber-500/20 flex flex-col justify-center">
                <span className="text-2xl font-bold text-amber-400">28</span>
                <span className="text-xs text-amber-500">False Negatives</span>
              </div>
              <div className="flex-1 bg-emerald-500/10 p-4 rounded text-center border border-emerald-500/20 flex flex-col justify-center">
                <span className="text-2xl font-bold text-emerald-400">315</span>
                <span className="text-xs text-emerald-500">True Positives</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Note: In disaster prediction, minimizing False Negatives (missing a real landslide) is prioritized over minimizing False Positives (raising a false alarm). The model is tuned for high recall.
          </p>
        </div>

        {/* Model Disclaimer */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-800/20 flex flex-col justify-center">
          <div className="bg-slate-900/80 p-6 rounded-lg border border-slate-700 text-center">
             <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-slate-200 mb-2">Decision Support System</h3>
             <p className="text-sm text-slate-400 leading-relaxed mb-4">
               BhuRakshak predictions are AI-generated risk estimates based on available telemetry and historical data. They do not constitute guaranteed predictions of natural disasters.
             </p>
             <div className="inline-block px-3 py-1 bg-slate-800 rounded border border-slate-700 text-xs text-slate-300">
               Human expert verification is strictly required before issuing evacuation orders.
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-700/50 bg-slate-800/20 flex items-center justify-between">
      <div>
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</h3>
        <div className={cn("text-2xl font-bold mt-1", color)}>{value}</div>
      </div>
      <div className="p-3 bg-slate-900/50 rounded-lg">
        <Icon className={cn("w-6 h-6", color)} />
      </div>
    </div>
  );
}
