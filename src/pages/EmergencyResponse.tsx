import React, { useEffect, useState } from 'react';
import { Siren, Clock, CheckCircle2, Navigation, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function EmergencyResponse() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/incidents').then(r => r.json()).then(setIncidents).catch(console.error);
  }, []);

  const getPriorityColor = (p: string) => {
    if (p === 'P1') return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
    if (p === 'P2') return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    if (p === 'P3') return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
            <Siren className="text-rose-500 animate-pulse" />
            Emergency Response & Dispatch
          </h1>
          <p className="text-sm text-slate-400 mt-1">Prioritized incidents requiring active management.</p>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-xl border border-slate-700/50 bg-slate-800/20 overflow-hidden flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-700/50 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/50">
          <div className="col-span-1 text-center">Priority</div>
          <div className="col-span-3">Incident & Location</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Reporter</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {incidents.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-500">Loading incidents...</div>
          ) : (
            incidents.sort((a,b) => a.priority.localeCompare(b.priority)).map(inc => (
              <div key={inc.id} className="grid grid-cols-12 gap-4 p-4 border-b border-slate-700/30 hover:bg-slate-700/20 items-center">
                
                <div className="col-span-1 flex justify-center">
                  <span className={`px-2.5 py-1 rounded font-bold text-xs border ${getPriorityColor(inc.priority)}`}>
                    {inc.priority}
                  </span>
                </div>
                
                <div className="col-span-3">
                  <h3 className="font-medium text-slate-200">{inc.type}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    {inc.location}
                  </p>
                </div>
                
                <div className="col-span-2 text-sm text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {formatDistanceToNow(new Date(inc.time))} ago
                </div>
                
                <div className="col-span-2 text-sm text-slate-300">
                  {inc.reporter || 'Unknown'}
                </div>
                
                <div className="col-span-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${inc.status === 'PENDING' ? 'text-amber-400' : 'text-blue-400'}`}>
                    {inc.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="col-span-2 flex justify-end gap-2">
                  <button className="p-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors" title="Dispatch Team">
                    <Navigation className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded bg-emerald-900/30 border border-emerald-500/30 hover:bg-emerald-900/50 text-emerald-400 transition-colors" title="Resolve">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
                
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
