import React, { useState } from 'react';
import { Camera, MapPin, Send, AlertCircle, WifiOff, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { set } from 'idb-keyval';
import { supabase } from '../lib/supabase';

export function FieldReporting() {
  const { isOnline } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [form, setForm] = useState({ type: 'Landslide', location: '', description: '' });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    // Mock the image analysis call
    try {
      const res = await fetch('/api/ml/image-predict', { method: 'POST', body: new FormData() });
      const data = await res.json();
      setAiResult(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);
    
    const payload = {
      type: form.type,
      location: form.location,
      description: form.description,
      ai_analysis: aiResult ? JSON.stringify(aiResult) : null,
      status: 'PENDING',
      priority: 'P2', // Default priority for field reports
    };

    try {
      if (isOnline) {
        const { error } = await supabase
          .from('incidents')
          .insert([payload]);

        if (error) throw error;
        
        setStatusMessage({ type: 'success', text: 'Report submitted successfully to the incidents database.' });
      } else {
        const id = 'incident_' + Date.now();
        await set(id, payload);
        setStatusMessage({ type: 'success', text: 'Saved offline. Will sync when connection returns.' });
      }
      setForm({ type: 'Landslide', location: '', description: '' });
      setPhotoPreview(null);
      setAiResult(null);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to submit report. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
            <Camera className="text-emerald-400" />
            Field Reporting
          </h1>
          <p className="text-sm text-slate-400 mt-1">Submit geolocated incident reports.</p>
        </div>
        {!isOnline && (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 text-sm">
            <WifiOff className="w-4 h-4" /> Offline Mode (Queueing)
          </div>
        )}
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-lg flex items-start gap-3 border ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
          <div className="text-sm font-medium pt-0.5">{statusMessage.text}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-slate-800/20 space-y-5">
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Incident Type</label>
          <select 
            value={form.type} onChange={e => setForm({...form, type: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option>Landslide</option>
            <option>Slope Crack</option>
            <option>Road Blockage</option>
            <option>Flooding</option>
            <option>Rockfall</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Location / Landmarks</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input 
                required type="text" placeholder="e.g. NH-40 near Umiam"
                value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if ('geolocation' in navigator) {
                  setForm(prev => ({ ...prev, location: 'Getting location...' }));
                  navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                      // Using OpenStreetMap Nominatim for free reverse geocoding
                      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                      const data = await res.json();
                      const address = data.address;
                      const placeName = address.village || address.town || address.city || address.county || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                      const state = address.state || '';
                      setForm(prev => ({ ...prev, location: `${placeName}${state ? ', ' + state : ''}` }));
                    } catch (error) {
                      console.error('Geocoding failed:', error);
                      setForm(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                    }
                  }, (error) => {
                    console.error('Geolocation error:', error.message || error);
                    setForm(prev => ({ ...prev, location: `Location access denied: ${error.message}` }));
                  });
                }
              }}
              className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              Get GPS
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea 
            required rows={3} placeholder="Describe the severity and impact..."
            value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Photo Evidence</label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-900/50 hover:bg-slate-800/50 transition-colors relative overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-6 h-6 mb-2 text-slate-500" />
                <p className="text-sm text-slate-400">Click to upload or capture photo</p>
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoSelect} />
          </label>
        </div>

        {aiResult && (
          <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> Deep Learning Pre-Analysis
            </h4>
            <div className="text-sm text-slate-200 mb-1">
              Detected: <span className="font-semibold">{aiResult.image_classification}</span>
            </div>
            <div className="text-xs text-slate-400 italic">
              {aiResult.disclaimer} HUMAN VERIFICATION REQUIRED.
            </div>
          </div>
        )}

        <button 
          type="submit" disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : <><Send className="w-4 h-4" /> Submit Report</>}
        </button>

      </form>
    </div>
  );
}
