import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, Clock, MapPin, RefreshCw } from 'lucide-react';

export function IncidentReports() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setIncidents(data || []);
    } catch (err: any) {
      console.error('Error fetching incidents:', err);
      setError(err.message || 'Failed to fetch incident reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-[calc(100vh-7.5rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
            <AlertCircle className="text-amber-400" />
            Incident Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1">Review and manage field-reported incidents.</p>
        </div>
        <button
          onClick={fetchIncidents}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="glass-panel border border-slate-700/50 rounded-xl overflow-hidden flex flex-col flex-1 bg-slate-900/50">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-800/80 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Date/Time</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Type</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Location</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Description</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Priority</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 overflow-y-auto">
              {loading && incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading incidents...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-rose-400">{error}</td>
                </tr>
              ) : incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No incident reports found.</td>
                </tr>
              ) : (
                incidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(incident.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-200 font-medium">
                      {incident.type}
                    </td>
                    <td className="p-4 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[200px] inline-block" title={incident.location}>{incident.location}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      <span className="line-clamp-2" title={incident.description}>{incident.description}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                        incident.priority === 'P1' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        incident.priority === 'P2' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {incident.priority || 'P2'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        incident.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        incident.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        incident.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {incident.status || 'UNKNOWN'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
