import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DigitalTwinState } from './types';

interface DigitalTwinContextProps {
  state: DigitalTwinState;
  updateState: (updates: Partial<DigitalTwinState>) => void;
  resetState: () => void;
}

const defaultState: DigitalTwinState = {
  timeOffset: 0,
  rainfallMultiplier: 1,
  soilMoistureMultiplier: 1,
  weatherMode: 'CLEAR',
  graphicsQuality: 'MEDIUM',
  isSimulationMode: false,
  activeScenario: 'NONE',
  simulationProgress: 0,
  selectedZone: null,
  selectedInfrastructure: null,
};

const DigitalTwinContext = createContext<DigitalTwinContextProps | undefined>(undefined);

export function DigitalTwinProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DigitalTwinState>(defaultState);

  const updateState = (updates: Partial<DigitalTwinState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(defaultState);
  };

  return (
    <DigitalTwinContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </DigitalTwinContext.Provider>
  );
}

export function useDigitalTwin() {
  const context = useContext(DigitalTwinContext);
  if (!context) {
    throw new Error('useDigitalTwin must be used within a DigitalTwinProvider');
  }
  return context;
}
