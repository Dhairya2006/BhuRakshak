import React from 'react';
import { AlertTriangle, Activity, MapPin, Wind, ThermometerSun, BrainCircuit, CloudRain, Play, Pause, RotateCcw, ShieldCheck, TrendingUp, Zap, Clock, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSimulation } from '../context/SimulationContext';
import { LiveRiskMap } from './LiveRiskMap';
import { mockTrendData } from '../data/mockData';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function getRiskColor(level: string) {
  switch (level) {
    case 'CRITICAL': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    case 'HIGH': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    case 'LOW': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  }
}

export function Dashboard() {
  const sim = useSimulation();

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] space-y-4">
      
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 uppercase tracking-tight flex items-center gap-3">
            Overview Dashboard
            {sim.isSimulating && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-rose-600 animate-pulse uppercase tracking-wider">
                Demo Mode Active
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1">Real-time landslide & disaster monitoring • AI Prediction Active</p>
        </div>
        <div className="flex gap-1.5 p-1 bg-slate-800/80 rounded border border-slate-700">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider self-center px-2">Simulation Engine</span>
          <button 
            onClick={sim.startSimulation} 
            disabled={sim.isSimulating}
            className="p-1.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded text-emerald-400 transition-colors"
            title="Start Simulation"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={sim.pauseSimulation} 
            disabled={!sim.isSimulating}
            className="p-1.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded text-amber-400 transition-colors"
            title="Pause Simulation"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={sim.resetSimulation} 
            className="p-1.5 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded text-slate-400 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">
        <KpiCard title="Overall Threat" value={sim.riskScore > 80 ? 'CRITICAL' : sim.riskScore > 50 ? 'HIGH' : 'ELEVATED'} sub={`${sim.riskScore.toFixed(1)}/100 Index`} icon={ShieldAlert} alert={sim.riskScore > 80} />
        <KpiCard title="Critical Zones" value={sim.criticalZonesCount.toString()} sub="Requires Evacuation" icon={AlertTriangle} alert={sim.criticalZonesCount > 0} />
        <KpiCard title="24h Rainfall Avg" value={`${sim.rainfall.toFixed(1)} mm`} sub={sim.rainfall > 100 ? "Extreme precipitation" : "Normal"} icon={CloudRain} alert={sim.rainfall > 100} />
        <KpiCard title="Soil Saturation" value={`${sim.soilMoisture.toFixed(1)}%`} sub={sim.soilMoisture > 85 ? "Danger threshold" : "Safe levels"} icon={ThermometerSun} alert={sim.soilMoisture > 85} />
        <KpiCard title="Blocked Routes" value={sim.blockedRoadsCount.toString()} sub={sim.blockedRoadsCount > 0 ? "Dispatch teams" : "All clear"} icon={Activity} alert={sim.blockedRoadsCount > 0} />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        
        {/* LARGE LIVE RISK MAP (Left 3 Columns) */}
        <div className="lg:col-span-3 rounded-xl border border-slate-700/50 bg-slate-800/20 backdrop-blur-md flex flex-col min-h-[500px] overflow-hidden p-3 relative group">
          <LiveRiskMap hideTitle={false} />
        </div>

        {/* RIGHT SIDEBAR (1 Column) */}
        <div className="lg:col-span-1 flex flex-col gap-4 min-h-0 overflow-hidden">
          
          {/* Active Alerts */}
          <div className="flex-1 min-h-[150px] rounded-xl border border-slate-700/50 bg-slate-800/20 backdrop-blur-md p-3 flex flex-col">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 shrink-0">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Active Alerts
            </h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {sim.activeAlerts.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-4">No active alerts. System nominal.</div>
              ) : sim.activeAlerts.map((alert, i) => (
                <div key={i} className="p-2.5 bg-slate-900/60 rounded border border-slate-700 animate-in fade-in slide-in-from-right-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", 
                      alert.level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 
                      alert.level === 'SEVERE' || alert.level === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                    )}>
                      {alert.level}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Just now</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-300 mt-1 leading-snug">{alert.msg}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Priorities */}
          <div className="flex-1 min-h-[150px] rounded-xl border border-slate-700/50 bg-slate-800/20 backdrop-blur-md p-3 flex flex-col">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Emergency Priorities
            </h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {sim.incidents.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-4">No active incidents.</div>
              ) : sim.incidents.map((inc: any) => (
                <div key={inc.id} className="p-2.5 bg-slate-900/60 rounded border border-slate-700 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider", inc.priority === 'P1' ? 'text-rose-400 bg-rose-500/20' : 'text-amber-400 bg-amber-500/20')}>
                      {inc.priority}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{inc.status}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-200">{inc.type}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <MapPin className="w-3 h-3" /> {inc.location}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Stream (Mini) */}
          <div className="flex-1 min-h-[150px] rounded-xl border border-slate-700/50 bg-slate-800/20 backdrop-blur-md p-3 flex flex-col">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 shrink-0">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Event Stream
            </h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">10:42 AM</div>
                  <div className="text-[11px] text-slate-300 font-medium">Sensor #402 reported anomalous vibration.</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">10:15 AM</div>
                  <div className="text-[11px] text-slate-300 font-medium">Drone survey completed for Sector 7. All clear.</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">09:00 AM</div>
                  <div className="text-[11px] text-slate-300 font-medium">Routine system diagnostic passed.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM INTELLIGENCE BAR */}
      <div className="h-16 shrink-0 rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-md flex items-center px-4 gap-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 bg-purple-500 h-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
        <BrainCircuit className="w-6 h-6 text-purple-400 shrink-0" />
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">AI Situation Brief</div>
          <div className="text-xs text-slate-300 font-medium truncate">
            {sim.riskScore > 80 ? "Critical risk detected in Tura Peak region due to sustained rainfall and soil saturation. Immediate preventive measures recommended." :
             sim.riskScore > 50 ? "Elevated risk in West Garo Hills. Monitor rainfall closely. Soil moisture approaching critical thresholds." :
             "Conditions are currently stable across all monitored sectors. Routine surveillance active."}
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 border-l border-slate-700 pl-6 h-10">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Data Confidence</span>
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 98.4%</span>
          </div>
          <div className="w-24 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <Area type="monotone" dataKey="rainfall" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}

function KpiCard({ title, value, sub, icon: Icon, alert = false }: { title: string, value: string, sub: string, icon: any, alert?: boolean }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
        <Icon className={cn("w-4 h-4", alert ? "text-rose-400 animate-pulse" : "text-slate-500")} />
      </div>
      <div className="text-xl font-bold text-slate-100 font-mono tracking-tight">{value}</div>
      <div className={cn("text-[9px] font-bold uppercase tracking-wider mt-1 truncate", alert ? "text-rose-400" : "text-emerald-400")}>
        {sub}
      </div>
      <div className={cn(
        "absolute -bottom-4 -right-4 w-16 h-16 rounded-full blur-xl pointer-events-none transition-opacity",
        alert ? "bg-rose-500 opacity-20" : "bg-slate-500 opacity-5"
      )} />
    </div>
  );
}
