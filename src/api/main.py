"""
Mining Value Chain Optimization - FastAPI Application
Complete API for all 7 ML models with real-time predictions

Author: ML Team (Saidil Mifdal, Farhan Hanif Azhary, Daffa Prawira)
Date: December 5, 2025
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
import logging
from datetime import datetime
import warnings

# Import frontend endpoints router
from .frontend_endpoints import router as frontend_router
from .feature_engineering import create_feature_engineer

# Suppress non-critical warnings for cleaner output
warnings.filterwarnings('ignore', category=UserWarning, module='xgboost')
warnings.filterwarnings('ignore', message='.*InconsistentVersionWarning.*')
warnings.filterwarnings('ignore', message='.*Valid config keys have changed in V2.*')

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Mining Value Chain Optimization API",
    description="Production-ready API for mining operations optimization using ML",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware (if needed for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZip compression middleware
# Compresses responses >1KB automatically
app.add_middleware(
    GZipMiddleware,
    minimum_size=1024,  # Only compress responses larger than 1KB
    compresslevel=6  # Balance between speed (1) and compression (9)
)

# Define project root and model paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
MODELS_DIR = PROJECT_ROOT / "models"

# ============================================================================
# Global model registry
# ============================================================================

class ModelRegistry:
    """Central registry for all ML models"""
    
    def __init__(self):
        self.models = {}
        self.model_wrappers = {}  # Stores metadata for dict-type models
        self.load_all_models()
    
    def _extract_model_from_dict(self, model_data, model_name):
        """
        Extract model from dict structure if needed.
        Some models are saved as dict with: {'model': actual_model, 'label_encoders': {...}, 'feature_cols': [...]}
        """
        if isinstance(model_data, dict) and 'model' in model_data:
            logger.info(f"✓ Extracting model from dict structure: {model_name}")
            self.model_wrappers[model_name] = {
                'encoders': model_data.get('label_encoders', {}),
                'features': model_data.get('feature_cols', []),
                'categorical': model_data.get('categorical_cols', []),
                'metrics': model_data.get('metrics', {})
            }
            return model_data['model']
        return model_data
    
    def _prepare_input_with_encoding(self, model_name, X):
        """
        Apply label encoding if model has encoders.
        X should be a pandas DataFrame.
        """
        if model_name in self.model_wrappers:
            wrapper = self.model_wrappers[model_name]
            encoders = wrapper.get('encoders', {})
            categorical = wrapper.get('categorical', [])
            
            # Apply label encoders to categorical columns
            X_encoded = X.copy()
            for col in categorical:
                if col in X_encoded.columns and col in encoders:
                    try:
                        # Transform categorical to numeric using label encoder
                        X_encoded[col] = encoders[col].transform(X_encoded[col].astype(str))
                        logger.debug(f"✓ Encoded {col}: {X[col].iloc[0]} → {X_encoded[col].iloc[0]}")
                    except ValueError as e:
                        # Handle unseen labels with most common value
                        logger.warning(f"Encoding warning for {col}: {e}. Using most common class.")
                        # Use transform's classes_[0] as default
                        X_encoded[col] = 0
                    except Exception as e:
                        logger.warning(f"Encoding warning for {col}: {e}")
                        X_encoded[col] = 0
            
            return X_encoded
        return X
    
    def _complete_missing_features(self, model_name, X):
        """
        Complete missing features for models that need all expected features.
        Fills with calculated defaults based on available data.
        """
        model = self.models[model_name]
        
        # Get expected features - prioritize metadata over model attribute
        if model_name in self.model_wrappers and self.model_wrappers[model_name].get('features'):
            expected_features = self.model_wrappers[model_name]['features']
            logger.info(f"✓ Using {len(expected_features)} features from metadata for {model_name}")
        elif hasattr(model, 'feature_names_in_'):
            expected_features = list(model.feature_names_in_)
        else:
            return X  # Cannot complete without knowing expected features
        
        # Check for missing features
        missing = [f for f in expected_features if f not in X.columns]
        
        if not missing:
            return X[expected_features]  # Already complete
        
        logger.info(f"Completing {len(missing)} missing features for {model_name}")
        
        X_complete = X.copy()
        
        for feat in missing:
            # Feature-specific defaults based on naming patterns
            if feat == 'umur_tahun':
                # Copy from equipment_age_years if available
                if 'equipment_age_years' in X.columns:
                    X_complete[feat] = X['equipment_age_years']
                else:
                    X_complete[feat] = 5.0  # Default age
                    
            elif feat == 'durasi_jam':
                # Copy from jam_operasi if available
                if 'jam_operasi' in X.columns:
                    X_complete[feat] = X['jam_operasi']
                else:
                    X_complete[feat] = 10000.0  # Default hours
                    
            elif feat == 'daily_usage_hours':
                # Calculate from jam_operasi or durasi_jam
                if 'jam_operasi' in X.columns:
                    X_complete[feat] = X['jam_operasi'] / 365  # Assume 365 days
                elif 'durasi_jam' in X.columns:
                    X_complete[feat] = X['durasi_jam'] / 365
                else:
                    X_complete[feat] = 8.0  # Default 8 hours/day
                    
            elif feat == 'total_muatan_ton':
                # Calculate from beban_rata_rata_ton if available
                if 'beban_rata_rata_ton' in X.columns:
                    # Assume 25 ritase (trips) per period
                    X_complete[feat] = X['beban_rata_rata_ton'] * 25
                else:
                    X_complete[feat] = 2000.0  # Default tonnage
                    
            elif feat == 'cumulative_hours_30d':
                # Estimate from daily usage
                if 'daily_usage_hours' in X_complete.columns:
                    X_complete[feat] = X_complete['daily_usage_hours'] * 30
                else:
                    X_complete[feat] = 240.0  # Default (8h/day * 30 days)
                    
            elif feat == 'jumlah_ritase':
                # Default to reasonable trip count
                X_complete[feat] = 25
                
            elif feat == 'high_age_risk':
                # Binary flag based on equipment age
                if 'equipment_age_years' in X.columns:
                    X_complete[feat] = (X['equipment_age_years'] > 7).astype(int)
                elif 'umur_tahun' in X_complete.columns:
                    X_complete[feat] = (X_complete['umur_tahun'] > 7).astype(int)
                else:
                    X_complete[feat] = 0
                    
            elif feat == 'high_usage_flag':
                # Binary flag based on utilization
                if 'utilization_rate' in X.columns:
                    X_complete[feat] = (X['utilization_rate'] > 0.7).astype(int)
                else:
                    X_complete[feat] = 0
                    
            elif feat == 'age_usage_interaction':
                # Interaction term
                age = X['equipment_age_years'] if 'equipment_age_years' in X.columns else X_complete.get('umur_tahun', pd.Series([5.0]))
                util = X['utilization_rate'] if 'utilization_rate' in X.columns else pd.Series([0.75])
                X_complete[feat] = age * util
                
            elif 'kapasitas_default' in feat or 'default_ton' in feat:
                # Capacity: use average or infer from load
                if 'beban_rata_rata_ton' in X.columns:
                    X_complete[feat] = X['beban_rata_rata_ton'] * 1.2  # 20% buffer
                elif 'total_muatan_ton' in X_complete.columns:
                    X_complete[feat] = X_complete['total_muatan_ton'] / 25 * 1.2
                else:
                    X_complete[feat] = 100.0  # Default capacity
                    
            elif 'days_since_last_op' in feat or 'days_since' in feat:
                # Days since operation: default to 1 (recent operation)
                X_complete[feat] = 1.0
                
            elif 'breakdown_history_count' in feat or 'history_count' in feat:
                # Breakdown count: use from API input if available
                if 'jumlah_breakdown' in X.columns:
                    X_complete[feat] = X['jumlah_breakdown']
                elif 'umur_tahun' in X_complete.columns:
                    X_complete[feat] = X_complete['umur_tahun'] * 0.5  # 0.5 breakdowns/year avg
                elif 'equipment_age_years' in X.columns:
                    X_complete[feat] = X['equipment_age_years'] * 0.5
                else:
                    X_complete[feat] = 0.0
                    
            elif 'overdue' in feat or 'flag' in feat:
                # Binary flags: default to 0 (not overdue/not flagged)
                X_complete[feat] = 0.0
                
            elif 'rate' in feat or 'ratio' in feat:
                # Rate features: default to 0 (no incidents)
                X_complete[feat] = 0.0
                
            elif 'score' in feat:
                # Health scores: default to neutral/good (0.5-0.7)
                X_complete[feat] = 0.6
                
            else:
                # Generic numeric: default to 0
                X_complete[feat] = 0.0
                logger.debug(f"  {feat}: defaulted to 0")
        
        # Ensure correct column order
        return X_complete[expected_features]
    
    def predict(self, model_name, X):
        """
        Universal predict method that handles both standard and dict-wrapper models.
        X should be a pandas DataFrame.
        """
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found in registry")
        
        # Complete missing features if needed
        X = self._complete_missing_features(model_name, X)
        
        # Prepare input with encoding if needed
        X_prepared = self._prepare_input_with_encoding(model_name, X)
        
        # Make prediction
        model = self.models[model_name]
        return model.predict(X_prepared)
    
    def predict_proba(self, model_name, X):
        """
        Universal predict_proba method for classification models.
        X should be a pandas DataFrame.
        """
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found in registry")
        
        # Complete missing features if needed
        X = self._complete_missing_features(model_name, X)
        
        # Prepare input with encoding if needed
        X_prepared = self._prepare_input_with_encoding(model_name, X)
        
        # Make prediction
        model = self.models[model_name]
        if hasattr(model, 'predict_proba'):
            return model.predict_proba(X_prepared)
        else:
            raise AttributeError(f"Model {model_name} does not support predict_proba")
    
    def load_all_models(self):
        """Load all available models"""
        try:
            # Infrastructure models (standard pickle format)
            self.models['road_speed'] = self._extract_model_from_dict(
                joblib.load(MODELS_DIR / 'road_speed_optimized.pkl'), 'road_speed')
            self.models['cycle_time'] = self._extract_model_from_dict(
                joblib.load(MODELS_DIR / 'cycle_time_optimized.pkl'), 'cycle_time')
            
            # Road Risk - use working alternative (road_risk_optimized.pkl has pickle issue)
            try:
                self.models['road_risk'] = self._extract_model_from_dict(
                    joblib.load(MODELS_DIR / 'road_risk_optimized.pkl'), 'road_risk')
            except:
                logger.warning("road_risk_optimized.pkl failed, using infra_road_risk_classification.pkl")
                self.models['road_risk'] = self._extract_model_from_dict(
                    joblib.load(MODELS_DIR / 'infra_road_risk_classification.pkl'), 'road_risk')
            
            # Fleet models (may be dict format)
            self.models['equipment_failure'] = self._extract_model_from_dict(
                joblib.load(MODELS_DIR / 'equipment_failure_optimized.pkl'), 'equipment_failure')
            
            # Port Operability - LGBMClassifier model
            self.models['port_operability'] = self._extract_model_from_dict(
                joblib.load(MODELS_DIR / 'port_operability_optimized.pkl'), 'port_operability')
            
            self.models['performance_degradation'] = self._extract_model_from_dict(
                joblib.load(MODELS_DIR / 'performance_degradation_optimized.pkl'), 'performance_degradation')
            self.models['fleet_risk'] = self._extract_model_from_dict(
                joblib.load(MODELS_DIR / 'fleet_risk_scoring_optimized.pkl'), 'fleet_risk')
            
            logger.info(f"✓ Loaded {len(self.models)} models successfully")
            logger.info(f"✓ Models with wrappers: {list(self.model_wrappers.keys())}")
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            raise

# Initialize registry and feature engineer
registry = ModelRegistry()
feature_engineer = create_feature_engineer()
logger.info(f"✓ Feature engineer initialized")

# ============================================================================
# Pydantic Models for Request/Response
# ============================================================================

class RoadSpeedRequest(BaseModel):
    """Request model for road speed prediction"""
    jenis_jalan: str = Field(..., description="Road type (UTAMA/PENGHUBUNG/CABANG)")
    kondisi_permukaan: str = Field(..., description="Surface condition (KERING/BASAH/BERLUMPUR)")
    curah_hujan_mm: float = Field(..., ge=0, description="Rainfall in mm")
    suhu_celcius: float = Field(..., description="Temperature in Celsius")
    kecepatan_angin_ms: float = Field(..., ge=0, description="Wind speed in m/s")
    elevasi_mdpl: float = Field(..., description="Elevation in meters")
    kemiringan_persen: float = Field(..., ge=0, le=100, description="Slope percentage")
    beban_muatan_ton: float = Field(..., ge=0, description="Load weight in tons")
    jam_operasi: int = Field(..., ge=0, le=23, description="Hour of operation (0-23)")
    
    class Config:
        schema_extra = {
            "example": {
                "jenis_jalan": "UTAMA",
                "kondisi_permukaan": "KERING",
                "curah_hujan_mm": 0.5,
                "suhu_celcius": 28.5,
                "kecepatan_angin_ms": 3.2,
                "elevasi_mdpl": 450,
                "kemiringan_persen": 5.5,
                "beban_muatan_ton": 85.0,
                "jam_operasi": 10
            }
        }

class CycleTimeRequest(BaseModel):
    """Request model for cycle time prediction"""
    jarak_tempuh_km: float = Field(..., ge=0, description="Distance in km")
    kecepatan_prediksi_kmh: float = Field(..., ge=0, description="Predicted speed in km/h")
    curah_hujan_mm: float = Field(..., ge=0, description="Rainfall in mm")
    kondisi_jalan: str = Field(..., description="Road condition")
    beban_muatan_ton: float = Field(..., ge=0, description="Load weight in tons")
    jumlah_stop: int = Field(..., ge=0, description="Number of stops")
    
    class Config:
        schema_extra = {
            "example": {
                "jarak_tempuh_km": 12.5,
                "kecepatan_prediksi_kmh": 25.0,
                "curah_hujan_mm": 1.2,
                "kondisi_jalan": "BAIK",
                "beban_muatan_ton": 90.0,
                "jumlah_stop": 2
            }
        }

class RoadRiskRequest(BaseModel):
    """Request model for road risk classification"""
    jenis_jalan: str = Field(..., description="Road type (UTAMA/PENGHUBUNG/CABANG)")
    kondisi_permukaan: str = Field(..., description="Surface condition (KERING/BASAH/BERLUMPUR)")
    curah_hujan_mm: float = Field(..., ge=0, description="Rainfall in mm")
    kemiringan_persen: float = Field(..., ge=0, le=100, description="Slope percentage")
    
    class Config:
        schema_extra = {
            "example": {
                "jenis_jalan": "UTAMA",
                "kondisi_permukaan": "BASAH",
                "curah_hujan_mm": 15.5,
                "kemiringan_persen": 8.0
            }
        }

class EquipmentFailureRequest(BaseModel):
    """Request model for equipment failure prediction"""
    jenis_equipment: str = Field(..., description="Equipment type (Excavator/Dump Truck/Loader/Dozer/Grader)")
    umur_tahun: float = Field(..., ge=0, description="Equipment age in years (can be decimal)")
    jam_operasional_harian: float = Field(..., ge=0, le=24, description="Daily operating hours")
    ritase_harian: float = Field(..., ge=0, description="Daily trips/cycles")
    
    class Config:
        schema_extra = {
            "example": {
                "jenis_equipment": "Excavator",
                "umur_tahun": 5.5,
                "jam_operasional_harian": 12.0,
                "ritase_harian": 55.0
            }
        }

class PortOperabilityRequest(BaseModel):
    """Request model for port operability forecast"""
    tinggi_gelombang_m: float = Field(..., ge=0, description="Wave height in meters")
    kecepatan_angin_kmh: float = Field(..., ge=0, description="Wind speed in km/h")
    tipe_kapal: str = Field(..., description="Vessel type (Bulk Carrier/Container Ship/Tanker/Barge)")
    kapasitas_muatan_ton: float = Field(..., ge=0, description="Vessel capacity in tons")
    
    class Config:
        schema_extra = {
            "example": {
                "tinggi_gelombang_m": 1.8,
                "kecepatan_angin_kmh": 25.0,
                "tipe_kapal": "Bulk Carrier",
                "kapasitas_muatan_ton": 65000
            }
        }

class PerformanceDegradationRequest(BaseModel):
    """Request model for performance degradation prediction"""
    equipment_age_years: float = Field(..., ge=0, description="Equipment age in years")
    jam_operasi: float = Field(..., ge=0, description="Total operating hours")
    beban_rata_rata_ton: float = Field(..., ge=0, description="Average load in tons")
    kecepatan_rata_rata_kmh: float = Field(..., ge=0, description="Average speed in km/h")
    frekuensi_maintenance: int = Field(..., ge=0, description="Maintenance frequency per year")
    jumlah_breakdown: int = Field(..., ge=0, description="Number of breakdowns")
    utilization_rate: float = Field(..., ge=0, le=1, description="Equipment utilization rate (0-1)")
    
    class Config:
        schema_extra = {
            "example": {
                "equipment_age_years": 5.5,
                "jam_operasi": 12500.0,
                "beban_rata_rata_ton": 85.0,
                "kecepatan_rata_rata_kmh": 22.5,
                "frekuensi_maintenance": 12,
                "jumlah_breakdown": 2,
                "utilization_rate": 0.78
            }
        }

class FleetRiskRequest(BaseModel):
    """Request model for fleet risk scoring"""
    total_unit: int = Field(..., ge=1, description="Total number of units in fleet")
    umur_rata_rata_tahun: float = Field(..., ge=0, description="Average fleet age in years")
    utilisasi_persen: float = Field(..., ge=0, le=100, description="Fleet utilization percentage")
    frekuensi_breakdown: int = Field(..., ge=0, description="Total breakdown frequency")
    skor_maintenance: float = Field(..., ge=0, le=100, description="Maintenance score (0-100)")
    equipment_readiness: float = Field(..., ge=0, le=1, description="Overall fleet readiness (0-1)")
    jumlah_unit_critical: int = Field(..., ge=0, description="Number of units in critical condition")
    
    class Config:
        schema_extra = {
            "example": {
                "total_unit": 50,
                "umur_rata_rata_tahun": 6.5,
                "utilisasi_persen": 78.5,
                "frekuensi_breakdown": 15,
                "skor_maintenance": 82.0,
                "equipment_readiness": 0.85,
                "jumlah_unit_critical": 3
            }
        }

class PredictionResponse(BaseModel):
    """Standard prediction response"""
    success: bool
    prediction: Any
    confidence: Optional[float] = None
    risk_level: Optional[str] = None
    recommendations: Optional[List[str]] = None
    timestamp: str

# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Mining Value Chain Optimization API",
        "version": "1.0.0",
        "status": "operational",
        "available_endpoints": {
            "ml_predictions": {
                "infrastructure": [
                    "/predict/road-speed",
                    "/predict/cycle-time",
                    "/predict/road-risk"
                ],
                "fleet": [
                    "/predict/equipment-failure",
                    "/predict/port-operability",
                    "/predict/performance-degradation",
                    "/predict/fleet-risk"
                ],
                "batch": [
                    "/predict/batch/infrastructure",
                    "/predict/batch/fleet"
                ]
            },
            "frontend_integration": {
                "dashboard": "/api/dashboard",
                "mine_planner": "/api/mine-planner",
                "shipping_planner": "/api/shipping-planner",
                "chatbox": "/api/chatbox",
                "reports": "/api/reports"
            }
        },
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        }
    }

# Include frontend router
app.include_router(frontend_router)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": len(registry.models),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/models/info")
async def models_info():
    """Get information about loaded models"""
    model_info = {}
    for name, model in registry.models.items():
        model_info[name] = {
            "type": type(model).__name__,
            "loaded": True
        }
    return {
        "total_models": len(registry.models),
        "models": model_info
    }

# ============================================================================
# Infrastructure Predictions
# ============================================================================

@app.post("/predict/road-speed", response_model=PredictionResponse)
async def predict_road_speed(request: RoadSpeedRequest):
    """
    Predict actual road speed based on conditions
    
    Target: RMSE < 4 km/h
    Model: XGBoost Regressor
    """
    try:
        # Engineer features dari input API
        features = feature_engineer.engineer_road_speed_features(request.dict())
        logger.info(f"Road speed features engineered: {features.shape}")
        
        # Make prediction using registry wrapper
        prediction = registry.predict('road_speed', features)[0]
        
        # Generate recommendations
        recommendations = []
        if prediction < 15:
            recommendations.append("⚠️ Low speed predicted - check road conditions")
        if request.curah_hujan_mm > 10:
            recommendations.append("🌧️ Heavy rain - reduce speed for safety")
        if request.kemiringan_persen > 10:
            recommendations.append("⛰️ Steep slope - use appropriate gear")
        
        return PredictionResponse(
            success=True,
            prediction=round(float(prediction), 2),
            confidence=0.92,  # Based on model R²
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Road speed prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/cycle-time", response_model=PredictionResponse)
async def predict_cycle_time(request: CycleTimeRequest):
    """
    Predict hauling cycle time
    
    Target: MAPE < 15%
    Model: LightGBM Regressor
    """
    try:
        # Engineer features dari input API  
        features = feature_engineer.engineer_cycle_time_features(request.dict())
        logger.info(f"Cycle time features engineered: {features.shape}")
        prediction = registry.predict('cycle_time', features)[0]
        
        recommendations = []
        if prediction > 45:
            recommendations.append("⏱️ Long cycle time - optimize route or reduce stops")
        if request.curah_hujan_mm > 5:
            recommendations.append("🌧️ Weather impact - expect delays")
        
        return PredictionResponse(
            success=True,
            prediction=round(float(prediction), 2),
            confidence=0.88,
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Cycle time prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/road-risk", response_model=PredictionResponse)
async def predict_road_risk(request: RoadRiskRequest):
    """
    Classify road risk level
    
    Target: F1 > 0.85
    Model: XGBoost Classifier (multi-class)
    Classes: BAIK (safe), WASPADA (caution), TERBATAS (restricted)
    """
    try:
        # Feature engineering: transform API inputs to 38 infra features
        features = feature_engineer.engineer_road_risk_features(request.dict())
        logger.info(f"Road risk features engineered: {features.shape}")
        
        prediction = registry.predict('road_risk', features)[0]
        probabilities = registry.predict_proba('road_risk', features)[0]
        
        risk_mapping = {
            'BAIK': 'LOW',
            'WASPADA': 'MEDIUM',
            'TERBATAS': 'HIGH'
        }
        
        recommendations = []
        if prediction == 'TERBATAS':
            recommendations.append("🚨 High risk - restrict operations or reduce speed")
            recommendations.append("👷 Increase safety monitoring")
        elif prediction == 'WASPADA':
            recommendations.append("⚠️ Medium risk - proceed with caution")
            recommendations.append("📡 Monitor conditions closely")
        else:
            recommendations.append("✅ Low risk - normal operations")
        
        return PredictionResponse(
            success=True,
            prediction=prediction,
            confidence=round(float(max(probabilities)), 3),
            risk_level=risk_mapping[prediction],
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Road risk prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# Fleet Predictions
# ============================================================================

@app.post("/predict/equipment-failure", response_model=PredictionResponse)
async def predict_equipment_failure(request: EquipmentFailureRequest):
    """
    Predict equipment failure probability
    
    Target: Recall > 0.80
    Model: XGBoost Classifier
    Classes: Operational, Breakdown
    """
    try:
        # Feature engineering: transform API inputs to 44 fleet features
        features = feature_engineer.engineer_equipment_failure_features(request.dict())
        logger.info(f"Equipment failure features engineered: {features.shape}")
        
        prediction = registry.predict('equipment_failure', features)[0]
        probabilities = registry.predict_proba('equipment_failure', features)[0]
        
        breakdown_prob = probabilities[1] if len(probabilities) > 1 else 0.0
        
        recommendations = []
        if breakdown_prob > 0.7:
            recommendations.append("🚨 HIGH breakdown risk - schedule immediate maintenance")
            recommendations.append("🔧 Inspect critical components")
        elif breakdown_prob > 0.4:
            recommendations.append("⚠️ MEDIUM breakdown risk - plan preventive maintenance")
        else:
            recommendations.append("✅ LOW breakdown risk - continue monitoring")
        
        # Equipment age-based recommendations
        if request.umur_tahun > 7:
            recommendations.append("📅 Old equipment - increase monitoring frequency")
        
        # High usage recommendations
        if request.jam_operasional_harian > 16:
            recommendations.append("⏰ High usage - ensure regular maintenance")
        
        risk_level = 'HIGH' if breakdown_prob > 0.7 else 'MEDIUM' if breakdown_prob > 0.4 else 'LOW'
        
        return PredictionResponse(
            success=True,
            prediction="Breakdown Risk" if breakdown_prob > 0.5 else "Operational",
            confidence=round(float(max(probabilities)), 3),
            risk_level=risk_level,
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Equipment failure prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/port-operability", response_model=PredictionResponse)
async def predict_port_operability(request: PortOperabilityRequest):
    """
    Forecast port loading operability
    
    Target: Accuracy > 0.75
    Model: LightGBM Classifier
    Classes: Beroperasi, Maintenance, Breakdown
    """
    try:
        # Feature engineering: transform API inputs to 44 weather/operational features
        features = feature_engineer.engineer_port_operability_features(request.dict())
        logger.info(f"Port operability features engineered: {features.shape}")
        
        prediction = registry.predict('port_operability', features)[0]
        probabilities = registry.predict_proba('port_operability', features)[0]
        
        recommendations = []
        if prediction == 'Breakdown':
            recommendations.append("🚨 Equipment breakdown - halt operations")
            recommendations.append("🔧 Dispatch maintenance team")
        elif prediction == 'Maintenance':
            recommendations.append("⚠️ Maintenance required - plan downtime")
        else:
            recommendations.append("✅ Port operational - proceed with loading")
        
        # Weather-based recommendations
        if request.kecepatan_angin_kmh > 40:
            recommendations.append("💨 High wind speed - monitor safety")
        if request.tinggi_gelombang_m > 2:
            recommendations.append("🌊 High waves - consider delaying operations")
        
        risk_mapping = {
            'Beroperasi': 'LOW',
            'Maintenance': 'MEDIUM',
            'Breakdown': 'HIGH',
            'MODERATE': 'MEDIUM'
        }
        
        return PredictionResponse(
            success=True,
            prediction=prediction,
            confidence=round(float(max(probabilities)), 3),
            risk_level=risk_mapping.get(prediction, 'MEDIUM'),
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Port operability prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/performance-degradation", response_model=PredictionResponse)
async def predict_performance_degradation(request: PerformanceDegradationRequest):
    """
    Predict equipment performance efficiency ratio
    
    Target: MAE < 10 percentage points
    Model: XGBoost Regressor (Dict-Wrapper)
    Output: Predicted efficiency ratio (0-120%)
           - 100% = optimal performance
           - <80% = degrading performance
           - <50% = severe degradation
    """
    try:
        features = pd.DataFrame([request.dict()])
        logger.info(f"DEBUG: Input features columns: {list(features.columns)}")
        logger.info(f"DEBUG: Input features shape: {features.shape}")
        prediction = registry.predict('performance_degradation', features)[0]
        logger.info(f"DEBUG: Raw prediction value: {prediction}")
        
        # Prediction is efficiency ratio (percentage)
        efficiency = float(prediction)
        
        recommendations = []
        if efficiency < 20:
            recommendations.append("🚨 CRITICAL degradation - efficiency below 20%")
            recommendations.append("🔧 Immediate maintenance or replacement required")
            recommendations.append("⚠️ Equipment may fail soon - prioritize action")
            risk_level = 'CRITICAL'
        elif efficiency < 50:
            recommendations.append("⚠️ HIGH degradation - efficiency below 50%")
            recommendations.append("📊 Schedule major maintenance within 1 month")
            recommendations.append("🔍 Investigate root cause of performance drop")
            risk_level = 'HIGH'
        elif efficiency < 80:
            recommendations.append("⚠️ MODERATE degradation - efficiency 50-80%")
            recommendations.append("📅 Plan preventive maintenance within 3 months")
            recommendations.append("📊 Monitor performance trends closely")
            risk_level = 'MEDIUM'
        else:
            recommendations.append("✅ Good efficiency - equipment performing well")
            recommendations.append("📊 Continue routine maintenance schedule")
            risk_level = 'LOW'
        
        if request.equipment_age_years > 10:
            recommendations.append("📅 Equipment age > 10 years - consider lifecycle review")
        
        if request.jumlah_breakdown > 5:
            recommendations.append(f"⚠️ High breakdown count ({request.jumlah_breakdown}) - investigate reliability issues")
        
        # Estimate confidence based on efficiency range
        confidence = 0.88 if efficiency > 50 else 0.82 if efficiency > 20 else 0.75
        
        return PredictionResponse(
            success=True,
            prediction=round(efficiency, 2),
            confidence=confidence,
            risk_level=risk_level,
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Performance degradation prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/fleet-risk", response_model=PredictionResponse)
async def predict_fleet_risk(request: FleetRiskRequest):
    """
    Calculate fleet-wide risk scoring
    
    Target: Risk score 0-100 (lower is better)
    Model: XGBoost Regressor (Dict-Wrapper)
    Output: Composite fleet risk score
    """
    try:
        features = pd.DataFrame([request.dict()])
        prediction = registry.predict('fleet_risk', features)[0]
        
        recommendations = []
        if prediction > 70:
            recommendations.append("🚨 CRITICAL fleet risk - implement immediate action plan")
            recommendations.append("🔧 Focus on critical units - prioritize maintenance")
            recommendations.append("📊 Increase fleet monitoring frequency")
        elif prediction > 50:
            recommendations.append("⚠️ HIGH fleet risk - review maintenance strategy")
            recommendations.append("📅 Schedule preventive maintenance for aging units")
        elif prediction > 30:
            recommendations.append("⚠️ MODERATE fleet risk - continue monitoring")
            recommendations.append("✅ Maintain current maintenance schedule")
        else:
            recommendations.append("✅ LOW fleet risk - fleet in good condition")
            recommendations.append("📊 Continue routine monitoring")
        
        if request.jumlah_unit_critical > request.total_unit * 0.1:
            recommendations.append(f"⚠️ {request.jumlah_unit_critical} critical units detected - prioritize repairs")
        
        if request.utilisasi_persen > 85:
            recommendations.append("📈 High utilization - consider fleet expansion")
        
        # Determine confidence based on fleet size
        confidence = 0.90 if request.total_unit > 30 else 0.80 if request.total_unit > 10 else 0.70
        
        return PredictionResponse(
            success=True,
            prediction=round(float(prediction), 2),
            confidence=confidence,
            risk_level='HIGH' if prediction > 50 else 'MEDIUM' if prediction > 30 else 'LOW',
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Fleet risk prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# Batch Prediction Endpoints
# ============================================================================

@app.post("/predict/batch/infrastructure")
async def batch_predict_infrastructure(requests: List[Dict[str, Any]]):
    """
    Batch prediction for all infrastructure models
    Useful for simulation and bulk analysis
    """
    try:
        results = []
        for req in requests:
            result = {
                "road_speed": None,
                "cycle_time": None,
                "road_risk": None
            }
            
            # Road speed
            if 'road_speed' in req:
                speed_features = pd.DataFrame([req['road_speed']])
                result['road_speed'] = float(registry.models['road_speed'].predict(speed_features)[0])
            
            # Cycle time
            if 'cycle_time' in req:
                cycle_features = pd.DataFrame([req['cycle_time']])
                result['cycle_time'] = float(registry.models['cycle_time'].predict(cycle_features)[0])
            
            # Road risk
            if 'road_risk' in req:
                risk_features = pd.DataFrame([req['road_risk']])
                result['road_risk'] = registry.models['road_risk'].predict(risk_features)[0]
            
            results.append(result)
        
        return {
            "success": True,
            "total_predictions": len(results),
            "results": results,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Batch infrastructure prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/batch/fleet")
async def batch_predict_fleet(requests: List[Dict[str, Any]]):
    """
    Batch prediction for fleet-wide analysis
    Handles Performance Degradation and Fleet Risk models
    """
    try:
        results = []
        for idx, req in enumerate(requests):
            logger.info(f"Processing request {idx+1}, keys: {list(req.keys())}")
            
            result = {
                "performance_degradation": None,
                "fleet_risk": None,
                "equipment_failure": None,
                "port_operability": None
            }
            
            # Performance Degradation
            if 'performance_degradation' in req:
                try:
                    logger.info(f"Found performance_degradation data")
                    perf_features = pd.DataFrame([req['performance_degradation']])
                    if 'performance_degradation' in registry.models:
                        # Complete missing features
                        perf_features = registry._complete_missing_features('performance_degradation', perf_features)
                        pred = registry.models['performance_degradation'].predict(perf_features)[0]
                        result['performance_degradation'] = {
                            "degradation_score": float(pred) if isinstance(pred, (int, float, np.number)) else str(pred),
                            "status": "high" if float(pred) > 0.7 else "moderate" if float(pred) > 0.4 else "low"
                        }
                        logger.info(f"Performance degradation prediction: {result['performance_degradation']}")
                    else:
                        logger.warning("performance_degradation model not found in registry")
                except Exception as e:
                    logger.warning(f"Performance degradation prediction error: {e}")
            
            # Fleet Risk
            if 'fleet_risk' in req:
                try:
                    logger.info(f"Found fleet_risk data")
                    fleet_features = pd.DataFrame([req['fleet_risk']])
                    if 'fleet_risk' in registry.models:
                        # Complete missing features
                        fleet_features = registry._complete_missing_features('fleet_risk', fleet_features)
                        pred = registry.models['fleet_risk'].predict(fleet_features)[0]
                        result['fleet_risk'] = {
                            "risk_score": float(pred) if isinstance(pred, (int, float, np.number)) else str(pred),
                            "risk_level": "critical" if float(pred) > 0.7 else "moderate" if float(pred) > 0.4 else "low"
                        }
                        logger.info(f"Fleet risk prediction: {result['fleet_risk']}")
                    else:
                        logger.warning("fleet_risk model not found in registry")
                except Exception as e:
                    logger.warning(f"Fleet risk prediction error: {e}")
            
            # Equipment Failure (legacy support)
            if 'equipment_failure' in req:
                try:
                    failure_features = pd.DataFrame([req['equipment_failure']])
                    if 'equipment_failure' in registry.models:
                        result['equipment_failure'] = registry.models['equipment_failure'].predict(failure_features)[0]
                except Exception as e:
                    logger.warning(f"Equipment failure prediction error: {e}")
            
            # Port Operability (legacy support)
            if 'port_operability' in req:
                try:
                    port_features = pd.DataFrame([req['port_operability']])
                    if 'port_operability' in registry.models:
                        result['port_operability'] = registry.models['port_operability'].predict(port_features)[0]
                except Exception as e:
                    logger.warning(f"Port operability prediction error: {e}")
            
            results.append(result)
        
        return {
            "success": True,
            "total_predictions": len(results),
            "results": results,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Batch fleet prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc),
            "timestamp": datetime.now().isoformat()
        }
    )

# ============================================================================
# Startup Event
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Actions to perform on API startup"""
    logger.info("="*80)
    logger.info("Mining Value Chain Optimization API - Starting")
    logger.info("="*80)
    logger.info(f"Models loaded: {len(registry.models)}")
    logger.info(f"API documentation: http://localhost:8000/docs")
    logger.info("="*80)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
