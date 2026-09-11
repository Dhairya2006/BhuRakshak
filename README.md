# NER-SAFE

**North Eastern Region Landslide & Disaster Early Warning System**

NER-SAFE is an AI-powered early-warning and disaster-management decision-support platform designed specifically for the fragile terrain of India's North Eastern Region. It aggregates environmental telemetry (rainfall, soil moisture), terrain topology, and machine learning models to forecast landslide risks and help authorities prioritize emergency response.

## Features

- **Live Risk Map:** Interactive GIS map overlaying real-time risk scores with critical infrastructure.
- **AI Prediction Engine:** ML-driven risk forecasting based on cumulative rainfall, slope, and soil saturation (Simulated in demo mode).
- **Executive Command Center:** Comprehensive overview dashboard with key performance indicators and a 24-hour risk forecast.
- **Field Reporting:** Offline-capable incident reporting for field personnel and citizens, complete with AI image analysis (simulated).
- **Emergency Response Queue:** Algorithmic prioritization of incidents based on severity, population density, and cascading risk factors.
- **Simulation Mode:** Built-in "Extreme Rainfall Event" demo scenario to demonstrate system behavior during a crisis without requiring live data feeds.

## Architecture

NER-SAFE is built as a modern, full-stack web application:

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Recharts, React-Leaflet
- **Backend:** Node.js, Express (Mock API mode for demonstration)
- **Offline & PWA:** Vite PWA, IndexedDB (idb-keyval) for disconnected operation and sync.
- **i18n:** Multi-language support (English, Hindi, Assamese).

## Getting Started

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (Frontend + Backend):
   ```bash
   npm run dev
   ```

3. The application will be available at `http://localhost:3000`.

### Production Build

1. Build the frontend and backend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Configuration

The application degrades gracefully to simulation modes when live data feeds are unavailable. See `.env.example` for optional integrations:

- `GEMINI_API_KEY`: For backend AI services (if deployed).
- `VITE_BHUVAN_API_KEY`: (Placeholder) For ISRO satellite map tile integration.
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: (Placeholder) For persistent field reporting instead of local IndexedDB.

## Disclaimers

**This is a decision-support system.** All ML predictions are explicitly labeled as *AI-generated risk estimates* and must not be used as guaranteed predictions. Human expert verification is strictly required before issuing evacuation orders or committing emergency resources.
