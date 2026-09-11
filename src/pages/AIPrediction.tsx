import React, { useState, useEffect } from 'react';
import { BrainCircuit, SlidersHorizontal, Droplets, CloudRain, Mountain, Info, Activity, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PredictionData {
  risk_score: number;
  risk_level: string;
  probability: number;
  confidence: number;
  top_contributing_factors: string[];
  timestamp: string;
  location: string;
  disclaimer: string;
}

const mockHistory = [
  { time: 'T-12h', score: 35 },
  { time: 'T-9h', score: 42 },
  { time: 'T-6h', score: 58 },
  { time: 'T-3h', score: 72 },
  { time: 'Now', score: 85 },
];

export function AIPrediction() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PredictionData | null>(null);
  
  // Simulation State
  const [simParams, setSimParams] = useState({
    location: 'Sohra (Cherrapunji) Sector A',
    rainfall_24h: 80,
    soil_moisture: 65,
    slope: 35
  });

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ml/predict-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simParams)
      });
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error("Failed to run prediction", e);
    } finally {
      setLoading(false);
    }
  };

  // Run initial on mount
  useEffect(() => {
    runSimulation();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
      case 'VERY HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'HIGH': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'MODERATE': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  const getRiskRing = (score: number) => {
    if (score >= 80) return 'stroke-rose-500';
    if (score >= 60) return 'stroke-orange-500';
    if (score >= 40) return 'stroke-amber-500';
    if (score >= 20) return 'stroke-yellow-500';
    return 'stroke-emerald-500';
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight flex items-center gap-3">
            <BrainCircuit className="text-purple-400" />
            AI Risk Prediction Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">Simulate conditions and view deep-learning risk factors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Simulation Controls (Left Col) */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-800/20">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-medium text-slate-200">Simulation Mode</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-medium text-slate-400 flex justify-between mb-2">
                <span>Location Target</span>
              </label>
              <input 
                type="text" 
                value={simParams.location}
                onChange={e => setSimParams({...simParams, location: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 flex justify-between mb-2">
                <span className="flex items-center gap-1.5"><CloudRain className="w-3.5 h-3.5 text-blue-400"/> 24h Rainfall (mm)</span>
                <span className="text-slate-200">{simParams.rainfall_24h} mm</span>
              </label>
              <input 
                type="range" min="0" max="300" 
                value={simParams.rainfall_24h}
                onChange={e => setSimParams({...simParams, rainfall_24h: parseInt(e.target.value)})}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 flex justify-between mb-2">
                <span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-blue-300"/> Soil Moisture (%)</span>
                <span className="text-slate-200">{simParams.soil_moisture}%</span>
              </label>
              <input 
                type="range" min="0" max="100" 
                value={simParams.soil_moisture}
                onChange={e => setSimParams({...simParams, soil_moisture: parseInt(e.target.value)})}
                className="w-full accent-blue-300"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 flex justify-between mb-2">
                <span className="flex items-center gap-1.5"><Mountain className="w-3.5 h-3.5 text-amber-600"/> Slope Angle (deg)</span>
                <span className="text-slate-200">{simParams.slope}°</span>
              </label>
              <input 
                type="range" min="0" max="60" 
                value={simParams.slope}
                onChange={e => setSimParams({...simParams, slope: parseInt(e.target.value)})}
                className="w-full accent-amber-600"
              />
            </div>

            <button 
              onClick={runSimulation}
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <Activity className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
              Recalculate Risk Score
            </button>
            <p className="text-xs text-center text-slate-500 mt-2">
              <span className="font-bold text-amber-500">DEMO/SIMULATION:</span> Does not affect live alerting.
            </p>
          </div>
        </div>

        {/* Prediction Results (Right Col) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-slate-800/20">
            {data ? (
              <div className="flex flex-col md:flex-row gap-8 items-center">
                
                {/* Score Circle */}
                <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-800" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      className={cn(getRiskRing(data.risk_score), "transition-all duration-1000 ease-out")} 
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * data.risk_score) / 100} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-100">{data.risk_score}</span>
                    <span className="text-xs text-slate-400 uppercase font-medium tracking-wider mt-1">/ 100</span>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">{data.location}</h2>
                    <div className="flex items-center gap-3 mt-2 justify-center md:justify-start">
                      <span className={cn("px-3 py-1 rounded text-sm font-bold tracking-wide border", getRiskColor(data.risk_level))}>
                        {data.risk_level} RISK
                      </span>
                      <span className="text-sm text-slate-400 font-medium">Confidence: {(data.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg mt-4">
                    <p className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                      <Info className="w-4 h-4 text-purple-400 shrink-0" />
                      {data.disclaimer} Timestamp: {new Date(data.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <Activity className="w-8 h-8 text-slate-600 animate-spin" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Explainable AI */}
            <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-800/20">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                Why is this location at risk?
              </h3>
              {data && (
                <div className="space-y-3">
                  {data.top_contributing_factors.map((factor, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-lg border border-slate-700/50">
                      <span className="text-sm font-medium text-slate-300">{factor}</span>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${100 - (i * 25)}%`}} />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-slate-500 mt-2">Features ordered by SHAP value local importance.</p>
                </div>
              )}
            </div>

            {/* Simulated Trend */}
            <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-800/20">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                Simulated 12h Risk Trend
              </h3>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockHistory} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
