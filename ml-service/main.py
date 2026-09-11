import random
from datetime import datetime
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from ml_model import LandslideRiskModel
from vision_model import VisionModel
import asyncio

app = FastAPI(
    title="NER-SAFE AI Risk Prediction API",
    description="ML Service for landslide early warning predictions in the North Eastern Region.",
    version="1.0.0"
)

# Initialize models
risk_model = LandslideRiskModel()
# Trigger background training/loading on startup
@app.on_event("startup")
async def startup_event():
    # In a real setup, run this in a thread pool
    risk_model.load_model()

vision_model = VisionModel()

class FeatureData(BaseModel):
    location: str = "Unknown"
    rainfall_1h: float = 0
    rainfall_3h: float = 0
    rainfall_6h: float = 0
    rainfall_12h: float = 0
    rainfall_24h: float = 0
    cumulative_rainfall: float = 0
    rainfall_intensity: float = 0
    elevation: float = 0
    slope: float = 0
    aspect: float = 0
    curvature: float = 0
    terrain_ruggedness: float = 0
    dist_drainage: float = 0
    dist_roads: float = 0
    soil_moisture: float = 0
    soil_saturation: float = 0
    historical_frequency: float = 0
    previous_incidents: float = 0
    seasonal_risk: float = 0
    temperature: float = 0
    humidity: float = 0
    forecast_rainfall: float = 0

class PredictionResponse(BaseModel):
    risk_score: int
    risk_level: str
    probability: float
    confidence: float
    top_contributing_factors: List[str]
    timestamp: str
    location: str
    disclaimer: str = "AI-generated risk estimate. Not a guaranteed prediction."

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ner-safe-ml-service"}

@app.get("/api/ml/model-status")
def get_model_status():
    return {
        "model_name": "Random Forest Classifier",
        "version": "1.2.0",
        "status": "Active",
        "last_trained": risk_model.last_trained,
        "dataset_size": 2000,
        "feature_count": len(risk_model.feature_names)
    }

@app.get("/api/ml/metrics")
def get_metrics():
    return risk_model.metrics

@app.get("/api/ml/feature-importance")
def get_feature_importance():
    return risk_model.get_feature_importance()

@app.post("/api/ml/predict-risk", response_model=PredictionResponse)
def predict_risk(features: FeatureData):
    feat_dict = features.dict(exclude={"location"})
    result = risk_model.predict(feat_dict)
    result["location"] = features.location
    return result

@app.post("/api/ml/batch-predict")
def batch_predict(features_list: List[FeatureData]):
    results = []
    for f in features_list:
        feat_dict = f.dict(exclude={"location"})
        res = risk_model.predict(feat_dict)
        res["location"] = f.location
        results.append(res)
    return results

@app.post("/api/ml/image-predict")
async def image_predict(file: UploadFile = File(...)):
    contents = await file.read()
    result = vision_model.predict(contents)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
