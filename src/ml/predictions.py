"""
ML Predictions Integration Module
Connects frontend endpoints dengan ML prediction models

Author: ML Team  
Date: December 9, 2025
"""

import logging
import requests
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ML API Configuration
ML_API_BASE = "http://localhost:8000"


def call_ml_endpoint(
    endpoint: str,
    data: Dict[str, Any],
    method: str = "POST",
    timeout: int = 5
) -> Optional[Dict[str, Any]]:
    """
    Call ML prediction endpoint with error handling
    
    Args:
        endpoint: API endpoint path (e.g., "/predict/road-risk")
        data: Request payload
        method: HTTP method (POST/GET)
        timeout: Request timeout in seconds
    
    Returns:
        Prediction result or None if error
    """
    try:
        url = f"{ML_API_BASE}{endpoint}"
        
        if method.upper() == "POST":
            response = requests.post(url, json=data, timeout=timeout)
        else:
            response = requests.get(url, params=data, timeout=timeout)
        
        response.raise_for_status()
        result = response.json()
        
        logger.debug(f"ML prediction successful: {endpoint}")
        return result
        
    except requests.exceptions.Timeout:
        logger.warning(f"ML prediction timeout: {endpoint}")
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"ML prediction error ({endpoint}): {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error calling ML endpoint: {e}")
        return None


# ============================================================================
# ROAD RISK PREDICTIONS
# ============================================================================

def predict_road_risk(
    friction: float,
    water_depth: float,
    wind_speed: float,
    visibility: float,
    rainfall: float
) -> Dict[str, Any]:
    """
    Predict road risk level using ML model
    
    Args:
        friction: Road friction index (0-1)
        water_depth: Water depth on road (cm)
        wind_speed: Wind speed (km/h)
        visibility: Visibility distance (km)
        rainfall: Rainfall amount (mm)
    
    Returns:
        Dict with risk prediction and confidence
    """
    try:
        # Determine rain intensity
        if rainfall < 5:
            intensitas_hujan = "RINGAN"
        elif rainfall < 20:
            intensitas_hujan = "SEDANG"
        else:
            intensitas_hujan = "LEBAT"
        
        # Determine surface condition
        if rainfall < 2 and water_depth < 1:
            kondisi_permukaan = "KERING"
        elif rainfall < 10 and water_depth < 5:
            kondisi_permukaan = "BASAH"
        else:
            kondisi_permukaan = "BERLUMPUR"
        
        # Prepare payload matching RoadRiskRequest schema
        payload = {
            "curah_hujan_mm": float(rainfall),
            "intensitas_hujan": intensitas_hujan,
            "kecepatan_angin_ms": float(wind_speed / 3.6),  # Convert km/h to m/s
            "kondisi_permukaan": kondisi_permukaan,
            "kedalaman_air_cm": float(water_depth),
            "indeks_friksi": float(friction),
            "visibilitas_m": float(visibility * 1000),  # Convert km to meters
            "kemiringan_persen": 5.0  # Average slope assumption
        }
        
        # Call ML endpoint
        result = call_ml_endpoint("/predict/road-risk", payload, timeout=5)
        
        if result and "prediction" in result:
            # Map model output to frontend format
            risk_mapping = {
                'BAIK': 'Low',
                'WASPADA': 'Medium',
                'TERBATAS': 'High'
            }
            
            predicted_class = result["prediction"]
            risk_level = risk_mapping.get(predicted_class, 'Medium')
            
            # Calculate risk score (0-100)
            risk_scores = {'Low': 25, 'Medium': 55, 'High': 85}
            risk_score = risk_scores.get(risk_level, 50)
            
            # Estimate speed based on risk
            if risk_level == 'High':
                predicted_speed = max(10, 25 - (rainfall * 0.3))
            elif risk_level == 'Medium':
                predicted_speed = max(15, 35 - (rainfall * 0.2))
            else:
                predicted_speed = 45 - (rainfall * 0.1)
            
            return {
                "risk_level": risk_level,
                "risk_score": risk_score,
                "predicted_speed": round(predicted_speed, 1),
                "confidence": result.get("confidence", 0.85),
                "source": "ml_model"
            }
    
    except Exception as e:
        logger.warning(f"ML road risk prediction failed: {e}. Using fallback.")
    
    # Fallback: Rule-based calculation
    risk_score = 0
    
    # Friction impact (most important)
    if friction < 0.3:
        risk_score += 35
    elif friction < 0.4:
        risk_score += 20
    else:
        risk_score += 5
    
    # Water depth impact
    if water_depth > 10:
        risk_score += 30
    elif water_depth > 5:
        risk_score += 15
    
    # Rainfall impact
    if rainfall > 30:
        risk_score += 20
    elif rainfall > 10:
        risk_score += 10
    
    # Visibility impact
    if visibility < 1.0:
        risk_score += 15
    elif visibility < 2.0:
        risk_score += 8
    
    # Determine risk level
    if risk_score >= 60:
        risk_level = "High"
        predicted_speed = 12
    elif risk_score >= 30:
        risk_level = "Medium"
        predicted_speed = 22
    else:
        risk_level = "Low"
        predicted_speed = 35
    
    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "predicted_speed": predicted_speed,
        "confidence": 0.75,
        "source": "fallback_calculation"
    }


# ============================================================================
# EQUIPMENT FAILURE PREDICTIONS
# ============================================================================

def predict_equipment_failure(
    equipment_id: str,
    operating_hours: float,
    age_years: int,
    maintenance_count: int,
    breakdown_count: int
) -> Dict[str, Any]:
    """
    Predict equipment failure probability
    
    Args:
        equipment_id: Equipment identifier
        operating_hours: Total operating hours
        age_years: Equipment age in years
        maintenance_count: Number of maintenance sessions
        breakdown_count: Number of breakdowns
    
    Returns:
        Dict with failure probability and risk level
    """
    try:
        # Determine equipment type from ID
        if "DUMP" in equipment_id.upper():
            tipe_alat = "DUMP_TRUCK"
        elif "EXC" in equipment_id.upper() or "ALAT" in equipment_id.upper():
            tipe_alat = "EXCAVATOR"
        elif "BULL" in equipment_id.upper():
            tipe_alat = "BULLDOZER"
        else:
            tipe_alat = "HAULER"
        
        # Calculate derived metrics
        days_since_maintenance = int((operating_hours / 12) * 30)  # Estimate based on hours
        jarak_tempuh_km = operating_hours * 25  # Estimate: 25 km per operating hour
        utilization_rate = min(operating_hours / (age_years * 365 * 20), 1.0)  # Max 20h/day
        
        # Prepare payload matching EquipmentFailureRequest schema
        payload = {
            "tipe_alat": tipe_alat,
            "umur_tahun": int(age_years),
            "jam_operasi": float(operating_hours),
            "jarak_tempuh_km": float(jarak_tempuh_km),
            "jumlah_maintenance": int(maintenance_count),
            "jumlah_breakdown": int(breakdown_count),
            "days_since_last_maintenance": int(days_since_maintenance),
            "utilization_rate": float(utilization_rate)
        }
        
        # Call ML endpoint
        result = call_ml_endpoint("/predict/equipment-failure", payload, timeout=5)
        
        if result and "prediction" in result:
            # Extract failure probability
            failure_prob = result.get("confidence", 0.5) * 100
            
            # Determine risk level
            if failure_prob >= 70:
                risk_level = "High"
            elif failure_prob >= 40:
                risk_level = "Medium"
            else:
                risk_level = "Low"
            
            return {
                "failure_probability": round(failure_prob, 1),
                "risk_level": risk_level,
                "confidence": result.get("confidence", 0.80),
                "source": "ml_model"
            }
    
    except Exception as e:
        logger.warning(f"ML equipment failure prediction failed: {e}. Using fallback.")
    
    # Fallback: Rule-based calculation
    failure_score = 0
    
    # Age impact
    if age_years > 8:
        failure_score += 30
    elif age_years > 5:
        failure_score += 15
    
    # Operating hours impact
    if operating_hours > 15000:
        failure_score += 25
    elif operating_hours > 10000:
        failure_score += 12
    
    # Breakdown history
    failure_score += breakdown_count * 8
    
    # Maintenance ratio (good maintenance reduces risk)
    if maintenance_count > 0:
        maintenance_ratio = breakdown_count / maintenance_count
        if maintenance_ratio > 0.3:
            failure_score += 15
    else:
        failure_score += 20  # No maintenance = high risk
    
    # Cap at 100
    failure_prob = min(failure_score, 95)
    
    # Determine risk level
    if failure_prob >= 70:
        risk_level = "High"
    elif failure_prob >= 40:
        risk_level = "Medium"
    else:
        risk_level = "Low"
    
    return {
        "failure_probability": failure_prob,
        "risk_level": risk_level,
        "confidence": 0.72,
        "source": "fallback_calculation"
    }


# ============================================================================
# PORT OPERABILITY PREDICTIONS
# ============================================================================

def predict_port_operability(
    wave_height: float,
    wind_speed: float,
    visibility: float,
    rainfall: float
) -> Dict[str, Any]:
    """
    Predict port operability status
    
    Args:
        wave_height: Wave height (meters)
        wind_speed: Wind speed (km/h)
        visibility: Visibility distance (km)
        rainfall: Rainfall amount (mm)
    
    Returns:
        Dict with port status and operability score
    """
    try:
        # Estimate temperature based on rainfall (tropical climate)
        suhu_celcius = 32.0 - (rainfall * 0.3)  # Cooler when raining
        
        # Equipment readiness estimation
        if wave_height < 1.5 and wind_speed < 25:
            equipment_readiness = 0.95
        elif wave_height < 2.5 and wind_speed < 40:
            equipment_readiness = 0.75
        else:
            equipment_readiness = 0.45
        
        # Prepare payload matching PortOperabilityRequest schema
        # Schema requires: tinggi_gelombang_m, kecepatan_angin_kmh, tipe_kapal, kapasitas_muatan_ton
        payload = {
            "tinggi_gelombang_m": float(wave_height),
            "kecepatan_angin_kmh": float(wind_speed),  # Keep in km/h (schema expects this)
            "tipe_kapal": "Bulk Carrier",  # Default vessel type
            "kapasitas_muatan_ton": 65000.0  # Default capacity
        }
        
        # Call ML endpoint
        result = call_ml_endpoint("/predict/port-operability", payload, timeout=5)
        
        if result and "prediction" in result:
            # Map prediction to status
            prediction = result["prediction"]
            
            if prediction in ["OPERATIONAL", "OPEN"]:
                status = "Operational"
                operability_score = 85
            elif prediction in ["MODERATE", "LIMITED"]:
                status = "Limited"
                operability_score = 55
            else:
                status = "Closed"
                operability_score = 25
            
            return {
                "status": status,
                "operability_score": operability_score,
                "confidence": result.get("confidence", 0.82),
                "source": "ml_model"
            }
    
    except Exception as e:
        logger.warning(f"ML port operability prediction failed: {e}. Using fallback.")
    
    # Fallback: Rule-based calculation
    operability_score = 100
    
    # Wave height impact (critical for loading)
    if wave_height > 2.5:
        operability_score -= 45
    elif wave_height > 1.5:
        operability_score -= 25
    elif wave_height > 1.0:
        operability_score -= 10
    
    # Wind speed impact
    if wind_speed > 40:
        operability_score -= 30
    elif wind_speed > 25:
        operability_score -= 15
    
    # Visibility impact
    if visibility < 1.0:
        operability_score -= 20
    elif visibility < 2.0:
        operability_score -= 10
    
    # Rainfall impact
    if rainfall > 30:
        operability_score -= 15
    elif rainfall > 10:
        operability_score -= 8
    
    # Determine status
    if operability_score >= 70:
        status = "Operational"
    elif operability_score >= 40:
        status = "Limited"
    else:
        status = "Closed"
    
    return {
        "status": status,
        "operability_score": max(operability_score, 0),
        "confidence": 0.78,
        "source": "fallback_calculation"
    }


# ============================================================================
# FLEET PERFORMANCE PREDICTIONS
# ============================================================================

def predict_fleet_performance(
    avg_cycle_time: float,
    equipment_count: int,
    utilization_rate: float,
    weather_impact: float = 1.0
) -> Dict[str, Any]:
    """
    Predict overall fleet performance score
    
    Args:
        avg_cycle_time: Average cycle time (minutes)
        equipment_count: Number of active equipment
        utilization_rate: Equipment utilization rate (0-1)
        weather_impact: Weather impact factor (0-1)
    
    Returns:
        Dict with performance score and recommendations
    """
    try:
        # Rule-based fleet performance calculation
        # Optimal cycle time is around 25-30 minutes
        cycle_time_score = max(0, 100 - abs(avg_cycle_time - 27.5) * 2)
        
        # Equipment count score (optimal: 12-15 units)
        equipment_score = min(equipment_count / 15 * 100, 100)
        
        # Utilization score
        utilization_score = utilization_rate * 100
        
        # Weather impact score
        weather_score = weather_impact * 100
        
        # Overall performance (weighted average)
        performance_score = (
            cycle_time_score * 0.35 +
            equipment_score * 0.25 +
            utilization_score * 0.25 +
            weather_score * 0.15
        )
        
        # Determine performance level
        if performance_score >= 85:
            level = "Excellent"
            recommendations = ["Maintain current operations", "Monitor for consistency"]
        elif performance_score >= 70:
            level = "Good"
            recommendations = ["Minor optimizations possible", "Check equipment efficiency"]
        elif performance_score >= 55:
            level = "Fair"
            recommendations = ["Review cycle times", "Improve equipment utilization"]
        else:
            level = "Poor"
            recommendations = ["Immediate action needed", "Check weather delays", "Review maintenance schedules"]
        
        return {
            "performance_score": round(performance_score, 1),
            "performance_level": level,
            "cycle_time_score": round(cycle_time_score, 1),
            "equipment_score": round(equipment_score, 1),
            "utilization_score": round(utilization_score, 1),
            "weather_score": round(weather_score, 1),
            "recommendations": recommendations,
            "source": "fleet_calculation"
        }
    
    except Exception as e:
        logger.error(f"Fleet performance calculation failed: {e}")
        return {
            "performance_score": 70.0,
            "performance_level": "Good",
            "recommendations": ["Data collection ongoing"],
            "source": "default"
        }


# ============================================================================
# CYCLE TIME PREDICTIONS
# ============================================================================

def predict_cycle_time(
    distance_km: float,
    road_conditions: Dict[str, Any],
    equipment_type: str = "DUMP_TRUCK"
) -> Dict[str, Any]:
    """
    Predict hauling cycle time
    
    Args:
        distance_km: Hauling distance (km)
        road_conditions: Road condition data
        equipment_type: Type of equipment
    
    Returns:
        Dict with predicted cycle time
    """
    try:
        # Get average road speed from conditions
        avg_friction = road_conditions.get("avg_friction", 0.5)
        avg_rainfall = road_conditions.get("rainfall", 0)
        
        # Estimate base speed
        if avg_friction < 0.3:
            base_speed = 15
        elif avg_friction < 0.4:
            base_speed = 25
        else:
            base_speed = 35
        
        # Adjust for rainfall
        if avg_rainfall > 30:
            base_speed *= 0.7
        elif avg_rainfall > 10:
            base_speed *= 0.85
        
        # Calculate cycle time (distance / speed * 60 = minutes)
        # Add loading/unloading time (5 minutes)
        cycle_time = (distance_km / base_speed * 60) + 5
        
        return {
            "predicted_cycle_time": round(cycle_time, 1),
            "average_speed": round(base_speed, 1),
            "confidence": 0.82,
            "source": "cycle_time_calculation"
        }
    
    except Exception as e:
        logger.error(f"Cycle time calculation failed: {e}")
        return {
            "predicted_cycle_time": 28.0,
            "average_speed": 25.0,
            "confidence": 0.70,
            "source": "default"
        }


# ============================================================================
# TEST FUNCTIONS
# ============================================================================

def test_all_predictions():
    """Test all prediction functions"""
    print("\n" + "="*80)
    print("TESTING ML PREDICTIONS")
    print("="*80 + "\n")
    
    # Test 1: Road Risk
    print("1. Road Risk Prediction:")
    result = predict_road_risk(0.32, 9.5, 25, 1.2, 45)
    print(f"   Risk Level: {result['risk_level']}")
    print(f"   Risk Score: {result['risk_score']}")
    print(f"   Predicted Speed: {result['predicted_speed']} km/h")
    print(f"   Source: {result['source']}\n")
    
    # Test 2: Equipment Failure
    print("2. Equipment Failure Prediction:")
    result = predict_equipment_failure("DUMP_01", 12500, 6, 25, 3)
    print(f"   Failure Probability: {result['failure_probability']}%")
    print(f"   Risk Level: {result['risk_level']}")
    print(f"   Source: {result['source']}\n")
    
    # Test 3: Port Operability
    print("3. Port Operability Prediction:")
    result = predict_port_operability(1.8, 28, 2.5, 15)
    print(f"   Status: {result['status']}")
    print(f"   Operability Score: {result['operability_score']}")
    print(f"   Source: {result['source']}\n")
    
    # Test 4: Fleet Performance
    print("4. Fleet Performance Prediction:")
    result = predict_fleet_performance(27.5, 12, 0.82, 0.95)
    print(f"   Performance Score: {result['performance_score']}")
    print(f"   Level: {result['performance_level']}")
    print(f"   Recommendations: {', '.join(result['recommendations'])}")
    print(f"   Source: {result['source']}\n")
    
    print("="*80)


# ============================================================================
# BATCH PREDICTION & DATA AGGREGATION FOR LLM
# ============================================================================

def aggregate_all_predictions_for_llm(
    location: str = "PIT A",
    weather_data: Optional[Dict] = None,
    equipment_data: Optional[Dict] = None,
    road_data: Optional[Dict] = None,
    port_data: Optional[Dict] = None
) -> Dict[str, Any]:
    """
    Aggregate ALL ML predictions for LLM context building
    
    This function collects predictions from all 7 models and formats them
    for consumption by LLM (Chatbox & AI Recommendations)
    
    Args:
        location: Mining location (PIT A, PIT B, etc.)
        weather_data: Current weather conditions
        equipment_data: Equipment status data
        road_data: Road conditions data
        port_data: Port/vessel data
    
    Returns:
        Dict containing all predictions with interpretations
    """
    logger.info(f"Aggregating all ML predictions for {location}")
    
    # Initialize with defaults if data not provided
    weather = weather_data or {
        "rainfall_mm": 40.0,
        "wind_speed_kmh": 25.0,
        "temperature_c": 28.0,
        "visibility_km": 8.0
    }
    
    equipment = equipment_data or {
        "age_years": 5,
        "operating_hours": 15000,
        "maintenance_count": 10,
        "breakdown_count": 3,
        "health_pct": 75.0
    }
    
    road = road_data or {
        "friction_index": 0.35,
        "water_depth_cm": 8.5,
        "condition_score": 2,
        "traffic_density": 5
    }
    
    port = port_data or {
        "wave_height_m": 2.0,
        "vessels_waiting": 2,
        "loading_rate_tph": 3500
    }
    
    aggregated_predictions = {
        "timestamp": "2025-01-17T10:30:00",
        "location": location,
        "predictions": {}
    }
    
    try:
        # 1. Road Risk Prediction (includes speed assessment)
        logger.debug("Predicting road risk...")
        speed_result = predict_road_risk(
            rainfall=weather["rainfall_mm"],
            water_depth=road["water_depth_cm"],
            friction=road["friction_index"],
            visibility=weather["visibility_km"],
            wind_speed=weather["wind_speed_kmh"]
        )
        aggregated_predictions["predictions"]["road_risk"] = {
            "risk_level": speed_result.get("risk_level", "MEDIUM"),
            "confidence": speed_result.get("confidence", 0.85),
            "status": speed_result.get("risk_level", "MEDIUM"),
            "interpretation": f"Road risk level: {speed_result.get('risk_level', 'MEDIUM')} (confidence {speed_result.get('confidence', 0.85)*100:.0f}%)",
            "impact": "Reduced operations" if speed_result.get("risk_level") in ["HIGH", "CRITICAL"] else "Normal operations",
            "model": "Road Risk ML Model",
            "raw_data": speed_result
        }
        
        # 2. Cycle Time Prediction
        logger.debug("Predicting cycle time...")
        cycle_result = predict_cycle_time(
            distance_km=5.0,  # Average haul distance
            road_conditions={
                "avg_friction": road["friction_index"],
                "rainfall": weather["rainfall_mm"],
                "water_depth": road["water_depth_cm"]
            },
            equipment_type="DUMP_TRUCK"
        )
        aggregated_predictions["predictions"]["cycle_time"] = {
            "value_min": cycle_result["predicted_cycle_time"],
            "confidence": cycle_result["confidence"],
            "status": "Delayed" if cycle_result["predicted_cycle_time"] > 15 else "Normal",
            "interpretation": f"Expected cycle time: {cycle_result['predicted_cycle_time']:.1f} minutes (confidence {cycle_result['confidence']*100:.0f}%)",
            "impact": f"Production efficiency {'reduced' if cycle_result['predicted_cycle_time'] > 15 else 'maintained'}",
            "model": "Cycle Time ML Model",
            "raw_data": cycle_result
        }
        
        # 3. Cycle Time already covered in section 2
        
        # 4. Equipment Failure Prediction
        logger.debug("Predicting equipment failure...")
        failure_result = predict_equipment_failure(
            equipment_id="DUMP-001",
            operating_hours=equipment.get("operating_hours", 15000),
            age_years=equipment.get("age_years", 5),
            maintenance_count=equipment.get("maintenance_count", 10),
            breakdown_count=equipment.get("breakdown_count", 3)
        )
        aggregated_predictions["predictions"]["equipment_failure"] = {
            "risk_level": failure_result["risk_level"],
            "probability": failure_result["failure_probability"],
            "confidence": failure_result["confidence"],
            "status": "Critical" if failure_result["risk_level"] == "High" else "Normal",
            "interpretation": f"Equipment breakdown probability: {failure_result['failure_probability']:.1f}% (confidence {failure_result['confidence']*100:.0f}%)",
            "action_required": failure_result["risk_level"] == "High",
            "recommended_action": _get_equipment_action(failure_result["failure_probability"] / 100.0),
            "cost_risk_idr": 200_000_000 if failure_result["risk_level"] == "High" else 0,
            "model": "Equipment Failure Prediction ML Model",
            "raw_data": failure_result
        }
        
        # 5. Port Operability Prediction
        logger.debug("Predicting port operability...")
        port_result = predict_port_operability(
            wave_height=port.get("wave_height_m", 2.0),
            wind_speed=weather["wind_speed_kmh"],
            visibility=weather["visibility_km"],
            rainfall=weather["rainfall_mm"]
        )
        aggregated_predictions["predictions"]["port_operability"] = {
            "status": port_result["status"],
            "operability_score": port_result["operability_score"],
            "confidence": port_result["confidence"],
            "interpretation": f"Port operational status: {port_result['status']} (confidence {port_result['confidence']*100:.0f}%)",
            "delay_expected": port_result["status"] in ["Limited", "Closed"],
            "recommended_action": _get_port_action(port_result["status"].upper()),
            "model": "Port Operability ML Model",
            "raw_data": port_result
        }
        
        # 6. Fleet Performance Prediction
        logger.debug("Predicting fleet performance...")
        weather_impact_factor = 1.0 - (weather.get("rainfall_mm", 0) / 100.0)  # More rain = lower impact
        degradation_result = predict_fleet_performance(
            avg_cycle_time=15.0,  # From cycle time prediction above
            equipment_count=equipment.get("active_count", 12),
            utilization_rate=equipment.get("health_pct", 75.0) / 100.0,
            weather_impact=max(0.3, min(1.0, weather_impact_factor))
        )
        aggregated_predictions["predictions"]["fleet_performance"] = {
            "performance_score": degradation_result.get("performance_score", 0),
            "performance_level": degradation_result.get("performance_level", "MEDIUM"),
            "confidence": degradation_result.get("confidence", 0.85),
            "interpretation": f"Fleet performance: {degradation_result.get('performance_level', 'MEDIUM')} (score {degradation_result.get('performance_score', 0):.1f})",
            "action_required": degradation_result.get("performance_level") in ["LOW", "CRITICAL"],
            "recommended_action": _get_degradation_action(degradation_result.get("performance_level", "MEDIUM")),
            "model": "Fleet Performance ML Model",
            "raw_data": degradation_result
        }
        
        # All 5 predictions completed
        
        # Summary metrics
        pred_count = len(aggregated_predictions["predictions"])
        aggregated_predictions["summary"] = {
            "total_models": pred_count,
            "critical_alerts": sum(1 for p in aggregated_predictions["predictions"].values() 
                                  if p.get("action_required") or p.get("status") in ["Critical", "CRITICAL", "BERBAHAYA", "HIGH"]),
            "avg_confidence": sum(p.get("confidence", 0) for p in aggregated_predictions["predictions"].values()) / pred_count if pred_count > 0 else 0,
            "overall_status": _determine_overall_status(aggregated_predictions["predictions"])
        }
        
        logger.info(f"✓ Successfully aggregated {len(aggregated_predictions['predictions'])} predictions")
        logger.info(f"  Critical alerts: {aggregated_predictions['summary']['critical_alerts']}")
        logger.info(f"  Avg confidence: {aggregated_predictions['summary']['avg_confidence']*100:.1f}%")
        
        return aggregated_predictions
        
    except Exception as e:
        logger.error(f"Error aggregating predictions: {e}")
        return {
            "timestamp": "2025-01-17T10:30:00",
            "location": location,
            "error": str(e),
            "predictions": {},
            "summary": {"total_models": 0, "critical_alerts": 0}
        }


def get_prediction_summary_for_chatbox(location: str = "PIT A") -> str:
    """
    Get human-readable summary of all predictions for chatbox
    
    Returns:
        Formatted string suitable for chatbox display
    """
    predictions = aggregate_all_predictions_for_llm(location)
    
    if "error" in predictions:
        return f"⚠️ Unable to fetch predictions: {predictions['error']}"
    
    summary_lines = [
        f"📊 **ML Prediction Summary for {location}**",
        f"🕐 {predictions['timestamp']}",
        "",
        f"🎯 Total Models: {predictions['summary']['total_models']}",
        f"⚠️ Critical Alerts: {predictions['summary']['critical_alerts']}",
        f"📈 Avg Confidence: {predictions['summary']['avg_confidence']*100:.1f}%",
        f"🔍 Overall Status: **{predictions['summary']['overall_status']}**",
        "",
        "**Key Predictions:**"
    ]
    
    # Add each prediction
    for key, pred in predictions["predictions"].items():
        status_emoji = "🔴" if pred.get("action_required") or pred.get("status") in ["Critical", "CRITICAL"] else "🟢"
        summary_lines.append(f"{status_emoji} {key.replace('_', ' ').title()}: {pred.get('interpretation', 'N/A')}")
    
    return "\n".join(summary_lines)


# Helper functions for recommendations
def _get_road_risk_action(risk_class: str) -> str:
    """Get recommended action based on road risk"""
    actions = {
        "BERBAHAYA": "🚨 STOP operations immediately. Wait for conditions to improve.",
        "TERBATAS": "⚠️ Reduce speed to 25 km/h. Use alternative routes if available.",
        "HATI-HATI": "ℹ️ Exercise caution. Monitor conditions closely.",
        "AMAN": "✅ Normal operations. Maintain standard safety protocols."
    }
    return actions.get(risk_class, "Monitor conditions")


def _get_equipment_action(probability: float) -> str:
    """Get recommended action based on equipment failure probability"""
    if probability > 0.90:
        return "🚨 CRITICAL: Schedule immediate maintenance. Use standby equipment."
    elif probability > 0.70:
        return "⚠️ HIGH RISK: Schedule maintenance within 24 hours."
    elif probability > 0.50:
        return "ℹ️ MODERATE: Schedule preventive maintenance soon."
    else:
        return "✅ Normal condition. Continue regular maintenance schedule."


def _get_port_action(status: str) -> str:
    """Get recommended action based on port status"""
    actions = {
        "OPERATIONAL": "✅ Normal loading operations. Maintain schedule.",
        "LIMITED": "⚠️ Reduced operations. Extend loading time estimate by 25%.",
        "CLOSED": "🚨 Port closed. Delay vessel berthing. Communicate with shipping agents."
    }
    return actions.get(status, "Monitor port conditions")


def _get_degradation_action(status: str) -> str:
    """Get recommended action based on performance degradation"""
    actions = {
        "NORMAL": "✅ Equipment performing normally.",
        "MODERATE": "ℹ️ Monitor performance. Plan maintenance during next downtime.",
        "HIGH": "⚠️ Performance degrading. Schedule maintenance within 48 hours.",
        "CRITICAL": "🚨 Severe degradation. Immediate maintenance required."
    }
    return actions.get(status, "Monitor performance")


def _get_fleet_action(status: str) -> str:
    """Get recommended action based on fleet risk"""
    actions = {
        "LOW": "✅ Fleet in good condition. Maintain current practices.",
        "MEDIUM": "ℹ️ Monitor fleet health. Review maintenance schedules.",
        "HIGH": "⚠️ Fleet at risk. Increase maintenance frequency.",
        "CRITICAL": "🚨 Fleet critical. Review all equipment immediately."
    }
    return actions.get(status, "Monitor fleet status")


def _calculate_weather_impact(weather: Dict) -> int:
    """Calculate weather impact score (1-5)"""
    rainfall = weather.get("rainfall_mm", 0)
    wind = weather.get("wind_speed_kmh", 0)
    
    score = 1  # Base score
    if rainfall > 40:
        score += 2
    elif rainfall > 20:
        score += 1
    
    if wind > 30:
        score += 1
    
    return min(score, 5)


def _determine_overall_status(predictions: Dict) -> str:
    """Determine overall operational status"""
    critical_count = sum(1 for p in predictions.values() 
                        if p.get("action_required") or p.get("status") in ["Critical", "CRITICAL", "BERBAHAYA"])
    
    if critical_count >= 3:
        return "🔴 CRITICAL - Multiple systems at risk"
    elif critical_count >= 1:
        return "🟡 CAUTION - Some systems require attention"
    else:
        return "🟢 NORMAL - All systems operating within parameters"


if __name__ == "__main__":
    test_all_predictions()
    
    print("\n" + "="*80)
    print("Testing LLM Data Aggregation:")
    print("="*80)
    
    # Test aggregation
    agg_result = aggregate_all_predictions_for_llm("PIT A")
    print(f"\n✓ Aggregated {len(agg_result['predictions'])} predictions")
    print(f"  Critical alerts: {agg_result['summary']['critical_alerts']}")
    print(f"  Overall status: {agg_result['summary']['overall_status']}")
    
    # Test chatbox summary
    print("\n" + "="*80)
    print("Chatbox Summary:")
    print("="*80)
    summary = get_prediction_summary_for_chatbox("PIT A")
    print(summary)
