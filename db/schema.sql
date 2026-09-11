-- NER-SAFE Initial Database Schema
-- Designed for Supabase / PostgreSQL

-- Enable PostGIS for geospatial features
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- USERS (Extending Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY, -- Maps to auth.users
    role_id UUID REFERENCES roles(id),
    full_name VARCHAR(100),
    organization VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISTRICTS
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Meghalaya',
    boundary GEOMETRY(POLYGON, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LOCATIONS (Villages / Towns)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID REFERENCES districts(id),
    name VARCHAR(100) NOT NULL,
    coordinates GEOMETRY(POINT, 4326),
    population INT,
    vulnerability_score FLOAT, -- Pre-calculated baseline
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RISK ZONES (Polygons of known vulnerable areas)
CREATE TABLE risk_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100),
    district_id UUID REFERENCES districts(id),
    zone_polygon GEOMETRY(POLYGON, 4326),
    baseline_risk_level VARCHAR(20) CHECK (baseline_risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SENSORS / DATA SOURCES
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_type VARCHAR(50) CHECK (source_type IN ('AWS', 'SOIL_MOISTURE', 'SATELLITE', 'MANUAL')),
    name VARCHAR(100),
    location GEOMETRY(POINT, 4326),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WEATHER DATA
CREATE TABLE weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES data_sources(id),
    temperature FLOAT,
    humidity FLOAT,
    pressure FLOAT,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RAINFALL DATA
CREATE TABLE rainfall_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES data_sources(id),
    rainfall_mm FLOAT NOT NULL,
    duration_hours INT,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SOIL MOISTURE
CREATE TABLE soil_moisture (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES data_sources(id),
    moisture_level FLOAT NOT NULL, -- Percentage
    depth_cm FLOAT,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI MODEL METRICS
CREATE TABLE model_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_version VARCHAR(50),
    accuracy FLOAT,
    f1_score FLOAT,
    last_trained_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RISK PREDICTIONS (Output from AI Model)
CREATE TABLE model_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id),
    zone_id UUID REFERENCES risk_zones(id),
    predicted_risk VARCHAR(20) CHECK (predicted_risk IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    probability FLOAT NOT NULL,
    features_used JSONB, -- The input features that led to this prediction
    prediction_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_anomaly BOOLEAN DEFAULT FALSE,
    ai_disclaimer TEXT DEFAULT 'AI-generated risk estimate. Not a guaranteed prediction.'
);

-- HISTORICAL LANDSLIDES
CREATE TABLE historical_landslides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location GEOMETRY(POINT, 4326),
    event_date DATE,
    severity VARCHAR(20),
    trigger_factor VARCHAR(50),
    damage_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INCIDENT & FIELD REPORTS
CREATE TABLE incident_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reported_by UUID REFERENCES users(id),
    location GEOMETRY(POINT, 4326),
    district_id UUID REFERENCES districts(id),
    incident_type VARCHAR(50) CHECK (incident_type IN ('LANDSLIDE', 'FLASH_FLOOD', 'ROAD_BLOCK', 'ROCKFALL', 'OTHER')),
    severity VARCHAR(20) CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MEDIA UPLOADS
CREATE TABLE media_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incident_reports(id),
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ALERTS
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT,
    severity VARCHAR(20) CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    district_id UUID REFERENCES districts(id),
    target_roles UUID[], -- Array of role IDs this alert is meant for
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for performance
CREATE INDEX idx_locations_geom ON locations USING GIST (coordinates);
CREATE INDEX idx_risk_zones_geom ON risk_zones USING GIST (zone_polygon);
CREATE INDEX idx_incidents_geom ON incident_reports USING GIST (location);
CREATE INDEX idx_rainfall_time ON rainfall_data (recorded_at DESC);
CREATE INDEX idx_predictions_time ON model_predictions (prediction_time DESC);
