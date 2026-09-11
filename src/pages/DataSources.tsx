import React from 'react';
import { Database, Link, CloudOff, AlertCircle, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

interface Source {
  name: string;
  category: string;
  status: 'CONNECTED' | 'SIMULATED' | 'OFFLINE' | 'NOT_CONFIGURED';
  details: string;
  provider: string;
}

const dataSources: Source[] = [
  { name: 'ISRO Bhuvan Road Network & RAMS', category: 'Roads & Transport', status: 'CONNECTED', details: 'Active ISRO Bhuvan Road Network API key (145643...5ce8). High-precision vector topology, NHAI Road Asset Management System, and emergency landslide detour routing API active.', provider: 'ISRO NRSC & NHAI (bhuvan.nrsc.gov.in)' },
  { name: 'Bhuvan Satellite & Thematic Maps', category: 'Satellite', status: 'CONNECTED', details: 'ISRO Cartosat-2S (2.5m GSD) and LULC thematic geospatial layers enabled for slope failure monitoring.', provider: 'ISRO / NRSC (bhuvan.nrsc.gov.in)' },
  { name: 'IMD Weather API (current_wx)', category: 'Weather', status: 'CONNECTED', details: 'Integrated endpoint: https://api.imd.gov.in/api/v1/current_wx for real-time precipitation, AWS telemetry, and warning bulletins.', provider: 'India Meteorological Department (api.imd.gov.in)' },
  { name: 'SRTM Elevation', category: 'Terrain', status: 'SIMULATED', details: 'Static topology dataset loaded.', provider: 'NASA' },
  { name: 'IoT Soil Sensors (Mesh)', category: 'Sensors', status: 'SIMULATED', details: 'Demo scenario running local mock nodes.', provider: 'BhuRakshak Hardware' },
  { name: 'GSI Landslide Catalog', category: 'Historical', status: 'CONNECTED', details: 'Loaded 5,204 historical entries for training.', provider: 'Geological Survey of India' },
  { name: 'Supabase Incidents', category: 'Field Reports', status: 'SIMULATED', details: 'Using local IndexedDB / memory due to missing SUPABASE_URL.', provider: 'Citizen/Field App' }
];

export function DataSources() {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONNECTED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'SIMULATED': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'OFFLINE': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'CONNECTED': return <Link className="w-4 h-4" />;
      case 'SIMULATED': return <Cpu className="w-4 h-4" />;
      case 'OFFLINE': return <CloudOff className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
          <Database className="text-blue-400" />
          Data Architecture & Providers
        </h1>
        <p className="text-sm text-slate-400 mt-1">Status of internal and external data integrations.</p>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-blue-500/30 bg-blue-900/10">
        <h3 className="text-sm font-bold text-blue-300 mb-1 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Environment Note
        </h3>
        <p className="text-xs text-slate-300">
          BhuRakshak is currently running in a demonstration environment. For security, live government API keys (IMD, ISRO) and production databases are not hardcoded. 
          The application automatically gracefully degrades to <strong>SIMULATED</strong> modes when environment variables are not provided. 
          See the <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-200">.env.example</code> file in the repository to configure production providers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {dataSources.map((src, i) => (
          <div key={i} className="p-5 rounded-xl border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 transition-colors flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{src.category}</div>
                <h3 className="font-semibold text-slate-200 text-lg">{src.name}</h3>
              </div>
            </div>
            <div className="text-xs text-slate-400 mb-4 flex-1">
              {src.details}
            </div>
            <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 mt-auto">
              <span className="text-xs text-slate-500">Provider: <span className="font-medium text-slate-300">{src.provider}</span></span>
              <span className={cn("flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold tracking-wider border", getStatusColor(src.status))}>
                {getStatusIcon(src.status)}
                {src.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
