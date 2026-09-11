import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SimulationContextType {
  isSimulating: boolean;
  progress: number;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  
  // Derived state for the scenario
  rainfall: number;
  soilMoisture: number;
  riskScore: number;
  criticalZonesCount: number;
  blockedRoadsCount: number;
  activeAlerts: any[];
  incidents: any[];
}

const SimulationContext = createContext<SimulationContextType>({} as SimulationContextType);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [liveIncidents, setLiveIncidents] = useState<any[]>([]);

  useEffect(() => {
    // Fetch live incidents from Supabase on mount and set up subscription if needed
    const fetchIncidents = async () => {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (data && !error) {
          setLiveIncidents(data);
        }
      } catch (err) {
        console.error('Error fetching live incidents:', err);
      }
    };

    fetchIncidents();
    // Poll every 10 seconds for new incidents
    const pollInterval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    let interval: number;
    if (isSimulating && progress < 100) {
      interval = window.setInterval(() => {
        setProgress(p => Math.min(p + 1, 100)); // 1% every second
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, progress]);

  const startSimulation = () => setIsSimulating(true);
  const pauseSimulation = () => setIsSimulating(false);
  const resetSimulation = () => {
    setIsSimulating(false);
    setProgress(0);
  };

  // Derive metrics based on simulation progress (Extreme Rainfall Event)
  const rainfall = 12 + (progress * 1.5); // Starts at 12mm, goes up to 162mm
  const soilMoisture = Math.min(45 + (progress * 0.6), 98); // Starts at 45%, maxes at 98%
  
  // ML Risk Score spikes non-linearly as moisture hits saturation (>85%)
  const riskScore = progress < 40 
    ? 25 + (progress * 0.5) 
    : progress < 70 
      ? 45 + ((progress - 40) * 1.5)
      : 90 + ((progress - 70) * 0.3);

  const criticalZonesCount = progress > 80 ? 4 : progress > 50 ? 2 : progress > 20 ? 1 : 0;
  const blockedRoadsCount = progress > 70 ? 3 : progress > 40 ? 1 : 0;

  const activeAlerts = [];
  if (progress > 10) activeAlerts.push({ level: 'ADVISORY', msg: 'Intense rainfall detected in East Khasi Hills.' });
  if (progress > 40) activeAlerts.push({ level: 'WARNING', msg: 'Soil moisture approaching saturation point.' });
  if (progress > 60) activeAlerts.push({ level: 'SEVERE', msg: 'Risk scores exceed threshold. Landslide probability high.' });
  if (progress > 80) activeAlerts.push({ level: 'CRITICAL', msg: 'Multiple road blockages reported. Immediate evacuation recommended.' });

  // Merge live incidents with simulated ones
  const incidents = [...liveIncidents];
  
  if (progress > 40) incidents.push({ id: 'sim-2', priority: 'P2', type: 'Slope Crack', location: 'Shillong Bypass', created_at: new Date().toISOString(), status: 'PENDING' });
  if (progress > 70) incidents.push({ id: 'sim-3', priority: 'P1', type: 'Rockfall', location: 'Tura-Dalu Road', created_at: new Date().toISOString(), status: 'PENDING' });

  return (
    <SimulationContext.Provider value={{
      isSimulating, progress, startSimulation, pauseSimulation, resetSimulation,
      rainfall, soilMoisture, riskScore, criticalZonesCount, blockedRoadsCount,
      activeAlerts, incidents
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export const useSimulation = () => useContext(SimulationContext);
