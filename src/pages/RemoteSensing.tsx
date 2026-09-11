import React, { useState } from 'react';
import { 
  Satellite, 
  Layers, 
  Activity, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Calendar,
  Sparkles,
  Search,
  Maximize2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface InSARDisplacementPoint {
  id: string;
  zone: string;
  district: string;
  satellite: string;
  passDate: string;
  cumulativeDisplacementMm: number;
  velocityMmYear: number;
  coherenceScore: number; // 0.0 - 1.0
  trend: 'ACCELERATING' | 'STEADY_CREEP' | 'STABLE';
}

const insarData: InSARDisplacementPoint[] = [
  {
    id: 'insar-1',
    zone: 'Tura Peak Northwest Spur',
    district: 'West Garo Hills',
    satellite: 'Sentinel-1A (Ascending Pass 121)',
    passDate: '2026-09-08',
    cumulativeDisplacementMm: -28.4,
    velocityMmYear: -42.8,
    coherenceScore: 0.88,
    trend: 'ACCELERATING'
  },
  {
    id: 'insar-2',
    zone: 'Sonapur Tunnel Portal (NH-06)',
    district: 'East Jaintia Hills',
    satellite: 'Sentinel-1A (Descending Pass 48)',
    passDate: '2026-09-09',
    cumulativeDisplacementMm: -34.6,
    velocityMmYear: -56.2,
    coherenceScore: 0.84,
    trend: 'ACCELERATING'
  },
  {
    id: 'insar-3',
    zone: 'Sohra Escarpment Edge',
    district: 'East Khasi Hills',
    satellite: 'Cartosat-2S Stereo Pair',
    passDate: '2026-09-07',
    cumulativeDisplacementMm: -14.2,
    velocityMmYear: -18.5,
    coherenceScore: 0.92,
    trend: 'STEADY_CREEP'
  },
  {
    id: 'insar-4',
    zone: 'Upper Shillong Peak Ridge',
    district: 'East Khasi Hills',
    satellite: 'Sentinel-1A (Ascending Pass 121)',
    passDate: '2026-09-08',
    cumulativeDisplacementMm: -8.1,
    velocityMmYear: -9.4,
    coherenceScore: 0.95,
    trend: 'STEADY_CREEP'
  },
  {
    id: 'insar-5',
    zone: 'Umiam Catchment Bank',
    district: 'Ri Bhoi',
    satellite: 'Sentinel-1A (Descending Pass 48)',
    passDate: '2026-09-09',
    cumulativeDisplacementMm: -1.2,
    velocityMmYear: -2.1,
    coherenceScore: 0.97,
    trend: 'STABLE'
  }
];

export function RemoteSensing() {
  const [activeLayer, setActiveLayer] = useState<'cartosat' | 'insar' | 'ndvi' | 'lulc'>('cartosat');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedZone, setSelectedZone] = useState<InSARDisplacementPoint | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Satellite className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                ISRO Bhuvan & Earth Observation
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                  Authenticated NRSC Gateway
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Cartosat-2S optical imagery, Sentinel-1 InSAR millimeter slope deformation, and Bhuvan Landslide Susceptibility layers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-orange-400")} />
            <span>Poll Satellite Swath</span>
          </button>
          <a
            href="https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/wms"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-600/20 border border-orange-500/40 hover:bg-orange-600/30 text-orange-300 text-xs font-semibold rounded-lg transition-colors"
          >
            <span>Bhuvan Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Active Gateway Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <span className="text-slate-400 font-sans">Active NRSC Token: </span>
            <strong className="text-blue-300 select-all">14564377d06b9403fd936d5184832a2f77595ce8</strong>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[11px] font-sans">
          <span>Constellation: <strong className="text-slate-200">Cartosat-2S / Sentinel-1A / LISS-IV</strong></span>
          <span>Coverage: <strong className="text-slate-200">Meghalaya & NER Swath (2.5m GSD)</strong></span>
        </div>
      </div>

      {/* Satellite Sensor Feeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveLayer('cartosat')}
          className={cn(
            "p-4 rounded-xl border text-left transition-all flex flex-col justify-between",
            activeLayer === 'cartosat' 
              ? "bg-orange-500/10 border-orange-500/50 shadow-md ring-1 ring-orange-500/30" 
              : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/80"
          )}
        >
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 mb-1">
              <span>Optical High-Res</span>
              <span className="text-orange-400 font-mono">2.5m GSD</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Cartosat-2S Panchromatic</h4>
            <p className="text-xs text-slate-400 mt-1">High-resolution escarpment crack and fresh landslide scar delineation.</p>
          </div>
          <div className="mt-3 text-[11px] font-mono text-orange-300 font-medium">Revisit: 4 Days</div>
        </button>

        <button
          onClick={() => setActiveLayer('insar')}
          className={cn(
            "p-4 rounded-xl border text-left transition-all flex flex-col justify-between",
            activeLayer === 'insar' 
              ? "bg-blue-500/10 border-blue-500/50 shadow-md ring-1 ring-blue-500/30" 
              : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/80"
          )}
        >
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 mb-1">
              <span>Radar Interferometry</span>
              <span className="text-blue-400 font-mono">±1mm Accuracy</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Sentinel-1 InSAR Displacement</h4>
            <p className="text-xs text-slate-400 mt-1">Millimeter-level pre-failure slope creep & subsidence velocity analysis.</p>
          </div>
          <div className="mt-3 text-[11px] font-mono text-blue-300 font-medium">Cloud Penetrating SAR</div>
        </button>

        <button
          onClick={() => setActiveLayer('ndvi')}
          className={cn(
            "p-4 rounded-xl border text-left transition-all flex flex-col justify-between",
            activeLayer === 'ndvi' 
              ? "bg-emerald-500/10 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30" 
              : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/80"
          )}
        >
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 mb-1">
              <span>Vegetation Index</span>
              <span className="text-emerald-400 font-mono">LISS-IV 5.8m</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">NDVI Canopy Anomaly</h4>
            <p className="text-xs text-slate-400 mt-1">Detects slope denudation, deforestation, and vegetative shear stress.</p>
          </div>
          <div className="mt-3 text-[11px] font-mono text-emerald-300 font-medium">Vegetation Anomaly Engine</div>
        </button>

        <button
          onClick={() => setActiveLayer('lulc')}
          className={cn(
            "p-4 rounded-xl border text-left transition-all flex flex-col justify-between",
            activeLayer === 'lulc' 
              ? "bg-purple-500/10 border-purple-500/50 shadow-md ring-1 ring-purple-500/30" 
              : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/80"
          )}
        >
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 mb-1">
              <span>Land Cover / Use</span>
              <span className="text-purple-400 font-mono">1:50,000 WMS</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Bhuvan LULC & DMSD Grid</h4>
            <p className="text-xs text-slate-400 mt-1">National Remote Sensing Centre official disaster geomorphological layer.</p>
          </div>
          <div className="mt-3 text-[11px] font-mono text-purple-300 font-medium">ISRO Thematic Registry</div>
        </button>
      </div>

      {/* InSAR Millimeter Displacement Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              InSAR Continuous Slope Deformation Velocity Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Differential Interferometric Synthetic Aperture Radar (DInSAR) tracking line-of-sight (LOS) millimeter ground movement.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 self-start sm:self-auto">
            Threshold: ±15 mm/yr (Alert)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Monitored Slope / Corridor</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Satellite Pass & Sensor</th>
                <th className="px-4 py-3">Latest Pass Date</th>
                <th className="px-4 py-3 text-right">Cumulative Slip (mm)</th>
                <th className="px-4 py-3 text-right">Velocity (mm/year)</th>
                <th className="px-4 py-3 text-center">Interferometric Coherence</th>
                <th className="px-4 py-3 text-center">Deformation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {insarData.map(row => (
                <tr 
                  key={row.id}
                  onClick={() => setSelectedZone(row)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-sans font-bold text-slate-100">
                    {row.zone}
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-400">
                    {row.district}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    {row.satellite}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {row.passDate}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-bold", 
                    row.cumulativeDisplacementMm < -20 ? "text-rose-400" :
                    row.cumulativeDisplacementMm < -10 ? "text-amber-400" : "text-emerald-400"
                  )}>
                    {row.cumulativeDisplacementMm.toFixed(1)} mm
                  </td>
                  <td className={cn("px-4 py-3 text-right font-bold", 
                    row.velocityMmYear < -30 ? "text-rose-400" :
                    row.velocityMmYear < -15 ? "text-amber-400" : "text-emerald-400"
                  )}>
                    {row.velocityMmYear.toFixed(1)} mm/yr
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-blue-300">
                    γ = {row.coherenceScore.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center font-sans">
                    {row.trend === 'ACCELERATING' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        CRITICAL ACCELERATION
                      </span>
                    ) : row.trend === 'STEADY_CREEP' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        STEADY CREEP
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        STABLE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Satellite Imagery Comparison Card */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-400" />
              Multi-Temporal Satellite Scene Inspector: Sonapur Escarpment (NH-06)
            </h3>
            <p className="text-xs text-slate-400">
              Comparison between Pre-Monsoon Reference Swath (April 2026) vs Post-Rainfall Active Scar (September 2026).
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 font-medium">
            Cartosat-2S Band 4 (NIR)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-mono">
                <span>PRE-MONSOON BASELINE</span>
                <span>2026-04-12</span>
              </div>
              <div className="h-44 rounded-lg bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-xs flex-col gap-2 p-4 text-center">
                <Satellite className="w-8 h-8 text-emerald-400/50" />
                <span className="text-slate-300 font-medium">Dense Forest Canopy & Intact Crown (NDVI: 0.76)</span>
                <span className="text-[11px] text-slate-500">No tension fissures detected along ridge Km 140-144</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 font-mono">Coherence Index: 0.94 • Slope Angle: 42°</div>
          </div>

          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs text-rose-300 mb-2 font-mono">
                <span>POST-RAINFALL FRESH CUT (CURRENT)</span>
                <span className="text-rose-400 font-bold">2026-09-09</span>
              </div>
              <div className="h-44 rounded-lg bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/40 flex items-center justify-center text-rose-300 text-xs flex-col gap-2 p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
                <span className="text-rose-200 font-bold">Active 320m Debris Scar Detected</span>
                <span className="text-[11px] text-rose-300/80">Massive mudflow cut through NH-06 Sonapur portal</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-rose-300 font-mono">Debris Volume: ~48,000 m³ • Estimated Clearance: 36h</div>
          </div>
        </div>
      </div>
    </div>
  );
}
