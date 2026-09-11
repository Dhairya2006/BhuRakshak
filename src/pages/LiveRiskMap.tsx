import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Map as MapIcon, 
  Layers, 
  Filter, 
  Box, 
  Crosshair, 
  Eye, 
  CheckSquare, 
  Square, 
  ChevronRight,
  Satellite,
  Activity,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Info,
  Route as RouteIcon,
  AlertTriangle
} from 'lucide-react';
import { mockLocations } from '../data/mockData';
import { DigitalTwinContainer } from '../components/DigitalTwin/DigitalTwinContainer';
import { useSimulation } from '../context/SimulationContext';
import { cn } from '../lib/utils';

// Fix for default Leaflet icons in React
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapBounds() {
  const map = useMap();
  useEffect(() => {
    map.setView([25.4670, 91.3662], 8);
  }, [map]);
  return null;
}

function MinimapBounds({ parentMap }: { parentMap: L.Map | null }) {
  const minimap = useMap();
  useEffect(() => {
    if (!parentMap) return;
    const updateMinimap = () => {
      const center = parentMap.getCenter();
      minimap.setView(center, Math.max(5, parentMap.getZoom() - 4), { animate: false });
    };
    parentMap.on('move', updateMinimap);
    updateMinimap();
    return () => { parentMap.off('move', updateMinimap); };
  }, [minimap, parentMap]);
  return null;
}

export function LiveRiskMap({ hideTitle = false }: { hideTitle?: boolean }) {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [layersOpen, setLayersOpen] = useState(false);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const sim = useSimulation();

  // Bhuvan Satellite base map configuration
  const [baseLayer, setBaseLayer] = useState<'bhuvan-satellite' | 'bhuvan-lulc' | 'esri'>('bhuvan-satellite');
  const [showBhuvanModal, setShowBhuvanModal] = useState(false);
  const [bhuvanProbe, setBhuvanProbe] = useState<any>(null);
  const [isProbingBhuvan, setIsProbingBhuvan] = useState(false);

  // Layer toggles
  const [showBhuvanDMSD, setShowBhuvanDMSD] = useState(true);
  const [showDrainage, setShowDrainage] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showRoadNetwork, setShowRoadNetwork] = useState(true);
  const [roadSegments, setRoadSegments] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/roads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRoadSegments(data);
      })
      .catch(err => console.error('Failed to load roads:', err));
  }, []);

  // Probe Bhuvan API
  const probeBhuvan = async () => {
    setIsProbingBhuvan(true);
    try {
      const res = await fetch('/api/bhuvan/probe');
      const data = await res.json();
      setBhuvanProbe(data);
    } catch (err: any) {
      setBhuvanProbe({ error: err.message, reachable: false });
    } finally {
      setIsProbingBhuvan(false);
    }
  };

  useEffect(() => {
    if (showBhuvanModal && !bhuvanProbe) {
      probeBhuvan();
    }
  }, [showBhuvanModal]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return '#f43f5e';
      case 'HIGH': return '#f59e0b';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#10b981';
      default: return '#64748b';
    }
  };

  const focusCritical = () => {
    if (mapRef) mapRef.flyTo([25.5134, 90.2312], 10);
  };

  const resetView = () => {
    if (mapRef) mapRef.flyTo([25.4670, 91.3662], 8);
  };

  if (viewMode === '3D') {
    return <DigitalTwinContainer onToggle2D={() => setViewMode('2D')} />;
  }

  // Active tile configuration
  const getTileConfig = () => {
    switch (baseLayer) {
      case 'bhuvan-satellite':
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: 'Tiles &copy; ISRO / NRSC Bhuvan (Cartosat 2.5m Ortho • Key: 145643...5ce8)'
        };
      case 'bhuvan-lulc':
        return {
          url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
          attribution: 'ISRO Bhuvan LULC 1:50K Thematic Classification'
        };
      case 'esri':
      default:
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: '&copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ'
        };
    }
  };

  const tileConfig = getTileConfig();

  return (
    <div className="flex flex-col h-full space-y-0 relative">
      {!hideTitle && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-blue-400" />
                Live AI Risk Map
              </h1>
              {/* ISRO Bhuvan Active Status Chip */}
              <button
                id="bhuvan-status-pill-btn"
                onClick={() => setShowBhuvanModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[10px] font-bold tracking-wider uppercase transition-colors"
                title="Click to view ISRO Bhuvan satellite connection status"
              >
                <Satellite className="w-3 h-3 text-orange-400" />
                <span>Bhuvan 2.5m</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Meghalaya Region</span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {sim.isSimulating ? 'Simulated Data' : 'Data Live'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 2D / 3D Switcher */}
            <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button className="px-3 py-1 bg-slate-700 text-white rounded text-[10px] font-bold shadow-sm uppercase">2D GIS</button>
              <button 
                onClick={() => setViewMode('3D')}
                className="px-3 py-1 text-slate-400 hover:text-white transition-colors rounded text-[10px] font-bold uppercase"
              >
                3D TWIN
              </button>
            </div>

            {/* Base Layer Selector */}
            <select
              id="base-map-selector"
              value={baseLayer}
              onChange={(e) => setBaseLayer(e.target.value as any)}
              className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[10px] font-bold uppercase focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="bhuvan-satellite">🛰️ Bhuvan Satellite (Cartosat 2.5m)</option>
              <option value="bhuvan-lulc">🗺️ Bhuvan LULC (Land Cover)</option>
              <option value="esri">🌐 Esri World Imagery</option>
            </select>
            
            <button 
              id="toggle-layers-btn"
              onClick={() => setLayersOpen(!layersOpen)}
              className={cn("px-3 py-1 border rounded-lg flex items-center gap-1.5 text-[10px] font-bold uppercase transition-colors", layersOpen ? "bg-blue-600/20 border-blue-500 text-blue-400" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700")}
            >
              <Layers className="w-3.5 h-3.5" /> Layers
            </button>
            <button onClick={focusCritical} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-1.5 text-[10px] font-bold uppercase text-rose-400 hover:bg-slate-700 transition-colors">
              <Eye className="w-3.5 h-3.5" /> Focus Critical
            </button>
            <button onClick={resetView} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-300 hover:bg-slate-700 transition-colors">
              <Crosshair className="w-3.5 h-3.5" /> Locate
            </button>
          </div>
        </div>
      )}

      <div className={cn("flex-1 rounded-xl overflow-hidden border border-slate-700 relative z-0", hideTitle ? "mt-0" : "mt-2")}>
        <MapContainer 
          center={[25.4670, 91.3662]} 
          zoom={8} 
          className="w-full h-full bg-slate-900" 
          zoomControl={false}
          ref={setMapRef}
        >
          <TileLayer
            key={baseLayer}
            attribution={tileConfig.attribution}
            url={tileConfig.url}
          />
          <MapBounds />
          
          {showRiskZones && mockLocations.map(loc => (
            <CircleMarker 
              key={loc.id} 
              center={loc.coordinates}
              radius={loc.riskLevel === 'CRITICAL' ? 14 : 10}
              pathOptions={{
                color: getRiskColor(loc.riskLevel),
                fillColor: getRiskColor(loc.riskLevel),
                fillOpacity: loc.riskLevel === 'CRITICAL' ? 0.6 : 0.4,
                weight: loc.riskLevel === 'CRITICAL' ? 3 : 2
              }}
            >
              <Popup className="custom-popup" closeButton={false}>
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl shadow-black/50 min-w-[200px] text-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider">{loc.name}</h3>
                      <p className="text-[10px] text-slate-400 uppercase">{loc.district}</p>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", 
                        loc.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                        loc.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      )}>
                        {loc.riskLevel}
                      </div>
                      <div className="text-xs font-mono font-bold mt-1 text-slate-300">{loc.probability}/100</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-xs border-t border-slate-700/50 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rainfall</span>
                      <span className="font-mono text-blue-300">184 mm/24h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Soil Moisture</span>
                      <span className="font-mono text-cyan-300">91%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Slope</span>
                      <span className="font-mono">42°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pop. Affected</span>
                      <span className="font-mono text-amber-300">12,400</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-col gap-1.5">
                    <button className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider transition-colors border border-blue-600/50">View Analysis</button>
                    <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded uppercase tracking-wider transition-colors border border-slate-700">Simulate Scenario</button>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* ISRO Bhuvan Road Network Vectors & Blockages */}
          {showRoadNetwork && roadSegments.map((road: any) => {
            const isBlocked = road.status === 'BLOCKED' || road.status === 'PARTIALLY_BLOCKED' || road.status === 'CRITICAL_HAZARD';
            const color = road.status === 'OPEN' ? '#10b981' : 
                          road.status === 'CRITICAL_HAZARD' ? '#f43f5e' : 
                          road.status === 'BLOCKED' ? '#e11d48' : '#f59e0b';
            
            const midCoord = road.coordinates && road.coordinates.length > 2 
              ? road.coordinates[Math.floor(road.coordinates.length / 2)] 
              : null;

            return (
              <React.Fragment key={road.id}>
                <Polyline
                  positions={road.coordinates}
                  pathOptions={{
                    color: color,
                    weight: isBlocked ? 5 : 3.5,
                    dashArray: isBlocked ? '8, 6' : undefined,
                    opacity: 0.95
                  }}
                >
                  <Popup className="custom-popup" closeButton={false}>
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl min-w-[220px] text-slate-200">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                          {road.code}
                        </span>
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase",
                          road.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        )}>
                          {road.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white">{road.name}</h4>
                      <p className="text-[10px] text-slate-400">{road.section}</p>
                      
                      {road.blockageReason && (
                        <div className="mt-2 text-[10px] bg-rose-500/10 border border-rose-500/30 p-2 rounded text-rose-300 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>Blockage Alert:</strong> {road.blockageReason}
                          </div>
                        </div>
                      )}

                      <div className="mt-2.5 pt-2 border-t border-slate-700/60 text-[10px] space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Detour Extra:</span>
                          <span className="text-amber-300 font-semibold">+{road.alternativeDistanceKm} km</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Clearing Progress:</span>
                          <span className="text-slate-200 font-mono">{road.clearingProgress}%</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Bhuvan RAMS Code:</span>
                          <span className="font-mono text-slate-400">{road.bhuvanAssetId}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Polyline>

                {/* Landslide Cut-off Warning Marker */}
                {isBlocked && midCoord && (
                  <CircleMarker
                    center={midCoord}
                    radius={6}
                    pathOptions={{
                      color: '#f43f5e',
                      fillColor: '#ffffff',
                      fillOpacity: 0.9,
                      weight: 3
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Floating Bhuvan Active Sensor Watermark / Pill */}
        <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-lg pointer-events-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
          <div className="text-[10px] font-mono text-slate-300">
            <strong className="text-orange-400">ISRO Bhuvan</strong>: Road Network & RAMS (Key: 145643...5ce8)
          </div>
          <button 
            onClick={() => setShowBhuvanModal(true)}
            className="text-[10px] text-blue-400 hover:text-blue-300 underline font-semibold ml-1"
          >
            Telemetry
          </button>
        </div>

        {/* Floating Legend */}
        <div className="absolute bottom-6 left-6 z-[400] bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg p-3 shadow-lg pointer-events-auto">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Risk Level</h4>
          <div className="flex flex-col gap-1.5 text-[10px] font-semibold text-slate-200">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div> CRITICAL</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div> VERY HIGH</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> HIGH</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div> MODERATE</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> LOW</div>
          </div>
        </div>

        {/* Floating Layers Panel */}
        {layersOpen && (
          <div className="absolute top-6 right-6 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-4 shadow-xl w-56 pointer-events-auto animate-in fade-in slide-in-from-top-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Map & Geospatial Layers</h4>
            <div className="space-y-2 text-xs font-medium text-slate-300">
              <label 
                className="flex items-center gap-2 cursor-pointer hover:text-white"
                onClick={() => setShowRiskZones(!showRiskZones)}
              >
                {showRiskZones ? <CheckSquare className="w-4 h-4 text-blue-500" /> : <Square className="w-4 h-4 text-slate-500" />}
                AI Risk Zones
              </label>
              <label 
                className="flex items-center gap-2 cursor-pointer hover:text-white"
                onClick={() => setShowBhuvanDMSD(!showBhuvanDMSD)}
              >
                {showBhuvanDMSD ? <CheckSquare className="w-4 h-4 text-orange-400" /> : <Square className="w-4 h-4 text-slate-500" />}
                ISRO DMSD Landslide Grid
              </label>
              <label 
                className="flex items-center gap-2 cursor-pointer hover:text-white"
                onClick={() => setShowDrainage(!showDrainage)}
              >
                {showDrainage ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4 text-slate-500" />}
                Bhuvan Drainage & Streams
              </label>
              <label 
                className="flex items-center gap-2 cursor-pointer hover:text-white"
                onClick={() => setShowRoadNetwork(!showRoadNetwork)}
              >
                {showRoadNetwork ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-500" />}
                Bhuvan Road Network ({roadSegments.length} Corridors)
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white"><Square className="w-4 h-4 text-slate-500" /> Field Incidents</label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white"><Square className="w-4 h-4 text-slate-500" /> IoT Soil Sensors</label>
            </div>
            <div className="my-3 border-t border-slate-700/50"></div>
            <div className="space-y-2 text-xs font-medium text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300"><Square className="w-4 h-4" /> IMD Rainfall Isohyet</label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300"><Square className="w-4 h-4" /> Soil Saturation Gradient</label>
            </div>
          </div>
        )}

        {/* MiniMap Overview */}
        <div className="absolute bottom-6 right-6 z-[400] w-48 h-32 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-xl pointer-events-auto flex flex-col group">
          <div className="bg-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex justify-between items-center z-10">
            <span>Region Overview</span>
            <span className="flex items-center">Meghalaya <ChevronRight className="w-3 h-3" /></span>
          </div>
          <div className="flex-1 relative">
            <MapContainer 
              center={[25.4670, 91.3662]} 
              zoom={5} 
              zoomControl={false} 
              scrollWheelZoom={false} 
              dragging={false} 
              doubleClickZoom={false}
              className="w-full h-full bg-slate-950"
            >
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              <MinimapBounds parentMap={mapRef} />
              
              {/* Critical markers on minimap */}
              <CircleMarker center={[25.5134, 90.2312]} radius={4} pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 1, weight: 1 }} />
            </MapContainer>
            
            {/* Viewport rectangle simulation overlay on minimap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-8 border border-white/50 bg-white/10 z-[500] pointer-events-none rounded-sm shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
          </div>
        </div>

      </div>

      {/* ISRO BHUVAN SATELLITE TELEMETRY MODAL */}
      {showBhuvanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                  <Satellite className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    ISRO Bhuvan Satellite Map Gateway
                    <span className="px-2 py-0.5 text-[10px] rounded font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Connected
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">National Remote Sensing Centre (NRSC) • ISRO</p>
                </div>
              </div>
              <button
                onClick={() => setShowBhuvanModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Credentials Card */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Authenticated Bhuvan API Key / Token
                </div>
                <div className="flex items-center justify-between font-mono bg-slate-900 p-2 rounded border border-slate-800 text-blue-300">
                  <span className="select-all">14564377d06b9403fd936d5184832a2f77595ce8</span>
                  <span className="text-[10px] font-sans px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold">Active</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Token successfully bound to BhuRakshak geospatial mapping runtime and backend proxy service.
                </p>
              </div>

              {/* Satellite Constellation & Road Network Specs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Road Network & RAMS</div>
                  <div className="font-semibold text-emerald-400">ISRO NRSC Road Vectors</div>
                  <div className="text-slate-400 text-[11px] mt-1">1:10,000 scale NH/SH corridor topology</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Routing & Detour Engine</div>
                  <div className="font-semibold text-orange-400 font-mono">Bhuvan Routing API (Active)</div>
                  <div className="text-slate-400 text-[11px] mt-1">Dynamic landslide bypass calculator</div>
                </div>
              </div>

              {/* Probe Result Section */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                    Gateway Connection Diagnostics
                  </span>
                  <button
                    onClick={probeBhuvan}
                    disabled={isProbingBhuvan}
                    className="flex items-center gap-1 text-[11px] font-sans text-blue-400 hover:text-blue-300 disabled:opacity-50"
                  >
                    <RefreshCw className={cn("w-3 h-3", isProbingBhuvan && "animate-spin")} />
                    <span>{isProbingBhuvan ? "Pinging..." : "Re-probe"}</span>
                  </button>
                </div>

                {isProbingBhuvan ? (
                  <div className="py-4 text-center text-slate-400 font-sans text-[11px]">
                    Checking connection to https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/wms...
                  </div>
                ) : bhuvanProbe ? (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Endpoint:</span>
                      <span className="text-slate-300 truncate max-w-[300px]">{bhuvanProbe.endpoint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-emerald-400 font-bold">HTTP {bhuvanProbe.statusCode} ({bhuvanProbe.statusText})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Latency:</span>
                      <span className="text-blue-400 font-bold">{bhuvanProbe.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Road Corridors:</span>
                      <span className="text-emerald-300 font-bold">5 Monitored (NH-06, NH-40, SH-03)</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Endpoints Table */}
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div>• <strong className="text-slate-300 font-mono">Bhuvan Road Vectors:</strong> https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms (layer: road_network)</div>
                <div>• <strong className="text-slate-300 font-mono">Routing Service:</strong> https://bhuvan-app1.nrsc.gov.in/api/routing</div>
                <div>• <strong className="text-slate-300 font-mono">RAMS Telemetry:</strong> Bound to token 14564377d06b9403fd936d5184832a2f77595ce8</div>
              </div>

            </div>

            <div className="mt-6 flex justify-between items-center border-t border-slate-800 pt-4">
              <a
                href="https://bhuvan-app1.nrsc.gov.in/api/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
              >
                <span>Bhuvan Developer Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setShowBhuvanModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
