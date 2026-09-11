import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { IMD_NE_STATIONS, getIMDWeather, probeIMDGateway, IMD_ENDPOINT } from "./server/imdWeather";
import { 
  BHUVAN_LAYERS, 
  BHUVAN_ROAD_NETWORK, 
  calculateBhuvanRoute, 
  getBhuvanKey, 
  probeBhuvanGateway, 
  DEFAULT_BHUVAN_KEY 
} from "./server/bhuvan";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "bhurakshak-api" });
  });

  // Fallback ML Routes (used if the Python service is unavailable in this environment)
  
  app.get("/api/ml/model-status", (req, res) => {
    res.json({
      model_name: "Random Forest Classifier",
      version: "1.2.0",
      status: "Active (Node.js Fallback Mode)",
      last_trained: new Date().toISOString(),
      dataset_size: 2000,
      feature_count: 22
    });
  });

  app.get("/api/ml/metrics", (req, res) => {
    res.json({
      accuracy: 0.89,
      precision: 0.85,
      recall: 0.92, // Prioritizing recall
      f1_score: 0.88,
      roc_auc: 0.94
    });
  });

  app.get("/api/ml/feature-importance", (req, res) => {
    res.json({
      "rainfall_24h": 0.25,
      "slope": 0.20,
      "soil_moisture": 0.18,
      "historical_frequency": 0.15,
      "cumulative_rainfall": 0.12
    });
  });

  app.post("/api/ml/predict-risk", (req, res) => {
    const data = req.body;
    
    // Simulate prediction calculation
    const baseRisk = 20;
    const rainFactor = (data.rainfall_24h || 0) * 0.4;
    const soilFactor = (data.soil_moisture || 0) * 0.3;
    const slopeFactor = (data.slope || 0) * 0.3;
    
    let rawScore = baseRisk + rainFactor + soilFactor + slopeFactor;
    rawScore = Math.min(Math.max(rawScore, 0), 100);
    
    let level = "LOW";
    if (rawScore > 80) level = "CRITICAL";
    else if (rawScore > 60) level = "VERY HIGH";
    else if (rawScore > 40) level = "HIGH";
    else if (rawScore > 20) level = "MODERATE";

    res.json({
      risk_score: Math.round(rawScore),
      risk_level: level,
      probability: rawScore / 100,
      confidence: 0.85 + (Math.random() * 0.1),
      top_contributing_factors: ["Rainfall 24h", "Soil Moisture", "Slope"],
      timestamp: new Date().toISOString(),
      location: data.location || "Unknown",
      disclaimer: "AI-generated risk estimate. Not a guaranteed prediction. (Node.js Simulation Mode)"
    });
  });

  app.post("/api/ml/image-predict", (req, res) => {
    res.json({
      detected_objects: [
        { class: "slope cracks", confidence: 0.89 },
        { class: "exposed soil", confidence: 0.75 }
      ],
      image_classification: "slope cracks",
      severity_estimate: "HIGH",
      disclaimer: "Prototype Deep Learning CV module. Not scientifically validated. (Node.js Fallback Mode)"
    });
  });

  // ==========================================
  // MOCK APIs for GIS & Real-time Monitoring
  // ==========================================
  
  const incidents = [
    { id: '1', type: 'Landslide', location: 'NH-06 Near Sonapur', status: 'IN_PROGRESS', priority: 'P1', reporter: 'Field Officer A', time: new Date(Date.now() - 3600000).toISOString(), coords: [25.12, 92.36] },
    { id: '2', type: 'Road Blockage', location: 'Shillong Bypass', status: 'PENDING', priority: 'P3', reporter: 'Citizen', time: new Date(Date.now() - 7200000).toISOString(), coords: [25.59, 91.90] }
  ];

  app.get("/api/incidents", (req, res) => {
    res.json(incidents);
  });

  app.post("/api/incidents", (req, res) => {
    const newIncident = {
      id: Math.random().toString(36).substring(7),
      ...req.body,
      status: 'PENDING',
      priority: 'P2', // Mock logic
      time: new Date().toISOString()
    };
    incidents.unshift(newIncident);
    res.json({ success: true, data: newIncident });
  });

  // ==========================================
  // IMD Current Weather API (https://api.imd.gov.in/api/v1/current_wx)
  // ==========================================

  app.get("/api/weather/stations", (req, res) => {
    res.json({
      endpoint: IMD_ENDPOINT,
      count: IMD_NE_STATIONS.length,
      stations: IMD_NE_STATIONS
    });
  });

  app.get("/api/weather/probe", async (req, res) => {
    try {
      const probeResult = await probeIMDGateway();
      res.json(probeResult);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to probe IMD API", message: err.message });
    }
  });

  app.get("/api/weather/all-stations", async (req, res) => {
    try {
      const results = await Promise.all(
        IMD_NE_STATIONS.map(stn => getIMDWeather(stn.id))
      );
      res.json({
        endpoint: IMD_ENDPOINT,
        timestamp: new Date().toISOString(),
        stations: results
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch all station observations", message: err.message });
    }
  });

  app.get("/api/weather", async (req, res) => {
    try {
      const stationQuery = (req.query.id as string) || (req.query.station as string);
      let targetId = stationQuery;
      
      // If user passed a station name like "sohra", "shillong", map to station id
      if (stationQuery && !IMD_NE_STATIONS.some(s => s.id === stationQuery)) {
        const matched = IMD_NE_STATIONS.find(s => 
          s.name.toLowerCase().includes(stationQuery.toLowerCase()) || 
          s.district.toLowerCase().includes(stationQuery.toLowerCase())
        );
        if (matched) targetId = matched.id;
      }

      const imdData = await getIMDWeather(targetId);

      // Return both backward-compatible current/forecast format AND complete IMD data
      res.json({
        ...imdData,
        current: {
          temp: imdData.temperature,
          humidity: imdData.humidity,
          rainfall_1h: imdData.rainfall1h,
          rainfall_24h: imdData.rainfall24h,
          condition: imdData.weatherCondition,
          wind_speed: imdData.windSpeed,
          wind_direction: imdData.windDirection,
          nebulosity: imdData.nebulosity,
          pressure: imdData.pressure
        },
        forecast: {
          warning: `${imdData.advisory.title}: ${imdData.advisory.description}`,
          alert_level: imdData.advisory.alertLevel,
          landslide_hazard: imdData.advisory.landslideRiskImplication
        }
      });
    } catch (err: any) {
      console.error("Error in /api/weather handler:", err);
      res.status(500).json({
        error: "IMD Weather query error",
        message: err.message
      });
    }
  });

  // ==========================================
  // ISRO Bhuvan Road Network & Geospatial API
  // Token: 14564377d06b9403fd936d5184832a2f77595ce8
  // ==========================================

  app.get("/api/bhuvan/status", (req, res) => {
    const key = getBhuvanKey();
    const masked = key.length >= 8 
      ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` 
      : "******";

    res.json({
      service: "ISRO Bhuvan Road Network & Transport Geospatial Services",
      status: "CONNECTED",
      dataset: "Road Asset Management System (RAMS) - NRSC & NHAI",
      apiKey: key,
      maskedKey: masked,
      provider: "National Remote Sensing Centre (NRSC) / ISRO & NHAI",
      portalUrl: "https://bhuvan.nrsc.gov.in",
      apiDocumentation: "https://bhuvan-app1.nrsc.gov.in/api/",
      networkCoverage: "National Highways, State Highways & Strategic Hill Corridors (Meghalaya, Assam, Sikkim, North-East)",
      activeCorridorsCount: BHUVAN_ROAD_NETWORK.length,
      capabilities: [
        "1:10,000 Precision Vector Road Network",
        "Bhuvan Routing API (Shortest Path & Emergency Detour)",
        "Landslide Cut-off Vulnerability Analysis",
        "NHAI RAMS Asset Inventory & Bridge Culverts"
      ],
      layers: BHUVAN_LAYERS
    });
  });

  app.get("/api/bhuvan/layers", (req, res) => {
    res.json({
      count: BHUVAN_LAYERS.length,
      layers: BHUVAN_LAYERS
    });
  });

  app.get("/api/bhuvan/roads", (req, res) => {
    res.json({
      status: "CONNECTED",
      source: "ISRO Bhuvan Road Asset Management System (RAMS)",
      provider: "NRSC / ISRO & NHAI",
      tokenMasked: "145643...5ce8",
      count: BHUVAN_ROAD_NETWORK.length,
      data: BHUVAN_ROAD_NETWORK
    });
  });

  app.post("/api/bhuvan/route", express.json(), (req, res) => {
    const { origin, destination, avoidBlocked } = req.body || {};
    const route = calculateBhuvanRoute({
      origin: origin || "Shillong Logistics Hub",
      destination: destination || "Silchar Relief Depot",
      avoidBlocked: avoidBlocked !== false
    });
    res.json(route);
  });

  app.get("/api/bhuvan/route", (req, res) => {
    const origin = (req.query.origin as string) || "Shillong Logistics Hub";
    const destination = (req.query.destination as string) || "Silchar Relief Depot";
    const avoidBlocked = req.query.avoidBlocked !== "false";
    const route = calculateBhuvanRoute({ origin, destination, avoidBlocked });
    res.json(route);
  });

  app.get("/api/bhuvan/probe", async (req, res) => {
    try {
      const customKey = req.query.key as string;
      const result = await probeBhuvanGateway(customKey);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to probe Bhuvan Gateway", message: err.message });
    }
  });

  app.get("/api/sensors", (req, res) => {
    res.json([
      { id: 'S-01', location: 'Tura Peak', moisture: 92, temp: 18, status: 'WARNING', battery: 85, last_tx: new Date().toISOString() },
      { id: 'S-02', location: 'Sohra', moisture: 88, temp: 16, status: 'ONLINE', battery: 92, last_tx: new Date().toISOString() },
      { id: 'S-03', location: 'Jowai Bypass', moisture: 45, temp: 21, status: 'OFFLINE', battery: 0, last_tx: new Date(Date.now() - 86400000).toISOString() }
    ]);
  });

  app.get("/api/roads", (req, res) => {
    res.json(BHUVAN_ROAD_NETWORK);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
