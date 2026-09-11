export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface LocationData {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  riskLevel: RiskLevel;
  probability: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall24h: number;
}

export interface IMDStation {
  id: string;
  name: string;
  state: string;
  elevation: number; // meters
  coordinates: [number, number];
}

export interface IMDCurrentWeather {
  stationId: string;
  stationName: string;
  state: string;
  observationDate: string;
  observationTime: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainfall1h: number;
  rainfall24h: number;
  rainfallCategory: 'No Rain' | 'Light Rain' | 'Moderate Rain' | 'Heavy Rain' | 'Very Heavy Rain' | 'Extremely Heavy Rain';
  windDirection: string;
  windSpeed: number; // km/h
  weatherCode: number;
  weatherCondition: string;
  nebulosity: number; // 0-8 oktas
  pressure: number; // hPa
  dewPoint: number;
  advisory: {
    alertLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
    title: string;
    description: string;
    landslideRiskImplication: string;
  };
  metadata: {
    endpoint: string;
    status: 'LIVE_IMD_GATEWAY' | 'SIMULATED_STANDBY';
    message: string;
    lastSynced: string;
    apiKeyConfigured: boolean;
  };
}

export interface TrendData {
  time: string;
  rainfall: number;
  soilMoisture: number;
}

export interface Alert {
  id: string;
  title: string;
  severity: RiskLevel | 'INFO' | 'WARNING';
  time: string;
}

export interface IncidentReport {
  id: string;
  type: string;
  location: string;
  status: 'PENDING' | 'RESOLVED' | 'IN_PROGRESS';
  time: string;
}

export interface BhuvanRoadSegment {
  id: string;
  code: string;
  name: string;
  section: string;
  category: "NATIONAL_HIGHWAY" | "STATE_HIGHWAY" | "STRATEGIC_BORDER_ROAD" | "BYPASS" | "HILL_CORRIDOR";
  status: "OPEN" | "PARTIALLY_BLOCKED" | "BLOCKED" | "CRITICAL_HAZARD";
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  blockageReason?: string;
  alternativeRoute: string;
  alternativeDistanceKm: number;
  estimatedDelayMinutes: number;
  clearingProgressPercent: number;
  clearingAgency: string;
  affectedVillagesCount: number;
  affectedVillagesList: string[];
  vulnerabilityScore: number;
  bhuvanAssetId: string;
  elevationM: { min: number; max: number };
  coordinates: [number, number][];
  trafficFlowVehiclesPerHour: number;
  lastUpdated: string;
}

export interface BhuvanDetourResponse {
  routeId: string;
  origin: string;
  destination: string;
  status: "OPTIMAL" | "DETOUR_CALCULATED" | "CORRIDOR_RESTRICTED";
  recommendedPath: string[];
  totalDistanceKm: number;
  detourDistanceAddedKm: number;
  estimatedTransitTimeMinutes: number;
  safetyScore: number;
  avoidedBlockages: string[];
  turnByTurnAdvisories: string[];
  bhuvanRoutingVersion: string;
  timestamp: string;
}
