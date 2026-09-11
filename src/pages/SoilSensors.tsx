import React, { useEffect, useState } from 'react';
import { Droplets, Wifi, WifiOff, Battery, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function SoilSensors() {
  const [sensors, setSensors] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/sensors').then(r => r.json()).then(setSensors).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
        <Droplets className="text-blue-300" />
        Soil Moisture Monitoring
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sensors.map(sensor => (
          <div key={sensor.id} className={`p-5 rounded-xl border bg-slate-800/20 ${
            sensor.status === 'WARNING' ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' :
            sensor.status === 'OFFLINE' ? 'border-slate-700 opacity-75' :
            'border-emerald-500/30'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-100 text-lg">{sensor.location}</h3>
                <p className="text-xs text-slate-400 font-mono">ID: {sensor.id}</p>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                sensor.status === 'WARNING' ? 'bg-orange-500/20 text-orange-400' :
                sensor.status === 'OFFLINE' ? 'bg-slate-700/50 text-slate-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {sensor.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-slate-500">Moisture</div>
                <div className={`text-2xl font-bold ${sensor.moisture > 90 ? 'text-rose-400' : 'text-blue-400'}`}>
                  {sensor.moisture}%
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Temperature</div>
                <div className="text-2xl font-bold text-slate-200">
                  {sensor.temp}°C
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                {sensor.status === 'OFFLINE' ? <WifiOff className="w-3 h-3 text-rose-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
                {formatDistanceToNow(new Date(sensor.last_tx))} ago
              </div>
              <div className="flex items-center gap-1">
                <Battery className={`w-3 h-3 ${sensor.battery < 20 ? 'text-rose-400' : 'text-emerald-400'}`} />
                {sensor.battery}%
              </div>
            </div>
            
            {sensor.moisture > 90 && (
              <div className="mt-3 text-xs text-rose-400 flex items-start gap-1 bg-rose-500/10 p-2 rounded">
                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                Saturation critical. High likelihood of slope instability.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
