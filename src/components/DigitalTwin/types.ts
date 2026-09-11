export interface DigitalTwinState {
  timeOffset: number;
  rainfallMultiplier: number;
  soilMoistureMultiplier: number;
  weatherMode: 'CLEAR' | 'CLOUDY' | 'HEAVY RAIN' | 'EXTREME RAIN';
  graphicsQuality: 'LOW' | 'MEDIUM' | 'HIGH';
  isSimulationMode: boolean;
  activeScenario: 'NONE' | 'EXTREME_MONSOON' | 'LANDSLIDE_EVENT';
  simulationProgress: number; // 0 to 100
  selectedZone: string | null;
  selectedInfrastructure: string | null;
}

export interface TerrainZone {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  baseRisk: number;
  rainfallVulnerability: number;
  soilMoistureVulnerability: number;
  slope: number;
  elevation: number;
  historicalLandslides: number;
}

export interface Village {
  id: string;
  name: string;
  population: number;
  coordinates: [number, number];
  connectingRoadId: string;
  nearestHospitalId: string;
}

export interface Road {
  id: string;
  name: string;
  type: 'NH' | 'SH' | 'LOCAL';
  path: [number, number][]; // rough coordinates mapping to terrain
  baseVulnerability: number;
}

export interface InfrastructureItem {
  id: string;
  type: 'HOSPITAL' | 'SCHOOL' | 'EMERGENCY_CENTER' | 'TOWER' | 'BRIDGE';
  name: string;
  coordinates: [number, number];
}

export interface SensorData {
  id: string;
  type: 'SOIL' | 'RAIN' | 'SLOPE';
  name: string;
  coordinates: [number, number];
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  lastReading: number;
  unit: string;
}
