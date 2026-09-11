/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { AIPrediction } from './pages/AIPrediction';
import { ModelMetricsPage } from './pages/ModelMetrics';
import { LiveRiskMap } from './pages/LiveRiskMap';
import { Weather } from './pages/Weather';
import { SoilSensors } from './pages/SoilSensors';
import { Roads } from './pages/Roads';
import { FieldReporting } from './pages/FieldReporting';
import { IncidentReports } from './pages/IncidentReports';
import { EmergencyResponse } from './pages/EmergencyResponse';
import { DataSources } from './pages/DataSources';
import { Analytics } from './pages/Analytics';
import { ModelDashboard } from './pages/ModelDashboard';
import { LandslideZones } from './pages/LandslideZones';
import { RemoteSensing } from './pages/RemoteSensing';
import { AlertsNotifications } from './pages/AlertsNotifications';
import { Administration } from './pages/Administration';
import { Settings } from './pages/Settings';
import { AppProvider } from './context/AppContext';
import { AlertTriangle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

import { SimulationProvider } from './context/SimulationContext';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
      <AlertTriangle className="w-12 h-12 mb-4 text-amber-500" />
      <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm text-center">The requested disaster monitoring route does not exist.</p>
      <Link 
        to="/" 
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Disaster Overview</span>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SimulationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="map" element={<LiveRiskMap />} />
              <Route path="ai-prediction" element={<AIPrediction />} />
              <Route path="zones" element={<LandslideZones />} />
              <Route path="weather" element={<Weather />} />
              <Route path="soil" element={<SoilSensors />} />
              <Route path="satellite" element={<RemoteSensing />} />
              <Route path="roads" element={<Roads />} />
              <Route path="incidents" element={<IncidentReports />} />
              <Route path="reporting" element={<FieldReporting />} />
              <Route path="emergency" element={<EmergencyResponse />} />
              <Route path="alerts" element={<AlertsNotifications />} />
              <Route path="history" element={<Analytics />} />
              <Route path="model-metrics" element={<ModelDashboard />} />
              <Route path="data" element={<DataSources />} />
              <Route path="admin" element={<Administration />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </SimulationProvider>
    </AppProvider>
  );
}
