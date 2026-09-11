import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { TrendingUp, CloudRain, ShieldAlert, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const seasonalData = [
  { month: 'Jan', risk: 12, rain: 20 },
  { month: 'Feb', risk: 15, rain: 35 },
  { month: 'Mar', risk: 25, rain: 80 },
  { month: 'Apr', risk: 45, rain: 150 },
  { month: 'May', risk: 65, rain: 280 },
  { month: 'Jun', risk: 90, rain: 450 },
  { month: 'Jul', risk: 95, rain: 520 },
  { month: 'Aug', risk: 85, rain: 410 },
  { month: 'Sep', risk: 60, rain: 250 },
  { month: 'Oct', risk: 40, rain: 120 },
  { month: 'Nov', risk: 20, rain: 40 },
  { month: 'Dec', risk: 10, rain: 15 },
];

const featureImportance = [
  { name: 'Cumulative Rainfall (24h)', value: 0.35 },
  { name: 'Slope Degree', value: 0.22 },
  { name: 'Soil Moisture', value: 0.18 },
  { name: 'Elevation', value: 0.12 },
  { name: 'Distance to Drainage', value: 0.08 },
  { name: 'Aspect', value: 0.05 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
          <TrendingUp className="text-emerald-400" />
          Risk Analytics & Trends
        </h1>
        <p className="text-sm text-slate-400 mt-1">Historical patterns and feature correlations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Seasonal Trends */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-800/20">
          <h2 className="text-sm font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-400" />
            Seasonal Risk vs Rainfall Pattern
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seasonalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRainfall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#f43f5e" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="risk" name="Avg Risk (%)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
                <Area yAxisId="right" type="monotone" dataKey="rain" name="Avg Rainfall (mm)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRainfall)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-800/20">
          <h2 className="text-sm font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            AI Model Feature Importance (SHAP Values)
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={120} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  formatter={(value: number) => [value.toFixed(2), 'Impact Weight']}
                />
                <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
