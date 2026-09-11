import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  Bell, 
  Key, 
  Volume2, 
  Languages, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Smartphone,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export function Settings() {
  const { i18n } = useTranslation();

  // Threshold States
  const [rainfallThreshold, setRainfallThreshold] = useState(120);
  const [soilMoistureThreshold, setSoilMoistureThreshold] = useState(85);
  const [slopeAngleLimit, setSlopeAngleLimit] = useState(35);
  const [insarVelocityLimit, setInsarVelocityLimit] = useState(15);

  // Integration States
  const [bhuvanKey, setBhuvanKey] = useState('14564377d06b9403fd936d5184832a2f77595ce8');
  const [imdEndpoint, setImdEndpoint] = useState('https://api.imd.gov.in/api/v1/current_wx');
  const [capBrokerUrl, setCapBrokerUrl] = useState('https://cap.ndma.gov.in/api/v2/broadcast');

  // Preferences
  const [sirenEnabled, setSirenEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('30');
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(lang);
    }
  };

  const testAudioAlarm = () => {
    setSirenPlaying(true);
    // Beep synthesizer using Web Audio API safely
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio test triggered');
    }
    setTimeout(() => setSirenPlaying(false), 800);
  };

  const handleReset = () => {
    setRainfallThreshold(120);
    setSoilMoistureThreshold(85);
    setSlopeAngleLimit(35);
    setInsarVelocityLimit(15);
    setSirenEnabled(true);
    setPushNotifications(true);
    setAutoRefreshInterval('30');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                System Settings & Early Warning Parameters
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono font-medium">
                  NER-SAFE Config v1.0
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Configure geotechnical alarm thresholds, sensor triggers, Bhuvan API integration, and emergency notification settings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Saved Toast Banner */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="font-bold text-xs">Configuration Successfully Updated</div>
              <div className="text-[11px] text-emerald-400/80">Early warning triggering thresholds updated across all active monitoring sectors.</div>
            </div>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="text-emerald-400 text-xs font-bold">✕</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Geotechnical Early Warning Thresholds */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-rose-400" />
            <span>Automated Landslide Risk Triggering Thresholds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* 24h Cumulative Rainfall */}
            <div className="space-y-2 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-300">24-Hour Cumulative Rainfall Trigger</span>
                <span className="font-mono text-base font-bold text-blue-400">{rainfallThreshold} mm</span>
              </div>
              <input
                type="range"
                min="60"
                max="250"
                step="5"
                value={rainfallThreshold}
                onChange={(e) => setRainfallThreshold(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Precipitation depth exceeding this within 24 hours triggers automatic Orange/Red warnings for hill slopes.
              </p>
            </div>

            {/* Soil Moisture Saturation */}
            <div className="space-y-2 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-300">Soil Pore Saturation Critical Limit</span>
                <span className="font-mono text-base font-bold text-cyan-400">{soilMoistureThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                step="1"
                value={soilMoistureThreshold}
                onChange={(e) => setSoilMoistureThreshold(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Moisture level at which soil shear strength degrades rapidly, triggering imminent slope failure alert.
              </p>
            </div>

            {/* Slope Gradient Angle */}
            <div className="space-y-2 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-300">Critical Slope Angle Threshold</span>
                <span className="font-mono text-base font-bold text-amber-400">{slopeAngleLimit}°</span>
              </div>
              <input
                type="range"
                min="20"
                max="55"
                step="1"
                value={slopeAngleLimit}
                onChange={(e) => setSlopeAngleLimit(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Slopes steeper than this angle are flagged for immediate priority inspection during heavy precipitation.
              </p>
            </div>

            {/* InSAR Creep Velocity */}
            <div className="space-y-2 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-300">InSAR Surface Displacement Velocity</span>
                <span className="font-mono text-base font-bold text-rose-400">{insarVelocityLimit} mm/yr</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={insarVelocityLimit}
                onChange={(e) => setInsarVelocityLimit(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Interferometric radar ground displacement velocity cutoff indicating continuous creep before failure.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: External APIs & Credentials */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
            <Key className="w-4 h-4 text-orange-400" />
            <span>Government & Satellite Integrations</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                ISRO Bhuvan Satellite & RAMS Access Key / Token
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={bhuvanKey}
                  onChange={(e) => setBhuvanKey(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-blue-300 focus:outline-none focus:border-orange-500"
                />
                <span className="px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold text-[11px] shrink-0">
                  Authenticated
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Authorizes access to NRSC Cartosat-2S WMS imagery, NHAI road network vectors, and Bhuvan routing API.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-400 font-medium mb-1">IMD Meteorological API Endpoint</label>
                <input
                  type="text"
                  value={imdEndpoint}
                  onChange={(e) => setImdEndpoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">NDMA CAP Broadcast Gateway URL</label>
                <input
                  type="text"
                  value={capBrokerUrl}
                  onChange={(e) => setCapBrokerUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: User Preferences & Sirens */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Alert Preferences & Notification Controls</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-rose-400" />
                  Emergency Siren Sound Alarm
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Audible warning on critical Red alerts in operations center</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={testAudioAlarm}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-semibold transition-colors"
                >
                  {sirenPlaying ? "Beeping..." : "Test Beep"}
                </button>
                <input
                  type="checkbox"
                  checked={sirenEnabled}
                  onChange={(e) => setSirenEnabled(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-rose-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-blue-400" />
                  System Operations Language
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Primary language for dashboard & emergency dispatches</div>
              </div>
              <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="en">English</option>
                <option value="kha">Khasi (Khasian)</option>
                <option value="gar">Garo (A·chik)</option>
                <option value="as">Assamese</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Browser Push Notifications
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Notify when critical slope sensors trigger while tab is inactive</div>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-rose-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-400" />
                  Sensor Telemetry Auto-Poll Rate
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Interval for querying IoT gateway & IMD stations</div>
              </div>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="15">15 Seconds (Rapid Watch)</option>
                <option value="30">30 Seconds (Default)</option>
                <option value="60">1 Minute</option>
                <option value="300">5 Minutes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-rose-900/30"
          >
            <Save className="w-4 h-4" />
            <span>Apply & Save All Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
