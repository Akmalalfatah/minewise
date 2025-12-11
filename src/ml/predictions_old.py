"""
ML Model Integration Utilities
Helper functions untuk integrate ML predictions ke dalam frontend responses

Author: ML Team
Date: December 9, 2025
"""

import requests
from typing import Dict, Any, List, Optional
import logging
import numpy as np
import pandas as pd
from datetime import datetime

logger = logging.getLogger(__name__)

# ML API Base URL
ML_API_BASE = "http://localhost:8000"

# Timeout untuk ML predictions (seconds)
ML_PREDICTION_TIMEOUT = 5


def call_ml_endpoint(
    endpoint: str, 
    data: Dict[str, Any], 
    method: str = "POST",
    timeout: int = ML_PREDICTION_TIMEOUT
) -> Optional[Dict[str, Any]]:
    """
    Call ML prediction endpoint dengan error handling
    
    Args:
        endpoint: Endpoint path (e.g., '/predict/road-risk')
        data: Request payload
        method: HTTP method (POST or GET)
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
    friction_index: float,
    water_depth: float,
    wind_speed: float,
    visibility: float,
    rainfall: float
) -> Dict[str, Any]:
    """
    Predict road risk level menggunakan ML model
    
    Returns:
        {
            "risk_level": "High" / "Medium" / "Low",
            "risk_score": 0-100,
            "predicted_speed": km/h,
            "confidence": 0-1
        }
    """
    payload = {
        "friction_index": friction_index,
        "water_depth": water_depth,
        "wind_speed": wind_speed,
        "visibility": visibility,
        "rainfall": rainfall
    }
    
    result = call_ml_endpoint("/predict/road-risk", payload)
    
    if result and "prediction" in result:
        pred = result["prediction"]
        return {
            "risk_level": pred.get("risk_level", "Medium"),
            "risk_score": int(pred.get("risk_score", 50)),
            "predicted_speed": int(pred.get("predicted_speed", 30)),
            "confidence": round(pred.get("confidence", 0.75), 2)
        }
    
    # Fallback: rule-based prediction
    risk_score = 0
    if friction_index < 0.3:
        risk_score += 40
    if water_depth > 10:
        risk_score += 30
    if visibility < 2.0:
        risk_score += 20
    if rainfall > 40:
        risk_score += 10
    
    risk_level = "High" if risk_score > 70 else "Medium" if risk_score > 40 else "Low"
    predicted_speed = int(40 * (1 - risk_score / 100))
    
    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "predicted_speed": predicted_speed,
        "confidence": 0.65
    }


def predict_road_speed(
    segment_features: Dict[str, Any]
) -> int:
    """
    Predict optimal speed untuk road segment
    
    Args:
        segment_features: Dict containing road conditions
    
    Returns:
        Predicted speed in km/h
    """
    payload = {
        "friction_index": segment_features.get("friction", 0.4),
        "water_depth": segment_features.get("water_depth", 0),
        "road_width": segment_features.get("road_width", 8),
        "weather_condition": segment_features.get("weather", "Clear")
    }
    
    result = call_ml_endpoint("/predict/road-speed", payload)
    
    if result and "predicted_speed" in result:
        return int(result["predicted_speed"])
    
    # Fallback calculation
    base_speed = 40
    friction = segment_features.get("friction", 0.4)
    water = segment_features.get("water_depth", 0)
    
    speed = base_speed * friction * (1 - water / 50)
    return max(10, int(speed))


# ============================================================================
# EQUIPMENT FAILURE PREDICTIONS
# ============================================================================

def predict_equipment_failure(
    equipment_id: str,
    operating_hours: float,
    maintenance_hours: float,
    equipment_age_months: int,
    recent_failures: int = 0
) -> Dict[str, Any]:
    """
    Predict equipment failure probability
    
    Returns:
        {
            "failure_probability": 0-100,
            "risk_level": "High" / "Medium" / "Low",
            "recommended_action": str,
            "estimated_mtbf_hours": int
        }
    """
    payload = {
        "equipment_id": equipment_id,
        "operating_hours": operating_hours,
        "maintenance_hours": maintenance_hours,
        "equipment_age_months": equipment_age_months,
        "recent_failures": recent_failures
    }
    
    result = call_ml_endpoint("/predict/equipment-failure", payload)
    
    if result and "prediction" in result:
        pred = result["prediction"]
        return {
            "failure_probability": int(pred.get("failure_probability", 25)),
            "risk_level": pred.get("risk_level", "Medium"),
            "recommended_action": pred.get("recommended_action", "Monitor"),
            "estimated_mtbf_hours": int(pred.get("mtbf_hours", 200))
        }
    
    # Fallback: simple heuristic
    # High operating hours + low maintenance = higher risk
    utilization_ratio = operating_hours / (operating_hours + maintenance_hours + 1)
    age_factor = min(equipment_age_months / 60, 1.0)  # Normalize to 5 years
    
    failure_prob = int(
        (utilization_ratio * 40) + 
        (age_factor * 30) + 
        (recent_failures * 10)
    )
    failure_prob = min(failure_prob, 100)
    
    if failure_prob > 70:
        risk_level = "High"
        action = "Schedule immediate maintenance"
    elif failure_prob > 40:
        risk_level = "Medium"
        action = "Plan maintenance within 7 days"
    else:
        risk_level = "Low"
        action = "Continue monitoring"
    
    return {
        "failure_probability": failure_prob,
        "risk_level": risk_level,
        "recommended_action": action,
        "estimated_mtbf_hours": int(200 * (1 - failure_prob / 100))
    }


# ============================================================================
# PORT OPERABILITY PREDICTIONS
# ============================================================================

def predict_port_operability(
    wave_height: float,
    wind_speed: float,
    visibility: float,
    rainfall: float,
    date: Optional[str] = None
) -> Dict[str, Any]:
    """
    Predict port operability status
    
    Returns:
        {
            "operability_score": 0-100,
            "status": "Operational" / "Limited" / "Closed",
            "delay_risk": bool,
            "estimated_delay_hours": float
        }
    """
    payload = {
        "wave_height": wave_height,
        "wind_speed": wind_speed,
        "visibility": visibility,
        "rainfall": rainfall
    }
    
    if date:
        payload["date"] = date
    
    result = call_ml_endpoint("/predict/port-operability", payload)
    
    if result and "prediction" in result:
        pred = result["prediction"]
        return {
            "operability_score": int(pred.get("operability_score", 75)),
            "status": pred.get("status", "Operational"),
            "delay_risk": pred.get("delay_risk", False),
            "estimated_delay_hours": round(pred.get("estimated_delay", 0), 1)
        }
    
    # Fallback calculation
    operability = 100
    
    # Deduct based on conditions
    if wind_speed > 25:
        operability -= 30
    if visibility < 2.0:
        operability -= 25
    if rainfall > 40:
        operability -= 20
    if wave_height > 2.0:
        operability -= 25
    
    operability = max(0, operability)
    
    if operability > 70:
        status = "Operational"
        delay_risk = False
        delay_hours = 0
    elif operability > 40:
        status = "Limited"
        delay_risk = True
        delay_hours = 2.5
    else:
        status = "Closed"
        delay_risk = True
        delay_hours = 8.0
    
    return {
        "operability_score": operability,
        "status": status,
        "delay_risk": delay_risk,
        "estimated_delay_hours": delay_hours
    }


# ============================================================================
# PRODUCTION FORECAST
# ============================================================================

def predict_production_output(
    location: str,
    weather_conditions: Dict[str, Any],
    equipment_count: int,
    historical_avg: float
) -> Dict[str, Any]:
    """
    Predict production output berdasarkan kondisi saat ini
    
    Returns:
        {
            "predicted_tonnage": float,
            "confidence_interval": (lower, upper),
            "factors": List[str]
        }
    """
    payload = {
        "location": location,
        "rainfall": weather_conditions.get("rainfall", 0),
        "wind_speed": weather_conditions.get("wind_speed", 0),
        "visibility": weather_conditions.get("visibility", 5),
        "equipment_count": equipment_count,
        "historical_avg": historical_avg
    }
    
    result = call_ml_endpoint("/predict/production-forecast", payload)
    
    if result and "prediction" in result:
        pred = result["prediction"]
        return {
            "predicted_tonnage": round(pred.get("tonnage", historical_avg), 1),
            "confidence_interval": (
                round(pred.get("lower_bound", historical_avg * 0.9), 1),
                round(pred.get("upper_bound", historical_avg * 1.1), 1)
            ),
            "factors": pred.get("impact_factors", [])
        }
    
    # Fallback: adjust based on weather
    rainfall = weather_conditions.get("rainfall", 0)
    visibility = weather_conditions.get("visibility", 5)
    
    adjustment = 1.0
    factors = []
    
    if rainfall > 40:
        adjustment *= 0.85
        factors.append("Heavy rainfall reduces productivity by 15%")
    elif rainfall > 20:
        adjustment *= 0.95
        factors.append("Moderate rainfall reduces productivity by 5%")
    
    if visibility < 2.0:
        adjustment *= 0.90
        factors.append("Low visibility reduces productivity by 10%")
    
    if equipment_count < 10:
        adjustment *= 0.95
        factors.append("Limited equipment availability")
    
    predicted = historical_avg * adjustment
    
    return {
        "predicted_tonnage": round(predicted, 1),
        "confidence_interval": (
            round(predicted * 0.92, 1),
            round(predicted * 1.08, 1)
        ),
        "factors": factors if factors else ["Optimal conditions"]
    }


# ============================================================================
# CYCLE TIME PREDICTION
# ============================================================================

def predict_cycle_time(
    distance_km: float,
    road_conditions: Dict[str, Any],
    equipment_type: str = "Dump Truck"
) -> Dict[str, Any]:
    """
    Predict cycle time untuk hauling operation
    
    Returns:
        {
            "predicted_minutes": float,
            "speed_kmh": float,
            "delays_minutes": float
        }
    """
    payload = {
        "distance_km": distance_km,
        "friction_index": road_conditions.get("friction", 0.4),
        "water_depth": road_conditions.get("water_depth", 0),
        "equipment_type": equipment_type
    }
    
    result = call_ml_endpoint("/predict/cycle-time", payload)
    
    if result and "prediction" in result:
        pred = result["prediction"]
        return {
            "predicted_minutes": round(pred.get("cycle_time", 20), 1),
            "speed_kmh": round(pred.get("average_speed", 30), 1),
            "delays_minutes": round(pred.get("delays", 2), 1)
        }
    
    # Fallback calculation
    friction = road_conditions.get("friction", 0.4)
    water = road_conditions.get("water_depth", 0)
    
    # Base speed adjusted for conditions
    base_speed = 35
    adjusted_speed = base_speed * friction * (1 - water / 50)
    adjusted_speed = max(15, adjusted_speed)
    
    # Calculate time
    travel_time = (distance_km / adjusted_speed) * 60  # Convert to minutes
    loading_time = 5  # Fixed loading time
    delays = 2 if water > 5 else 0
    
    total_time = travel_time + loading_time + delays
    
    return {
        "predicted_minutes": round(total_time, 1),
        "speed_kmh": round(adjusted_speed, 1),
        "delays_minutes": delays
    }


# ============================================================================
# BATCH PREDICTIONS
# ============================================================================

def predict_fleet_performance(
    equipment_list: List[Dict[str, Any]],
    weather_conditions: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Predict overall fleet performance
    
    Returns summary statistics dan risk assessment
    """
    total_equipment = len(equipment_list)
    
    # Predict failure risk untuk each equipment
    high_risk = 0
    medium_risk = 0
    low_risk = 0
    
    for equipment in equipment_list:
        pred = predict_equipment_failure(
            equipment_id=equipment.get("id", "UNKNOWN"),
            operating_hours=equipment.get("operating_hours", 100),
            maintenance_hours=equipment.get("maintenance_hours", 10),
            equipment_age_months=equipment.get("age_months", 24),
            recent_failures=equipment.get("recent_failures", 0)
        )
        
        risk = pred["risk_level"]
        if risk == "High":
            high_risk += 1
        elif risk == "Medium":
            medium_risk += 1
        else:
            low_risk += 1
    
    # Overall fleet health score
    fleet_health = int(
        (low_risk / total_equipment * 100 * 0.7) +
        (medium_risk / total_equipment * 100 * 0.3)
    )
    
    return {
        "total_equipment": total_equipment,
        "fleet_health_score": fleet_health,
        "risk_distribution": {
            "high": high_risk,
            "medium": medium_risk,
            "low": low_risk
        },
        "recommended_actions": [
            f"{high_risk} units require immediate attention" if high_risk > 0 else None,
            f"{medium_risk} units need scheduled maintenance" if medium_risk > 0 else None,
            f"Fleet operating at {fleet_health}% health" if fleet_health < 80 else None
        ]
    }


# ============================================================================
# TEST FUNCTIONS
# ============================================================================

def test_ml_predictions():
    """Test all ML prediction functions"""
    print("Testing ML Prediction Integration...")
    print("=" * 80)
    
    # Test 1: Road Risk
    print("\n1. Road Risk Prediction:")
    road_risk = predict_road_risk(
        friction_index=0.32,
        water_depth=9.5,
        wind_speed=25,
        visibility=1.2,
        rainfall=45
    )
    print(f"   Risk Level: {road_risk['risk_level']}")
    print(f"   Risk Score: {road_risk['risk_score']}")
    print(f"   Predicted Speed: {road_risk['predicted_speed']} km/h")
    
    # Test 2: Equipment Failure
    print("\n2. Equipment Failure Prediction:")
    equipment_risk = predict_equipment_failure(
        equipment_id="ALAT_01",
        operating_hours=180,
        maintenance_hours=20,
        equipment_age_months=36,
        recent_failures=1
    )
    print(f"   Failure Probability: {equipment_risk['failure_probability']}%")
    print(f"   Risk Level: {equipment_risk['risk_level']}")
    print(f"   Action: {equipment_risk['recommended_action']}")
    
    # Test 3: Port Operability
    print("\n3. Port Operability Prediction:")
    port_status = predict_port_operability(
        wave_height=1.8,
        wind_speed=28,
        visibility=1.5,
        rainfall=42
    )
    print(f"   Status: {port_status['status']}")
    print(f"   Operability Score: {port_status['operability_score']}")
    print(f"   Delay Risk: {port_status['delay_risk']}")
    
    # Test 4: Production Forecast
    print("\n4. Production Forecast:")
    prod_forecast = predict_production_output(
        location="PIT A",
        weather_conditions={"rainfall": 35, "wind_speed": 20, "visibility": 2.5},
        equipment_count=12,
        historical_avg=1500
    )
    print(f"   Predicted: {prod_forecast['predicted_tonnage']} tons")
    print(f"   Range: {prod_forecast['confidence_interval']}")
    print(f"   Factors: {prod_forecast['factors']}")
    
    print("\n" + "=" * 80)
    print("ML Prediction tests completed!")


if __name__ == "__main__":
    test_ml_predictions()
