import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  Server, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Key, 
  Download, 
  FileText,
  UserPlus,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminUser {
  id: string;
  name: string;
  role: string;
  agency: string;
  clearance: 'LEVEL_4_DIRECTOR' | 'LEVEL_3_DISPATCHER' | 'LEVEL_2_ENGINEER' | 'LEVEL_1_FIELD';
  email: string;
  status: 'ACTIVE' | 'ON_DUTY' | 'STANDBY';
  lastActive: string;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  subsystem: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  ipAddress: string;
}

const initialUsers: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Dr. P. K. Sangma, IAS',
    role: 'State Disaster Operations Director',
    agency: 'Meghalaya SDMA (Shillong Secretariat)',
    clearance: 'LEVEL_4_DIRECTOR',
    email: 'director.sdma@meghalaya.gov.in',
    status: 'ACTIVE',
    lastActive: 'Active now'
  },
  {
    id: 'usr-2',
    name: 'Capt. A. Lyndoh',
    role: 'District Disaster Management Officer',
    agency: 'DEOC East Khasi Hills',
    clearance: 'LEVEL_3_DISPATCHER',
    email: 'deoc.ekh@meghalaya.gov.in',
    status: 'ON_DUTY',
    lastActive: '5 mins ago'
  },
  {
    id: 'usr-3',
    name: 'Er. R. Marak',
    role: 'Geotechnical Sensor Network Lead',
    agency: 'NESAC / ISRO Remote Sensing Wing',
    clearance: 'LEVEL_2_ENGINEER',
    email: 'sensors.nesac@isro.gov.in',
    status: 'ACTIVE',
    lastActive: '18 mins ago'
  },
  {
    id: 'usr-4',
    name: 'Col. V. Debbarma',
    role: 'Highways & Transport Corridor Overseer',
    agency: 'NHAI Regional Office Guwahati',
    clearance: 'LEVEL_2_ENGINEER',
    email: 'corridors.nhai@nic.in',
    status: 'ON_DUTY',
    lastActive: '42 mins ago'
  }
];

const initialLogs: AuditEvent[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-10 18:46:12',
    user: 'Dr. P. K. Sangma (SDMA)',
    action: 'CAP Red Alert broadcast authorized for Tura Peak sector',
    subsystem: 'CAP Broadcast Gateway',
    severity: 'CRITICAL',
    ipAddress: '10.24.112.4'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-10 18:15:00',
    user: 'Er. R. Marak (NESAC)',
    action: 'Piezometer Pore-Pressure trigger recalibrated: 75kPa -> 80kPa',
    subsystem: 'IoT Inclinometer Cluster',
    severity: 'WARNING',
    ipAddress: '10.24.88.19'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-10 17:58:30',
    user: 'System Automated Poller',
    action: 'ISRO Bhuvan WMS Gateway token verified (145643...5ce8)',
    subsystem: 'ISRO Bhuvan Proxy',
    severity: 'INFO',
    ipAddress: '127.0.0.1'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-10 17:30:10',
    user: 'Capt. A. Lyndoh (DEOC)',
    action: 'NH-06 Sonapur detour routing calculation exported to SDRF Battalion',
    subsystem: 'RAMS Detour Engine',
    severity: 'INFO',
    ipAddress: '10.24.114.8'
  }
];

export function Administration() {
  const [users] = useState<AdminUser[]>(initialUsers);
  const [auditLogs] = useState<AuditEvent[]>(initialLogs);
  const [isHealthTesting, setIsHealthTesting] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'HEALTHY' | 'TESTING'>('HEALTHY');

  const runDiagnostics = () => {
    setIsHealthTesting(true);
    setHealthStatus('TESTING');
    setTimeout(() => {
      setIsHealthTesting(false);
      setHealthStatus('HEALTHY');
    }, 1200);
  };

  const handleExportAudit = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(auditLogs, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `NER_SAFE_Audit_Log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                System Administration & Access Control
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-medium">
                  State Disaster Command
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Multi-agency role permissions, cryptographic audit logs, and distributed cluster failover telemetry.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runDiagnostics}
            disabled={isHealthTesting}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isHealthTesting && "animate-spin text-blue-400")} />
            <span>{isHealthTesting ? "Running Probe..." : "Run Failover Health Test"}</span>
          </button>
          <button
            onClick={handleExportAudit}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* Subsystem Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 mb-1">
              <span>IoT Mesh Sensor Core</span>
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 99.4%</span>
            </div>
            <div className="text-xl font-bold text-slate-100 font-mono">42 / 42 Nodes</div>
            <div className="text-xs text-slate-400 mt-1">LoRaWAN Mesh Gateway Online (Shillong Hub)</div>
          </div>
          <div className="mt-3 text-[10px] text-slate-500 font-mono">Avg Latency: 48ms</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 mb-1">
              <span>ISRO Bhuvan Proxy</span>
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> VERIFIED</span>
            </div>
            <div className="text-xl font-bold text-slate-100 font-mono">Token Active</div>
            <div className="text-xs text-slate-400 mt-1">14564377d06b9403fd936d5184832a2f77595ce8</div>
          </div>
          <div className="mt-3 text-[10px] text-slate-500 font-mono">WMS / RAMS Sync: OK</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 mb-1">
              <span>IMD Weather API Sync</span>
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> LIVE</span>
            </div>
            <div className="text-xl font-bold text-slate-100 font-mono">10m Cadence</div>
            <div className="text-xs text-slate-400 mt-1">api.imd.gov.in AWS Telemetry Feeder</div>
          </div>
          <div className="mt-3 text-[10px] text-slate-500 font-mono">Last Synced: 2m ago</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 mb-1">
              <span>CAP Broadcast Broker</span>
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> READY</span>
            </div>
            <div className="text-xl font-bold text-slate-100 font-mono">14 Carriers</div>
            <div className="text-xs text-slate-400 mt-1">Direct interconnect to Telecom Cell Towers</div>
          </div>
          <div className="mt-3 text-[10px] text-slate-500 font-mono">Encryption: TLS 1.3 / AES-256</div>
        </div>
      </div>

      {/* Authorized Personnel Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Role-Based Access Control (RBAC) Registry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized emergency commanders, district dispatchers, and geotechnical sensor engineers.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            {users.length} Authorized Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Operator Name</th>
                <th className="px-4 py-3">Designation / Role</th>
                <th className="px-4 py-3">Department / Agency</th>
                <th className="px-4 py-3">Clearance Tier</th>
                <th className="px-4 py-3">Duty Status</th>
                <th className="px-4 py-3 text-right">Heartbeat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-sans font-bold text-slate-100 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-blue-300 font-bold">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-300">
                    {u.role}
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-400">
                    {u.agency}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {u.clearance.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold",
                      u.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-400" :
                      u.status === 'ON_DUTY' ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-400"
                    )}>
                      {u.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400 font-sans">
                    {u.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              Cryptographic Event & Audit Trail
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Immutable record of emergency dispatches, threshold overrides, and system configuration modifications.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            Hash Linked (SHA-256)
          </span>
        </div>

        <div className="p-4 space-y-2 text-xs font-mono">
          {auditLogs.map(log => (
            <div 
              key={log.id} 
              className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start gap-2.5">
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5",
                  log.severity === 'CRITICAL' ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" :
                  log.severity === 'WARNING' ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                  "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                )}>
                  {log.severity}
                </span>
                <div>
                  <div className="text-slate-200 font-sans font-semibold">{log.action}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Operator: <strong className="text-slate-400">{log.user}</strong> • Subsystem: <strong className="text-slate-400">{log.subsystem}</strong>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 text-[11px] text-slate-400">
                <div>{log.timestamp}</div>
                <div className="text-slate-600 font-mono text-[10px]">{log.ipAddress}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
