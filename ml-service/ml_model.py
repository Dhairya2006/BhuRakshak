import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib
import os
from datetime import datetime

class LandslideRiskModel:
    def __init__(self, model_path="ml-service/models/rf_model.joblib"):
        self.model_path = model_path
        self.model = None
        self.feature_names = [
            "rainfall_1h", "rainfall_3h", "rainfall_6h", "rainfall_12h", "rainfall_24h", "cumulative_rainfall", "rainfall_intensity",
            "elevation", "slope", "aspect", "curvature", "terrain_ruggedness", "dist_drainage", "dist_roads",
            "soil_moisture", "soil_saturation", "historical_frequency", "previous_incidents", "seasonal_risk",
            "temperature", "humidity", "forecast_rainfall"
        ]
        self.metrics = {}
        self.last_trained = None

    def generate_dummy_data(self, n_samples=2000):
        np.random.seed(42)
        data = pd.DataFrame(np.random.rand(n_samples, len(self.feature_names)), columns=self.feature_names)
        
        # Scale to realistic values
        data['rainfall_24h'] = data['rainfall_24h'] * 150  # 0-150mm
        data['slope'] = data['slope'] * 60  # 0-60 degrees
        data['soil_moisture'] = data['soil_moisture'] * 100  # 0-100%
        data['historical_frequency'] = data['historical_frequency'] * 5
        
        # Generate target based on heuristics
        risk_score = (data['rainfall_24h'] * 0.4 + data['slope'] * 0.3 + data['soil_moisture'] * 0.2 + data['historical_frequency'] * 10)
        data['target'] = (risk_score > 60).astype(int)
        
        return data

    def train(self):
        df = self.generate_dummy_data()
        X = df[self.feature_names]
        y = df['target']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model = RandomForestClassifier(n_estimators=100, max_depth=10, class_weight='balanced', random_state=42)
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        y_prob = self.model.predict_proba(X_test)[:, 1]
        
        self.metrics = {
            "accuracy": accuracy_score(y_test, y_pred),
            "precision": precision_score(y_test, y_pred, zero_division=0),
            "recall": recall_score(y_test, y_pred, zero_division=0),
            "f1_score": f1_score(y_test, y_pred, zero_division=0),
            "roc_auc": roc_auc_score(y_test, y_prob)
        }
        
        self.last_trained = datetime.utcnow().isoformat()
        
        # Ensure dir exists
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        
        return self.metrics

    def load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        else:
            self.train()
            
    def get_feature_importance(self):
        if self.model is None:
            self.load_model()
        importances = self.model.feature_importances_
        indices = np.argsort(importances)[::-1]
        
        importance_dict = {}
        for i in indices[:5]:  # Top 5
            importance_dict[self.feature_names[i]] = float(importances[i])
            
        return importance_dict

    def predict(self, features_dict):
        if self.model is None:
            self.load_model()
            
        # Convert to DataFrame
        df = pd.DataFrame([features_dict], columns=self.feature_names)
        
        # Fill missing with 0
        df = df.fillna(0)
        
        prob = float(self.model.predict_proba(df)[0][1])
        risk_score = min(int(prob * 100), 100)
        
        # Calculate top contributing factors dynamically based on local value * global importance
        global_imp = self.model.feature_importances_
        local_contributions = np.array(df.iloc[0]) * global_imp
        top_indices = np.argsort(local_contributions)[::-1][:3]
        
        top_factors = []
        for i in top_indices:
            if local_contributions[i] > 0:
                top_factors.append(self.feature_names[i].replace("_", " ").title())
                
        if risk_score <= 20:
            level = "LOW"
        elif risk_score <= 40:
            level = "MODERATE"
        elif risk_score <= 60:
            level = "HIGH"
        elif risk_score <= 80:
            level = "VERY HIGH"
        else:
            level = "CRITICAL"
            
        return {
            "risk_score": risk_score,
            "risk_level": level,
            "probability": prob,
            "confidence": 0.85, # Mock confidence
            "top_contributing_factors": top_factors,
            "timestamp": datetime.utcnow().isoformat()
        }
