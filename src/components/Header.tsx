import React from 'react';
import { Search, Bell, Cpu, CloudRain, Wifi, WifiOff, Globe, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useSimulation } from '../context/SimulationContext';
import { cn } from '../lib/utils';

export function Header() {
  const { isOnline, isSyncing } = useAppContext();
  const { i18n, t } = useTranslation();
  const sim = useSimulation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const threatLevel = sim.riskScore > 80 ? 'CRITICAL' : sim.riskScore > 60 ? 'SEVERE' : sim.riskScore > 40 ? 'HIGH ALERT' : sim.riskScore > 20 ? 'ELEVATED' : 'NORMAL';
  const threatColor = sim.riskScore > 80 ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' : sim.riskScore > 60 ? 'text-orange-500 bg-orange-500/10 border-orange-500/30' : sim.riskScore > 40 ? 'text-amber-500 bg-amber-500/10 border-amber-500/30' : sim.riskScore > 20 ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';

  return (
    <header className="h-14 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4 z-10 sticky top-0 shadow-sm shadow-slate-950/20">
      
      {/* Left side info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{t('system_online')}</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{isSyncing ? t('syncing') : t('offline_mode')}</span>
            </>
          )}
        </div>
        <div className="h-4 w-px bg-slate-700" />
        
        {/* Threat Level */}
        <div className={cn("flex items-center gap-2 px-2 py-0.5 rounded border", threatColor)}>
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {threatLevel} <span className="opacity-70 ml-1">{sim.riskScore.toFixed(0)}/100</span>
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Environment Status Pills */}
        <div className="hidden lg:flex items-center gap-2 mr-2">
          <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 rounded px-2 py-1">
            <Globe className="w-3 h-3 text-slate-400" />
            <select 
              value={i18n.language} 
              onChange={handleLanguageChange}
              className="bg-transparent text-[10px] font-bold text-slate-300 focus:outline-none cursor-pointer uppercase tracking-wider"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="as">AS</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 rounded px-2 py-1">
            <CloudRain className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">22°C | {sim.rainfall > 100 ? 'Heavy Rain' : 'Rain'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 rounded px-2 py-1">
            <Cpu className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">AI V1.2</span>
          </div>
        </div>

        <div className="relative hidden sm:block">
          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search zones..." 
            className="w-48 bg-slate-950/50 border border-slate-800 rounded py-1 pl-7 pr-3 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        
        <button className="relative p-1.5 rounded hover:bg-slate-800 text-slate-400 transition-colors border border-transparent hover:border-slate-700 flex items-center gap-1.5">
          <Bell className="w-4 h-4" />
          {sim.activeAlerts.length > 0 && (
            <span className="text-[10px] font-bold text-rose-400">
              {sim.activeAlerts.length} Critical
            </span>
          )}
          {sim.activeAlerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
}
