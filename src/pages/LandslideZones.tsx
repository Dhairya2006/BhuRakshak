import React, { useState } from 'react';
import { 
  Mountain, 
  AlertTriangle, 
  ShieldCheck, 
  Filter, 
  Search, 
  Download, 
  ExternalLink, 
  Activity, 
  ChevronRight, 
  Info,
  MapPin,
  Layers,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface LHZZone {
  id: string;
  code: string;
  name: string;
  district: string;
  riskCategory: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  vulnerabilityIndex: number; // 0-100
  slopeGradient: number; // degrees
  lithology: string;
  soilDepth: string;
  populationExposed: number;
  criticalInfrastructure: string[];
  monitoringSensors: number;
  drainageDensity: 'Very High' | 'High' | 'Moderate' | 'Low';
  lastFailureDate?: string;
  advisory: string;
  mitigationStatus: string;
}

const zonesData: LHZZone[] = [
  {
    id: 'z1',
    code: 'LHZ-WGH-01',
    name: 'Tura Peak North-Western Spur',
    district: 'West Garo Hills',
    riskCategory: 'VERY_HIGH',
    vulnerabilityIndex: 94.2,
    slopeGradient: 46,
    lithology: 'Weathered Gneissic Complex & Colluvium',
    soilDepth: '1.8m - 2.5m (Saturated)',
    populationExposed: 18400,
    criticalInfrastructure: ['Tura-Rongram SH-03', 'Civil Hospital Water Pipeline', 'High-Tension Transmission Line'],
    monitoringSensors: 8,
    drainageDensity: 'Very High',
    lastFailureDate: 'July 2024',
    advisory: 'RED ADVISORY: Evacuation standby ordered for downhill settlements along Rongram stream.',
    mitigationStatus: 'Shotcreting complete at Km 14; 2 wireless piezometers operational.'
  },
  {
    id: 'z2',
    code: 'LHZ-EJH-04',
    name: 'Sonapur Tunnel & Lukha Catchment',
    district: 'East Jaintia Hills',
    riskCategory: 'VERY_HIGH',
    vulnerabilityIndex: 89.6,
    slopeGradient: 42,
    lithology: 'Fractured Sandstone with Soft Shale Partings',
    soilDepth: '3.2m Colluvial Debris',
    populationExposed: 6800,
    criticalInfrastructure: ['National Highway 06 (Life-line to Silchar/Tripura)', 'Sonapur Bridge Approach'],
    monitoringSensors: 6,
    drainageDensity: 'Very High',
    lastFailureDate: 'Active Mudflow (Current Event)',
    advisory: 'CRITICAL WARNING: Heavy rockslide at Km 142. Heavy vehicles diverted via alternate hill corridor.',
    mitigationStatus: 'Heavy clearing crews & hydraulic excavators deployed by NHAI RAMS.'
  },
  {
    id: 'z3',
    code: 'LHZ-EKH-02',
    name: 'Sohra - Shella Escarpment Edge',
    district: 'East Khasi Hills',
    riskCategory: 'HIGH',
    vulnerabilityIndex: 78.1,
    slopeGradient: 51,
    lithology: 'Karstified Limestone & Bedded Sandstone',
    soilDepth: '0.8m Residual Soil (Thin)',
    populationExposed: 12200,
    criticalInfrastructure: ['Sohra-Shella Border Road', 'Cement Freight Ropeway', 'Primary Power Substation'],
    monitoringSensors: 4,
    drainageDensity: 'High',
    lastFailureDate: 'June 2023',
    advisory: 'ORANGE ADVISORY: Karst piping triggered by 184mm/24h continuous monsoon rainfall.',
    mitigationStatus: 'Catchwater surface drains constructed; regular geological survey drone passes.'
  },
  {
    id: 'z4',
    code: 'LHZ-EKH-07',
    name: 'Nongthymmai - Upper Shillong Hillside',
    district: 'East Khasi Hills',
    riskCategory: 'HIGH',
    vulnerabilityIndex: 82.5,
    slopeGradient: 38,
    lithology: 'Shillong Group Quartzites & Phyllite with Cut Slopes',
    soilDepth: '2.1m Overburden with High Fill',
    populationExposed: 24500,
    criticalInfrastructure: ['Urban Transit Radial', 'Water Treatment Feeder', 'Municipal School Complex'],
    monitoringSensors: 5,
    drainageDensity: 'High',
    lastFailureDate: 'August 2022',
    advisory: 'ORANGE ADVISORY: Unregulated terraced urban construction causing toe over-steepening.',
    mitigationStatus: 'Retaining wall reinforcement underway; citizen reporting geofenced.'
  },
  {
    id: 'z5',
    code: 'LHZ-WJH-02',
    name: 'Jowai Eastern Bypass Valley Corridor',
    district: 'West Jaintia Hills',
    riskCategory: 'MODERATE',
    vulnerabilityIndex: 45.0,
    slopeGradient: 28,
    lithology: 'Compacted Sandstone Bedrock with Vegetative Cushion',
    soilDepth: '1.2m Clay Loam',
    populationExposed: 5400,
    criticalInfrastructure: ['Jowai Bypass Radial Road', 'Agricultural Terrace System'],
    monitoringSensors: 3,
    drainageDensity: 'Moderate',
    advisory: 'YELLOW WATCH: Moderate soil pore pressure increase; stable under current load.',
    mitigationStatus: 'Bio-engineering vetiver grass slopes stabilized and monitored.'
  },
  {
    id: 'z6',
    code: 'LHZ-RIB-01',
    name: 'Umiam Lake Northern Catchment Bank',
    district: 'Ri Bhoi',
    riskCategory: 'LOW',
    vulnerabilityIndex: 12.4,
    slopeGradient: 19,
    lithology: 'Dense Metamorphic Granite-Gneiss Bedrock',
    soilDepth: '0.6m Compact Lithosol',
    populationExposed: 3100,
    criticalInfrastructure: ['Umiam Dam Reservoir Margin', 'GS Road Scenic Corridor'],
    monitoringSensors: 2,
    drainageDensity: 'Low',
    advisory: 'GREEN NORMAL: Nominal slope stability index. Normal routine patrol.',
    mitigationStatus: 'Stable rocky embankment with automated lake shore inclinometer.'
  },
  {
    id: 'z7',
    code: 'LHZ-EGH-03',
    name: 'Williamnagar - Simsang River Bluff',
    district: 'East Garo Hills',
    riskCategory: 'MODERATE',
    vulnerabilityIndex: 58.6,
    slopeGradient: 34,
    lithology: 'Tertiary Sedimentary Sandstone & River Alluvium',
    soilDepth: '2.4m Sandy Silt',
    populationExposed: 8900,
    criticalInfrastructure: ['Simsang Bridge Abutment', 'District Administrative Road'],
    monitoringSensors: 3,
    drainageDensity: 'Moderate',
    lastFailureDate: 'Sept 2023',
    advisory: 'YELLOW WATCH: Riverbank scouring observed during peak monsoon discharge.',
    mitigationStatus: 'Rock boulder riprap revetment maintained by PWD.'
  }
];

export function LandslideZones() {
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedZone, setInspectedZone] = useState<LHZZone | null>(null);

  const districts = ['ALL', 'West Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'West Jaintia Hills', 'Ri Bhoi', 'East Garo Hills'];

  const filteredZones = zonesData.filter(zone => {
    const matchesRisk = selectedRisk === 'ALL' || zone.riskCategory === selectedRisk;
    const matchesDistrict = selectedDistrict === 'ALL' || zone.district === selectedDistrict;
    const matchesSearch = 
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.lithology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesDistrict && matchesSearch;
  });

  const getRiskBadge = (category: string) => {
    switch (category) {
      case 'VERY_HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40">Very High Risk (VHR)</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/40">High Risk (HR)</span>;
      case 'MODERATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">Moderate Risk (MR)</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">Low Risk (LR)</span>;
      default:
        return null;
    }
  };

  const handleExport = () => {
    const headers = ["Zone Code,Zone Name,District,Risk Category,Vulnerability Index,Slope Angle,Exposed Population,Status"];
    const rows = filteredZones.map(z => 
      `"${z.code}","${z.name}","${z.district}","${z.riskCategory}",${z.vulnerabilityIndex},${z.slopeGradient},${z.populationExposed},"${z.advisory.replace(/"/g, '""')}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NER_SAFE_LHZ_Zonation_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                Landslide Hazard Zonation (LHZ)
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-medium">
                  BIS 14496 / GSI Macro-Zonation
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                High-resolution slope vulnerability atlas, lithological stability classifications, and critical transport corridor risks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export LHZ Registry (CSV)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Mapped Micro-Zones</div>
          <div className="text-2xl font-bold text-slate-100 font-mono">42 <span className="text-xs font-sans text-slate-500 font-normal">Sectors</span></div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Across 12 Meghalaya & Border Districts
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 shadow-sm">
          <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1">Very High Risk (VHR) Zones</div>
          <div className="text-2xl font-bold text-rose-400 font-mono">7 <span className="text-xs font-sans text-rose-300 font-normal">Active</span></div>
          <div className="text-[11px] text-rose-300 mt-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Immediate monitoring & sensor telemetry
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Population in Risk Envelope</div>
          <div className="text-2xl font-bold text-amber-300 font-mono">79,300 <span className="text-xs font-sans text-slate-500 font-normal">Residents</span></div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Geofenced for CAP early warning
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active IoT Slope Sensors</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">31 <span className="text-xs font-sans text-emerald-500 font-normal">Nodes Active</span></div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Inclinometers, piezometers & rain gauges
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search zone, highway, lithology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Risk Ratings</option>
              <option value="VERY_HIGH">Very High Risk (VHR)</option>
              <option value="HIGH">High Risk (HR)</option>
              <option value="MODERATE">Moderate Risk (MR)</option>
              <option value="LOW">Low Risk (LR)</option>
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              {districts.map(d => (
                <option key={d} value={d}>{d === 'ALL' ? 'All Districts' : d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono self-end md:self-auto">
          Showing <strong className="text-slate-200">{filteredZones.length}</strong> of {zonesData.length} monitored micro-zones
        </div>
      </div>

      {/* Zonation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredZones.map(zone => (
          <div
            key={zone.id}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {zone.code}
                </span>
                {getRiskBadge(zone.riskCategory)}
              </div>

              <h3 className="text-base font-bold text-slate-100 group-hover:text-rose-400 transition-colors">
                {zone.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{zone.district}</span>
              </div>

              {/* Vulnerability Score Meter */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400 font-medium">Vulnerability Index:</span>
                  <span className="font-mono font-bold text-slate-200">{zone.vulnerabilityIndex}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      zone.vulnerabilityIndex >= 85 ? "bg-rose-500" :
                      zone.vulnerabilityIndex >= 70 ? "bg-orange-500" :
                      zone.vulnerabilityIndex >= 40 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${zone.vulnerabilityIndex}%` }}
                  />
                </div>
              </div>

              {/* Slope & Geological Details */}
              <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Slope Gradient:</span>
                  <span className="text-slate-300 font-mono font-bold">{zone.slopeGradient}° ({zone.slopeGradient > 40 ? 'Steep Escarpment' : 'Moderate Incline'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lithological Matrix:</span>
                  <span className="text-slate-300 text-right truncate max-w-[170px]" title={zone.lithology}>{zone.lithology}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Exposed Population:</span>
                  <span className="text-amber-300 font-mono font-bold">{zone.populationExposed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monitoring IoT Nodes:</span>
                  <span className="text-emerald-400 font-mono font-bold">{zone.monitoringSensors} telemetry units</span>
                </div>
              </div>

              {/* Advisory Box */}
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                <p className="line-clamp-2">{zone.advisory}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Drainage: <strong className="text-slate-400">{zone.drainageDensity}</strong>
              </span>
              <button
                onClick={() => setInspectedZone(zone)}
                className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
              >
                <span>Slope Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Geotechnical Profile Drawer Modal */}
      {inspectedZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {inspectedZone.code}
                  </span>
                  {getRiskBadge(inspectedZone.riskCategory)}
                </div>
                <h2 className="text-xl font-bold text-white">{inspectedZone.name}</h2>
                <p className="text-xs text-slate-400">{inspectedZone.district} • Geotechnical & Slope Profile</p>
              </div>
              <button
                onClick={() => setInspectedZone(null)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">Active Landslide Advisory</div>
                <p className="text-slate-200 leading-relaxed">{inspectedZone.advisory}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Slope Angle</div>
                  <div className="text-base font-bold text-slate-100 font-mono mt-0.5">{inspectedZone.slopeGradient}°</div>
                  <div className="text-[10px] text-slate-400">Critical above 35°</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Soil Colluvium Depth</div>
                  <div className="text-base font-bold text-slate-100 font-mono mt-0.5">{inspectedZone.soilDepth}</div>
                  <div className="text-[10px] text-slate-400">High saturation risk</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Drainage Density</div>
                  <div className="text-base font-bold text-blue-400 font-mono mt-0.5">{inspectedZone.drainageDensity}</div>
                  <div className="text-[10px] text-slate-400">Surface runoff concentration</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-2">Critical Infrastructure in Hazard Path</div>
                <ul className="space-y-1.5 text-slate-300">
                  {inspectedZone.criticalInfrastructure.map((infra, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{infra}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Mitigation & Engineering Measures</div>
                <p className="text-slate-300 leading-relaxed">{inspectedZone.mitigationStatus}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectedZone(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
