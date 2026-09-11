import React, { useState, useEffect } from 'react';
import { Activity, Server, Target, GitCommit, Settings, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModelStatus {
  model_name: string;
  version: string;
  status: string;
  last_trained: string;
  dataset_size: number;
  feature_count: number;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
}

export function ModelMetricsPage() {
  const [status, setStatus] = useState<ModelStatus | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  
  useEffect(() => {
    fetch('/api/ml/model-status')
      .then(res => res.json())
      .then(setStatus)
      .catch(console.error);
      
    fetch('/api/ml/metrics')
      .then(res => res.json())
      .then(setMetrics)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight flex items-center gap-3">
          <Activity className="text-purple-400" />
          AI Model Management
        </h1>
        <p className="text-sm text-slate-400 mt-1">Monitor performance and pipeline metrics for deployed models.</p>
      </div>

      {/* Active Model Banner */}
      {status && (
        <div className="glass-panel p-5 rounded-xl border border-purple-500/30 bg-purple-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center flex-shrink-0">
              <Server className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{status.model_name} <span className="text-xs text-slate-400 ml-2 font-normal font-mono">v{status.version}</span></h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {status.status}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <GitCommit className="w-3 h-3" />
                  Trained: {new Date(status.last_trained).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div className="px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Dataset Size</div>
              <div className="text-lg font-mono font-medium text-slate-200">{status.dataset_size.toLocaleString()}</div>
            </div>
            <div className="px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Features</div>
              <div className="text-lg font-mono font-medium text-slate-200">{status.feature_count}</div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics && (
          <>
            <MetricCard title="Recall (Sensitivity)" value={(metrics.recall * 100).toFixed(1)} unit="%" highlight="Priority metric for safety" type="primary" />
            <MetricCard title="Accuracy" value={(metrics.accuracy * 100).toFixed(1)} unit="%" type="secondary" />
            <MetricCard title="F1 Score" value={(metrics.f1_score * 100).toFixed(1)} unit="%" type="secondary" />
            <MetricCard title="ROC-AUC" value={(metrics.roc_auc * 100).toFixed(1)} unit="%" type="secondary" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Model Pipeline Info */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-800/20">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            Active Pipeline Architecture
          </h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-7 h-7 rounded-full border border-purple-500 bg-slate-900 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded border border-slate-700 bg-slate-800/50">
                <h4 className="text-sm font-bold text-slate-200">1. Data Ingestion & Validation</h4>
                <p className="text-xs text-slate-400 mt-1">Imputing missing sensor data and validating 22 feature constraints.</p>
              </div>
            </div>
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-7 h-7 rounded-full border border-purple-500 bg-slate-900 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded border border-slate-700 bg-slate-800/50">
                <h4 className="text-sm font-bold text-slate-200">2. Random Forest Classifier</h4>
                <p className="text-xs text-slate-400 mt-1">100 estimators, max depth 10, balanced class weights for false-negative reduction.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-7 h-7 rounded-full border border-purple-500 bg-slate-900 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded border border-slate-700 bg-slate-800/50">
                <h4 className="text-sm font-bold text-slate-200">3. SHAP Explainability</h4>
                <p className="text-xs text-slate-400 mt-1">Global and local feature importance calculation for transparent risk reasoning.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Mock Confusion Matrix */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-800/20">
           <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-400" />
            Confusion Matrix (Validation Set)
          </h3>
          <p className="text-xs text-slate-400 mb-4">The model is tuned to aggressively minimize False Negatives (predicting LOW when actual risk is HIGH), prioritizing safety over sheer accuracy.</p>
          
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="flex items-center justify-center p-2"></div>
            <div className="flex items-center justify-center p-2 font-medium text-slate-400">Pred: LOW</div>
            <div className="flex items-center justify-center p-2 font-medium text-slate-400">Pred: HIGH</div>
            
            <div className="flex items-center justify-end p-2 font-medium text-slate-400 pr-4">Actual: LOW</div>
            <div className="bg-emerald-900/30 border border-emerald-500/30 rounded p-4 font-mono">1,420</div>
            <div className="bg-amber-900/30 border border-amber-500/30 rounded p-4 font-mono text-amber-200">185<br/><span className="text-[10px] uppercase">False Pos</span></div>
            
            <div className="flex items-center justify-end p-2 font-medium text-slate-400 pr-4">Actual: HIGH</div>
            <div className="bg-rose-900/30 border border-rose-500/30 rounded p-4 font-mono text-rose-300">22<br/><span className="text-[10px] uppercase font-bold text-rose-400">False Neg</span></div>
            <div className="bg-emerald-900/30 border border-emerald-500/30 rounded p-4 font-mono">373</div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, highlight, type }: { title: string, value: string, unit: string, highlight?: string, type: 'primary' | 'secondary' }) {
  return (
    <div className={cn(
      "p-5 rounded-xl border",
      type === 'primary' ? "bg-purple-900/20 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)]" : "glass-panel bg-slate-800/20 border-slate-700/50"
    )}>
      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={cn("text-3xl font-bold tracking-tight", type === 'primary' ? "text-purple-100" : "text-slate-100")}>{value}</span>
        <span className="text-sm font-medium text-slate-500">{unit}</span>
      </div>
      {highlight && (
        <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 inline-block px-2 py-1 rounded">
          {highlight}
        </div>
      )}
    </div>
  );
}
