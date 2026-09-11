import { LocationData, TrendData, Alert, IncidentReport } from '../types';

export const mockLocations: LocationData[] = [
  { id: 'l1', name: 'Nongthymmai', district: 'East Khasi Hills', coordinates: [25.5788, 91.8933], riskLevel: 'HIGH', probability: 82.5 },
  { id: 'l2', name: 'Tura Peak', district: 'West Garo Hills', coordinates: [25.5134, 90.2312], riskLevel: 'CRITICAL', probability: 94.2 },
  { id: 'l3', name: 'Jowai Bypass', district: 'West Jaintia Hills', coordinates: [25.4485, 92.2009], riskLevel: 'MEDIUM', probability: 45.0 },
  { id: 'l4', name: 'Cherrapunji (Sohra)', district: 'East Khasi Hills', coordinates: [25.2702, 91.7323], riskLevel: 'HIGH', probability: 78.1 },
  { id: 'l5', name: 'Umiam Slope', district: 'Ri Bhoi', coordinates: [25.6667, 91.8833], riskLevel: 'LOW', probability: 12.4 },
];

export const mockTrendData: TrendData[] = [
  { time: '00:00', rainfall: 12, soilMoisture: 45 },
  { time: '04:00', rainfall: 25, soilMoisture: 52 },
  { time: '08:00', rainfall: 65, soilMoisture: 68 },
  { time: '12:00', rainfall: 42, soilMoisture: 75 },
  { time: '16:00', rainfall: 18, soilMoisture: 82 },
  { time: '20:00', rainfall: 90, soilMoisture: 89 },
  { time: '24:00', rainfall: 110, soilMoisture: 95 },
];

export const mockAlerts: Alert[] = [
  { id: 'a1', title: 'Severe rainfall expected in West Garo Hills (next 24hrs)', severity: 'CRITICAL', time: '10 mins ago' },
  { id: 'a2', title: 'Soil moisture threshold exceeded at Tura Peak sensor', severity: 'HIGH', time: '1 hour ago' },
  { id: 'a3', title: 'Routine sensor maintenance scheduled for Ri Bhoi', severity: 'INFO', time: '5 hours ago' },
];

export const mockIncidents: IncidentReport[] = [
  { id: 'i1', type: 'Minor Rockfall', location: 'NH-06 Near Sonapur', status: 'IN_PROGRESS', time: '2 hours ago' },
  { id: 'i2', type: 'Road Blockage', location: 'Shillong Bypass', status: 'PENDING', time: '4 hours ago' },
];
