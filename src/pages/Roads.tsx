import React, { useEffect, useState } from 'react';
import { 
  Route as RouteIcon, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Navigation, 
  RefreshCw, 
  Layers, 
  ArrowRight, 
  Clock, 
  Activity, 
  Car, 
  HardHat, 
  Compass, 
  Radio, 
  ExternalLink,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { BhuvanRoadSegment, BhuvanDetourResponse } from '../types';

export function Roads() {
  const [roads, setRoads] = useState<BhuvanRoadSegment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMeta, setStatusMeta] = useState<any>(null);
  const [filter, setFilter] = useState<'ALL' | 'BLOCKED' | 'OPEN'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Routing Calculator State
  const [origin, setOrigin] = useState<string>('Shillong Logistics Hub (NH-06)');
  const [destination, setDestination] = useState<string>('Silchar Relief Depot (Assam)');
  const [avoidBlocked, setAvoidBlocked] = useState<boolean>(true);
  const [routingLoading, setRoutingLoading] = useState<boolean>(false);
  const [detourPlan, setDetourPlan] = useState<BhuvanDetourResponse | null>(null);

  const fetchRoadData = async () => {
    setLoading(true);
    try {
      const [roadsRes, statusRes] = await Promise.all([
        fetch('/api/roads'),
        fetch('/api/bhuvan/status')
      ]);
      const roadsData = await roadsRes.json();
      const statusData = await statusRes.json();
      setRoads(roadsData);
      setStatusMeta(statusData);
    } catch (err) {
      console.error("Failed to fetch Bhuvan road data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadData();
  }, []);

  const calculateDetour = async (customOrigin?: string, customDest?: string) => {
    setRoutingLoading(true);
    try {
      const res = await fetch('/api/bhuvan/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: customOrigin || origin,
          destination: customDest || destination,
          avoidBlocked
        })
      });
      const data = await res.json();
      setDetourPlan(data);
    } catch (err) {
      console.error("Failed to calculate Bhuvan detour", err);
    } finally {
      setRoutingLoading(false);
    }
  };

  const filteredRoads = roads.filter(road => {
    const matchesFilter = 
      filter === 'ALL' ? true :
      filter === 'BLOCKED' ? (road.status === 'BLOCKED' || road.status === 'PARTIALLY_BLOCKED' || road.status === 'CRITICAL_HAZARD') :
      road.status === 'OPEN';
    
    const matchesSearch = 
      road.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      road.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      road.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      road.affectedVillagesList.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const blockedCount = roads.filter(r => r.status === 'BLOCKED' || r.status === 'PARTIALLY_BLOCKED' || r.status === 'CRITICAL_HAZARD').length;
  const isolatedVillagesTotal = roads.reduce((acc, r) => acc + (r.affectedVillagesCount || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header with ISRO Bhuvan Road Network badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              ISRO Bhuvan Road Network & RAMS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Key: {statusMeta?.maskedKey || '145643...5ce8'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2 mt-1.5">
            <RouteIcon className="text-amber-500 w-7 h-7" />
            Road Network & Disaster Detour Operations
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Real-time highway cut-off monitoring, landslide impact assessment, and emergency detour routing powered by the National Remote Sensing Centre (NRSC / ISRO) & NHAI Road Asset Management System.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRoadData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-300 flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            Sync Bhuvan Network
          </button>
          <a
            href="https://bhuvan.nrsc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-xs text-blue-300 flex items-center gap-1.5 transition"
          >
            <span>Bhuvan Geoportal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Active Corridors</span>
            <RouteIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-slate-100 mt-2">
            {roads.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            National & State Lifelines monitored
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <div className="text-xs font-semibold text-rose-300 uppercase tracking-wider flex items-center justify-between">
            <span>Active Blockages</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">
            {blockedCount}
          </div>
          <div className="text-xs text-rose-300/80 mt-1">
            Requiring immediate detour diversion
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
          <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center justify-between">
            <span>Isolated Villages</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            {isolatedVillagesTotal}
          </div>
          <div className="text-xs text-amber-300/80 mt-1">
            Cut off from primary road supply
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
          <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
            <span>BRO / PWD Response</span>
            <HardHat className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            Active
          </div>
          <div className="text-xs text-emerald-300/80 mt-1">
            Excavators & clearing taskforces deployed
          </div>
        </div>
      </div>

      {/* Emergency Detour Routing Calculator powered by Bhuvan Routing API */}
      <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 via-slate-900/60 to-slate-950 p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-blue-500/20 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                Bhuvan Emergency Detour Routing Engine
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  NRSC Routing API v2.1
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Automated shortest-path calculation bypassing active landslide blockages and unstable mountain corridors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
              <input 
                type="checkbox" 
                checked={avoidBlocked} 
                onChange={(e) => setAvoidBlocked(e.target.checked)}
                className="rounded text-blue-500 focus:ring-0" 
              />
              Avoid Active Landslide Zones
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Origin (Dispatch Station)
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Shillong Logistics Hub (NH-06)">Shillong Logistics Hub (NH-06)</option>
              <option value="Guwahati North Gate (Assam Entry)">Guwahati North Gate (Assam Entry)</option>
              <option value="Tura Civic Center (West Garo Hills)">Tura Civic Center (West Garo Hills)</option>
              <option value="Cherrapunji / Sohra Relief Base">Cherrapunji / Sohra Relief Base</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Destination (Target Depot)
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Silchar Relief Depot (Assam)">Silchar Relief Depot (Assam - Barak Valley)</option>
              <option value="Shillong Civil Hospital">Shillong Civil Hospital</option>
              <option value="Dawki International Border">Dawki International Border</option>
              <option value="West Garo Hills Main Axis">West Garo Hills Main Axis</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => calculateDetour()}
              disabled={routingLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-md"
            >
              {routingLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Bhuvan Topology...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Calculate Safe Detour Route</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Detour Result Card */}
        {detourPlan && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-blue-500/40 text-xs space-y-3 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  detourPlan.status === 'DETOUR_CALCULATED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {detourPlan.status}
                </span>
                <span className="font-mono text-slate-400 text-[11px]">{detourPlan.routeId}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <span>Total Distance: <strong className="text-white font-bold">{detourPlan.totalDistanceKm} km</strong></span>
                {detourPlan.detourDistanceAddedKm > 0 && (
                  <span className="text-amber-400">(+{detourPlan.detourDistanceAddedKm} km bypass)</span>
                )}
                <span>Est. Time: <strong className="text-white font-bold">{Math.floor(detourPlan.estimatedTransitTimeMinutes / 60)}h {detourPlan.estimatedTransitTimeMinutes % 60}m</strong></span>
                <span>Safety Index: <strong className="text-emerald-400 font-bold">{detourPlan.safetyScore}/100</strong></span>
              </div>
            </div>

            {/* Avoided Blockages */}
            {detourPlan.avoidedBlockages.length > 0 && (
              <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg p-2.5 text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <span className="font-bold">Avoided Dangerous Blockages: </span>
                  {detourPlan.avoidedBlockages.join(", ")}
                </div>
              </div>
            )}

            {/* Recommended Waypoints */}
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1.5">
                Bhuvan Verified Route Transit Sequence:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {detourPlan.recommendedPath.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                      {step}
                    </span>
                    {idx < detourPlan.recommendedPath.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Turn by turn advisories */}
            <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Field Navigation Advisories:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {detourPlan.turnByTurnAdvisories.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Corridors ({roads.length})
          </button>
          <button
            onClick={() => setFilter('BLOCKED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              filter === 'BLOCKED' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Blocked / High Hazard</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-900/60 text-rose-200">
              {blockedCount}
            </span>
          </button>
          <button
            onClick={() => setFilter('OPEN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'OPEN' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Open ({roads.length - blockedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search road, village, NH code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Road Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
            <span>Connecting to ISRO Bhuvan Road Network Data & RAMS...</span>
          </div>
        ) : filteredRoads.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-800/20 rounded-xl border border-slate-700/50">
            No road corridors match the selected criteria.
          </div>
        ) : (
          filteredRoads.map(road => {
            const isBlocked = road.status === 'BLOCKED' || road.status === 'PARTIALLY_BLOCKED' || road.status === 'CRITICAL_HAZARD';
            
            return (
              <div 
                key={road.id} 
                className={`p-5 rounded-xl border transition flex flex-col gap-4 ${
                  isBlocked 
                    ? 'bg-slate-900/80 border-rose-500/40 hover:border-rose-500/60' 
                    : 'bg-slate-800/20 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-slate-800 border border-slate-700 text-amber-400">
                      {road.code}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-100 text-lg">{road.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          road.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          road.status === 'BLOCKED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          road.status === 'CRITICAL_HAZARD' ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50 animate-pulse' :
                          'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}>
                          {road.status.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          {road.category.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {road.section}
                      </p>
                    </div>
                  </div>

                  {/* Vulnerability Index and Status Indicator */}
                  <div className="flex items-center gap-4 lg:self-end">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Slope Vulnerability</div>
                      <div className={`text-base font-black ${
                        road.vulnerabilityScore > 80 ? 'text-rose-400' :
                        road.vulnerabilityScore > 50 ? 'text-amber-400' :
                        'text-emerald-400'
                      }`}>
                        {road.vulnerabilityScore}%
                      </div>
                    </div>

                    <div className="w-10 flex justify-center">
                      {road.status === 'OPEN' ? (
                        <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                      ) : (
                        <AlertTriangle className="text-rose-500 w-8 h-8" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Blockage description if blocked */}
                {road.blockageReason && (
                  <div className="bg-rose-950/30 border border-rose-500/30 rounded-lg p-3 text-xs text-rose-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-rose-300">Hazard Cause: </strong>
                      {road.blockageReason}
                    </div>
                  </div>
                )}

                {/* Alternative and affected info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-700/40 text-xs">
                  <div>
                    <span className="text-slate-500 block font-medium">Bhuvan Detour Routing:</span>
                    <span className="text-slate-300 mt-0.5 block">{road.alternativeRoute}</span>
                    {road.alternativeDistanceKm > 0 && (
                      <span className="text-amber-400 text-[11px] block mt-0.5">
                        +{road.alternativeDistanceKm} km detour (~{road.estimatedDelayMinutes} min delay)
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block font-medium">Isolated / Cut-off Villages:</span>
                    <span className="text-slate-300 font-bold mt-0.5 block">
                      {road.affectedVillagesCount} villages
                    </span>
                    {road.affectedVillagesList.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {road.affectedVillagesList.map((village, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                            {village}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="text-slate-500 block font-medium">Clearing Agency & Progress:</span>
                      <span className="text-slate-300 text-[11px] block mt-0.5">{road.clearingAgency}</span>
                      
                      {isBlocked && (
                        <div className="mt-1.5 space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Clearing Progress</span>
                            <span className="font-bold text-amber-400">{road.clearingProgressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-amber-500 h-full rounded-full transition-all"
                              style={{ width: `${road.clearingProgressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Bhuvan RAMS ID: {road.bhuvanAssetId}</span>
                      {isBlocked && (
                        <button
                          onClick={() => {
                            calculateDetour(road.name, "Relief Depot");
                            window.scrollTo({ top: 220, behavior: 'smooth' });
                          }}
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-sans font-semibold"
                        >
                          <span>Plan Detour</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bhuvan Road Asset Management System (RAMS) & NRSC Metadata Footer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 shrink-0">
            NRSC
          </div>
          <div>
            <div className="font-semibold text-slate-200">
              National Remote Sensing Centre (NRSC / ISRO) & NHAI Road Asset Management System (RAMS)
            </div>
            <div className="text-[11px] text-slate-400">
              Corridor vectors, elevation contours, and landslide cut-off indices stream via OGC WMS/WFS and Bhuvan Routing API (Key: 14564377d06b9403fd936d5184832a2f77595ce8).
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
            WMS: transport:road_network
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px]">
            GATEWAY ONLINE
          </span>
        </div>
      </div>
    </div>
  );
}

