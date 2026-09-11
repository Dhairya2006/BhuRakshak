import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  BrainCircuit, 
  Mountain, 
  CloudRain, 
  Droplets, 
  Satellite, 
  Route, 
  FileWarning, 
  Megaphone, 
  Siren, 
  BellRing, 
  History, 
  Activity, 
  Database, 
  ShieldAlert, 
  Settings 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export function Sidebar() {
  const { t } = useTranslation();

  const navItems = [
    { name: t('overview'), path: '/', icon: LayoutDashboard },
    { name: t('live_map'), path: '/map', icon: Map },
    { name: t('ai_prediction'), path: '/ai-prediction', icon: BrainCircuit },
    { name: 'Landslide Risk Zones', path: '/zones', icon: Mountain },
    { name: t('weather'), path: '/weather', icon: CloudRain },
    { name: t('soil'), path: '/soil', icon: Droplets },
    { name: 'Remote Sensing', path: '/satellite', icon: Satellite },
    { name: t('roads'), path: '/roads', icon: Route },
    { name: 'Incident Reports', path: '/incidents', icon: FileWarning },
    { name: t('reporting'), path: '/reporting', icon: Megaphone },
    { name: t('emergency'), path: '/emergency', icon: Siren },
    { name: 'Alerts & Notifications', path: '/alerts', icon: BellRing },
    { name: 'Historical Analytics', path: '/history', icon: History },
    { name: 'AI Model Performance', path: '/model-metrics', icon: Activity },
    { name: 'Data Sources', path: '/data', icon: Database },
    { name: 'Administration', path: '/admin', icon: ShieldAlert },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-full bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-100 uppercase">
            {t('app_name')}
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              isActive 
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
            <span className="text-xs font-medium text-slate-300">SA</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">System Admin</span>
            <span className="text-xs text-slate-500">State Authority</span>
          </div>
        </div>
      </div>
    </div>
  );
}
