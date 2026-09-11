import React, { useState } from 'react';
import { 
  BellRing, 
  Send, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  ShieldAlert, 
  Users, 
  Filter, 
  Search, 
  RefreshCw,
  Megaphone,
  Check,
  Languages
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface DispatchedAlert {
  id: string;
  capIdentifier: string;
  severity: 'RED' | 'ORANGE' | 'YELLOW' | 'ALL_CLEAR';
  headline: string;
  targetArea: string;
  district: string;
  dispatchedAt: string;
  recipientsReached: number;
  acknowledgmentRate: number; // percentage
  channels: ('CELL_BROADCAST' | 'SMS' | 'SIREN' | 'WHATSAPP' | 'VHF_POLICE')[];
  languages: ('English' | 'Khasi' | 'Garo' | 'Assamese')[];
  instruction: string;
  status: 'DISPATCHED' | 'ACTIVE' | 'EXPIRED';
}

const initialAlerts: DispatchedAlert[] = [
  {
    id: 'alt-01',
    capIdentifier: 'CAP-NER-2026-09-0018',
    severity: 'RED',
    headline: 'IMMEDIATE EVACUATION: Critical Landslide Hazard at Tura Peak Northwest Sector',
    targetArea: 'Tura Peak, Rongram Valley, SH-03 Corridor',
    district: 'West Garo Hills',
    dispatchedAt: '12 mins ago (18:46 IST)',
    recipientsReached: 18400,
    acknowledgmentRate: 92.4,
    channels: ['CELL_BROADCAST', 'SMS', 'SIREN', 'WHATSAPP'],
    languages: ['Garo', 'English', 'Assamese'],
    instruction: 'Move uphill immediately to designated relief shelters at Tura Govt College. Avoid SH-03 culverts.',
    status: 'ACTIVE'
  },
  {
    id: 'alt-02',
    capIdentifier: 'CAP-NER-2026-09-0017',
    severity: 'RED',
    headline: 'NH-06 CLOSED: Massive Mudflow at Sonapur Tunnel Km 142',
    targetArea: 'Sonapur Tunnel, Lumshnong, Khliehriat',
    district: 'East Jaintia Hills',
    dispatchedAt: '1 hour ago (17:55 IST)',
    recipientsReached: 34200,
    acknowledgmentRate: 96.1,
    channels: ['CELL_BROADCAST', 'SMS', 'VHF_POLICE'],
    languages: ['Khasi', 'English'],
    instruction: 'NH-06 impassable. Inter-state trucks halt at Umkiang border checkpost. Detour via Badarpur.',
    status: 'ACTIVE'
  },
  {
    id: 'alt-03',
    capIdentifier: 'CAP-NER-2026-09-0016',
    severity: 'ORANGE',
    headline: 'SLOPE MOVEMENT ADVISORY: Sohra-Shella Karst Escarpment',
    targetArea: 'Cherrapunji, Shella Valley, Mawsmai',
    district: 'East Khasi Hills',
    dispatchedAt: '3 hours ago (15:30 IST)',
    recipientsReached: 12200,
    acknowledgmentRate: 88.5,
    channels: ['SMS', 'WHATSAPP'],
    languages: ['Khasi', 'English'],
    instruction: 'Continuous rainfall exceeding 180mm. Monitor rockfall barriers and avoid cliff trails.',
    status: 'ACTIVE'
  },
  {
    id: 'alt-04',
    capIdentifier: 'CAP-NER-2026-09-0015',
    severity: 'YELLOW',
    headline: 'WEATHER WATCH: Heavy Monsoon Inflow Across Jowai Bypass',
    targetArea: 'Jowai Urban & Rural Margins',
    district: 'West Jaintia Hills',
    dispatchedAt: '6 hours ago (12:45 IST)',
    recipientsReached: 9800,
    acknowledgmentRate: 81.2,
    channels: ['SMS'],
    languages: ['Khasi', 'English'],
    instruction: 'Road surface slippery. Restrict non-essential heavy transport during evening hours.',
    status: 'ACTIVE'
  },
  {
    id: 'alt-05',
    capIdentifier: 'CAP-NER-2026-09-0014',
    severity: 'ALL_CLEAR',
    headline: 'ALL-CLEAR: Nongpoh Sector Slope Stabilized',
    targetArea: 'Nongpoh Radial Road Km 28',
    district: 'Ri Bhoi',
    dispatchedAt: 'Yesterday (21:00 IST)',
    recipientsReached: 15400,
    acknowledgmentRate: 94.0,
    channels: ['SMS', 'WHATSAPP'],
    languages: ['English', 'Khasi'],
    instruction: 'Clearing operations complete. Standard traffic resumed with cautionary speed limits.',
    status: 'EXPIRED'
  }
];

export function AlertsNotifications() {
  const [alerts, setAlerts] = useState<DispatchedAlert[]>(initialAlerts);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Form State
  const [headline, setHeadline] = useState('');
  const [district, setDistrict] = useState('West Garo Hills');
  const [targetArea, setTargetArea] = useState('');
  const [severity, setSeverity] = useState<'RED' | 'ORANGE' | 'YELLOW'>('ORANGE');
  const [instruction, setInstruction] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['CELL_BROADCAST', 'SMS', 'WHATSAPP']);

  const filteredAlerts = alerts.filter(a => {
    const matchesSev = filterSeverity === 'ALL' || a.severity === filterSeverity;
    const matchesSearch = 
      a.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.targetArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.capIdentifier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline || !targetArea) return;

    setIsSending(true);

    setTimeout(() => {
      const newAlert: DispatchedAlert = {
        id: `alt-${Date.now()}`,
        capIdentifier: `CAP-NER-${new Date().toISOString().slice(0, 10)}-00${alerts.length + 1}`,
        severity,
        headline,
        targetArea,
        district,
        dispatchedAt: 'Just now (Live)',
        recipientsReached: Math.floor(Math.random() * 15000) + 5000,
        acknowledgmentRate: 98.2,
        channels: selectedChannels as any,
        languages: ['English', 'Khasi', 'Garo'],
        instruction: instruction || 'Follow instructions from local district disaster management authorities.',
        status: 'ACTIVE'
      };

      setAlerts([newAlert, ...alerts]);
      setIsSending(false);
      setIsModalOpen(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);

      // Reset form
      setHeadline('');
      setTargetArea('');
      setInstruction('');
    }, 800);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'RED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">Red Alert (Critical)</span>;
      case 'ORANGE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/40">Orange Warning</span>;
      case 'YELLOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">Yellow Advisory</span>;
      case 'ALL_CLEAR':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">All Clear Notice</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                Early Warning & Common Alerting Protocol (CAP)
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-medium">
                  NDMA / SDMA Gateway
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Multi-channel emergency broadcast dispatcher: Cell Broadcast, SMS, Acoustic Sirens, and Wireless Radio.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-rose-900/30"
          >
            <Megaphone className="w-4 h-4" />
            <span>Dispatch Emergency Alert</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="font-bold text-xs">Emergency Alert Dispatched Successfully!</div>
              <div className="text-[11px] text-emerald-400/80">Disseminated via Cell Broadcast & SMS gateways to all target towers.</div>
            </div>
          </div>
          <button onClick={() => setSuccessToast(false)} className="text-emerald-400 text-xs font-bold">✕</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recipients Reached (24h)</div>
          <div className="text-2xl font-bold text-slate-100 font-mono">184,200 <span className="text-xs font-sans text-slate-500 font-normal">Civilians</span></div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            Across 14 telecom carrier base stations
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 shadow-sm">
          <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1">Active Red Alerts</div>
          <div className="text-2xl font-bold text-rose-400 font-mono">2 <span className="text-xs font-sans text-rose-300 font-normal">Active</span></div>
          <div className="text-[11px] text-rose-300 mt-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Tura Peak & Sonapur NH-06 Corridors
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dissemination Latency</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">3.8s <span className="text-xs font-sans text-slate-500 font-normal">Cell Broadcast</span></div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Zero-congestion broadcast channel
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Acoustic Sirens Online</div>
          <div className="text-2xl font-bold text-blue-400 font-mono">28 / 30 <span className="text-xs font-sans text-slate-500 font-normal">Operational</span></div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            Solar backup & VHF wireless link OK
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
              placeholder="Search headline, CAP ID, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Alert Levels</option>
              <option value="RED">Red Alert</option>
              <option value="ORANGE">Orange Warning</option>
              <option value="YELLOW">Yellow Advisory</option>
              <option value="ALL_CLEAR">All Clear</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Total Broadcast Records: <strong className="text-slate-200">{filteredAlerts.length}</strong>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={cn(
              "p-5 rounded-xl border transition-all flex flex-col justify-between shadow-sm",
              alert.severity === 'RED' ? "bg-rose-950/15 border-rose-500/40" :
              alert.severity === 'ORANGE' ? "bg-orange-950/15 border-orange-500/40" :
              alert.severity === 'YELLOW' ? "bg-amber-950/10 border-amber-500/30" :
              "bg-slate-900/40 border-slate-800"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {alert.capIdentifier}
                </span>
                {getSeverityBadge(alert.severity)}
                <span className="text-xs font-semibold text-slate-300">
                  {alert.district} • {alert.targetArea}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{alert.dispatchedAt}</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-100 mb-1.5">
              {alert.headline}
            </h3>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-300 mb-3">
              <strong className="text-rose-400">Public Instruction: </strong>
              {alert.instruction}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Channels:</span>
                {alert.channels.map(ch => (
                  <span key={ch} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                    {ch.replace('_', ' ')}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-slate-400">
                <span>Reached: <strong className="text-slate-200 font-mono">{alert.recipientsReached.toLocaleString()}</strong></span>
                <span>Ack: <strong className="text-emerald-400 font-mono">{alert.acknowledgmentRate}%</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Dispatch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-rose-500" />
                  Dispatch Common Alerting Protocol (CAP) Alert
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Authoritative early warning broadcast to disaster operations and citizen networks.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Threat Severity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSeverity('RED')}
                    className={cn(
                      "py-2 px-3 rounded-lg border font-bold text-center transition-all",
                      severity === 'RED' ? "bg-rose-600/30 border-rose-500 text-rose-300 ring-1 ring-rose-500" : "bg-slate-950 border-slate-800 text-slate-400"
                    )}
                  >
                    RED (Critical)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeverity('ORANGE')}
                    className={cn(
                      "py-2 px-3 rounded-lg border font-bold text-center transition-all",
                      severity === 'ORANGE' ? "bg-orange-600/30 border-orange-500 text-orange-300 ring-1 ring-orange-500" : "bg-slate-950 border-slate-800 text-slate-400"
                    )}
                  >
                    ORANGE (Warning)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeverity('YELLOW')}
                    className={cn(
                      "py-2 px-3 rounded-lg border font-bold text-center transition-all",
                      severity === 'YELLOW' ? "bg-amber-600/30 border-amber-500 text-amber-300 ring-1 ring-amber-500" : "bg-slate-950 border-slate-800 text-slate-400"
                    )}
                  >
                    YELLOW (Watch)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="West Garo Hills">West Garo Hills</option>
                    <option value="East Jaintia Hills">East Jaintia Hills</option>
                    <option value="East Khasi Hills">East Khasi Hills</option>
                    <option value="West Jaintia Hills">West Jaintia Hills</option>
                    <option value="Ri Bhoi">Ri Bhoi</option>
                    <option value="South Garo Hills">South Garo Hills</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Sector / Corridor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tura Peak Spur, Rongram Valley"
                    value={targetArea}
                    onChange={(e) => setTargetArea(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Alert Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH LANDSLIDE EVACUATION: Immediate evacuation of lower hill settlement"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Protective Action & Public Instruction</label>
                <textarea
                  rows={3}
                  placeholder="Clear instructions for citizens and emergency clearing teams..."
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1.5">Broadcast Delivery Channels</label>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  {['CELL_BROADCAST', 'SMS', 'SIREN', 'WHATSAPP', 'VHF_POLICE'].map((ch) => (
                    <label key={ch} className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedChannels.includes(ch)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedChannels([...selectedChannels, ch]);
                          else setSelectedChannels(selectedChannels.filter(c => c !== ch));
                        }}
                        className="rounded bg-slate-800 border-slate-700 text-rose-500"
                      />
                      <span className="font-mono text-[11px]">{ch.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className={cn("w-3.5 h-3.5", isSending && "animate-spin")} />
                  <span>{isSending ? "Disseminating..." : "Broadcast Immediate Alert"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
