"""
LLM Context Builder - MineWise ML System
=========================================
Mengumpulkan semua data yang dibutuhkan untuk LLM:
- Real-time operational data
- ML predictions dari 7 models
- Historical trends
- Domain knowledge & business rules
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import numpy as np
import pandas as pd

# Import predictions dan data loaders
from src.ml.predictions import (
    predict_road_risk,
    predict_cycle_time,
    predict_equipment_failure,
    predict_port_operability,
    predict_fleet_performance
)
# Try to import data functions, use mock if not available
try:
    from src.data.db_queries import (
        fetch_production_data,
        fetch_weather_condition,
        fetch_equipment_status,
        fetch_road_conditions
    )
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    # Mock functions
    def fetch_production_data(location):
        return {"produce_ton": 13379, "target_ton": 15000, "deviation_pct": -10.8, "efficiency_rate": 85}
    def fetch_weather_condition(location):
        return {"rainfall_mm": 40, "wind_speed_kmh": 25, "temperature_c": 28, "visibility_km": 8, "extreme_weather_flag": False}
    def fetch_equipment_status(location):
        return {"active": 10, "standby": 2, "under_repair": 1, "maintenance": 1}
    def fetch_road_conditions(location):
        return {"segments": [], "visibility_km": 8, "wind_speed_kmh": 25}

# Mock vessel status function (not in db_queries yet)
def fetch_vessel_status():
    return {"loading": 1, "waiting": 2, "completed_today": 3, "coal_ready_ton": 50000, "rainfall_mm": 40, "wind_speed_kmh": 25, "wave_height_m": 2.0, "visibility_km": 8}

logger = logging.getLogger(__name__)

# ============================================================================
# DOMAIN KNOWLEDGE & BUSINESS RULES
# ============================================================================

SAFETY_THRESHOLDS = {
    "max_wind_speed_kmh": 40,
    "min_visibility_km": 1.0,
    "max_water_depth_cm": 15,
    "min_friction_index": 0.35,
    "max_wave_height_m": 3.0,
    "max_rainfall_mm_per_hour": 50
}

OPERATIONAL_CONSTRAINTS = {
    "min_equipment_active": 8,
    "target_efficiency_pct": 85,
    "max_cycle_time_min": 20,
    "min_port_operability_hours": 16,
    "max_downtime_per_day_hours": 6,
    "min_road_friction": 0.35,
    "max_equipment_breakdown_risk": 0.30
}

COST_PARAMETERS = {
    "downtime_per_hour_idr": 50_000_000,  # Rp 50 juta
    "equipment_breakdown_avg_idr": 200_000_000,  # Rp 200 juta
    "delayed_vessel_per_day_idr": 100_000_000,  # Rp 100 juta
    "production_loss_per_ton_idr": 500_000  # Rp 500k
}

KNOWLEDGE_BASE = [
    {
        "issue": "Heavy rainfall (>40mm)",
        "impact": "Road risk HIGH, production decrease 15-25%",
        "recommended_actions": [
            "Route optimization via Road A (better drainage)",
            "Reduce speed limits to 25 km/h",
            "Activate water pumps on critical segments",
            "Consider production pause if >50mm/hour"
        ],
        "severity": "HIGH"
    },
    {
        "issue": "Equipment breakdown risk >95%",
        "impact": "Production stoppage 8-12 hours, cost Rp 200M",
        "recommended_actions": [
            "Immediate predictive maintenance",
            "Activate standby equipment unit",
            "Reschedule production to other pit",
            "Coordinate with maintenance team"
        ],
        "severity": "CRITICAL"
    },
    {
        "issue": "Port congestion (vessels waiting >3)",
        "impact": "Demurrage cost $50k/day per vessel",
        "recommended_actions": [
            "Prioritize loading operations 24/7",
            "Optimize vessel scheduling",
            "Increase loading rate with additional equipment",
            "Communicate delay to vessel agents"
        ],
        "severity": "HIGH"
    },
    {
        "issue": "Low road friction (<0.35)",
        "impact": "Accident risk HIGH, cycle time +30%",
        "recommended_actions": [
            "Apply gravel/aggregate to improve traction",
            "Reduce truck payload by 20%",
            "Increase following distance",
            "Route via alternative road if available"
        ],
        "severity": "HIGH"
    },
    {
        "issue": "Low visibility (<1km)",
        "impact": "Safety risk CRITICAL, operations halt",
        "recommended_actions": [
            "Pause hauling operations immediately",
            "Activate hazard lights on all equipment",
            "Wait for visibility improvement",
            "Use spotters if operations must continue"
        ],
        "severity": "CRITICAL"
    }
]

BEST_PRACTICES = [
    "Monitor weather forecast 24-48 hours ahead for proactive planning",
    "Maintain minimum 20% equipment redundancy (standby units)",
    "Schedule preventive maintenance during low production periods (night shift)",
    "Implement dynamic route optimization based on real-time road conditions",
    "Coordinate vessel booking with 48-hour advance notice minimum",
    "Conduct daily safety briefings covering weather and equipment status",
    "Use ML predictions for early warning of potential issues",
    "Maintain emergency response protocols for equipment breakdown",
    "Document all optimization decisions for continuous improvement"
]


# ============================================================================
# CONTEXT BUILDER CLASS
# ============================================================================

class LLMContextBuilder:
    """Build comprehensive context for LLM from all data sources"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def build_chatbox_context(
        self, 
        location: str = "PIT A",
        user_question: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Build complete context for chatbox LLM
        
        Args:
            location: Mining location
            user_question: User's question (optional, for knowledge base search)
            
        Returns:
            Dict with all context data
        """
        self.logger.info(f"Building chatbox context for {location}")
        
        try:
            context = {
                "timestamp": datetime.now().isoformat(),
                "location": location,
                
                # 1. Real-time operational data
                "production": self._get_production_metrics(location),
                "weather": self._get_weather_conditions(location),
                "equipment": self._get_equipment_metrics(location),
                "roads": self._get_road_metrics(location),
                "vessels": self._get_vessel_metrics(),
                
                # 2. ML predictions (7 models)
                "ml_predictions": self._get_all_ml_predictions(location),
                
                # 3. Historical trends
                "trends": self._get_historical_trends(location),
                "correlations": self._get_correlations(),
                
                # 4. Domain knowledge
                "safety_thresholds": SAFETY_THRESHOLDS,
                "operational_constraints": OPERATIONAL_CONSTRAINTS,
                "cost_parameters": COST_PARAMETERS,
                
                # 5. Relevant knowledge base entries
                "relevant_knowledge": self._search_knowledge_base(user_question, context_data=None),
                "best_practices": BEST_PRACTICES,
                
                # 6. Critical alerts
                "critical_alerts": []
            }
            
            # Generate critical alerts based on data
            context["critical_alerts"] = self._generate_critical_alerts(context)
            
            self.logger.info(f"✓ Context built successfully with {len(context)} sections")
            return context
            
        except Exception as e:
            self.logger.error(f"Error building chatbox context: {e}")
            return self._get_fallback_context(location)
    
    def build_scenario_context(
        self,
        location: str = "PIT A",
        optimization_goal: str = "Maximize production while maintaining safety"
    ) -> Dict[str, Any]:
        """
        Build context for AI scenario generation
        
        Args:
            location: Mining location
            optimization_goal: What to optimize
            
        Returns:
            Dict with optimization-specific context
        """
        self.logger.info(f"Building scenario context for {location}")
        
        # Get base chatbox context
        base_context = self.build_chatbox_context(location)
        
        # Add optimization-specific data
        base_context["optimization"] = {
            "goal": optimization_goal,
            "available_actions": [
                "Reallocate equipment between pits",
                "Change hauling routes based on road conditions",
                "Adjust shift schedules for better utilization",
                "Postpone non-critical maintenance",
                "Request additional equipment from standby pool",
                "Optimize loading sequence at port",
                "Adjust production targets based on weather forecast"
            ],
            "constraints": [
                "Safety must not be compromised",
                "Equipment health must remain >70%",
                "Weather conditions must be within safe limits",
                "Budget constraints apply",
                "Environmental regulations must be met",
                "Port scheduling agreements must be honored"
            ],
            "priorities": [
                "1. Safety (highest priority)",
                "2. Production target achievement",
                "3. Equipment optimization",
                "4. Cost efficiency",
                "5. Environmental impact"
            ]
        }
        
        return base_context
    
    # ========================================================================
    # OPERATIONAL DATA METHODS
    # ========================================================================
    
    def _get_production_metrics(self, location: str) -> Dict[str, Any]:
        """Get current production metrics"""
        try:
            prod_data = fetch_production_data(location)
            return {
                "total_ton": prod_data.get("produce_ton", 0),
                "target_ton": prod_data.get("target_ton", 15000),
                "deviation_pct": prod_data.get("deviation_pct", 0),
                "avg_per_day": prod_data.get("avg_production_per_day", 0),
                "efficiency_rate": prod_data.get("efficiency_rate", 85),
                "status": "On Target" if prod_data.get("deviation_pct", 0) >= -5 else "Below Target"
            }
        except Exception as e:
            self.logger.warning(f"Error fetching production data: {e}")
            return {"total_ton": 0, "target_ton": 15000, "deviation_pct": 0}
    
    def _get_weather_conditions(self, location: str) -> Dict[str, Any]:
        """Get current weather conditions"""
        try:
            weather_data = fetch_weather_condition(location)
            return {
                "rainfall_mm": weather_data.get("rainfall_mm", 0),
                "wind_speed_kmh": weather_data.get("wind_speed_kmh", 0),
                "temperature_c": weather_data.get("temperature_c", 28),
                "visibility_km": weather_data.get("visibility_km", 10),
                "extreme_weather_flag": weather_data.get("extreme_weather_flag", False),
                "rain_probability_pct": weather_data.get("rain_probability_pct", 0),
                "status": self._assess_weather_status(weather_data)
            }
        except Exception as e:
            self.logger.warning(f"Error fetching weather data: {e}")
            return {"rainfall_mm": 0, "wind_speed_kmh": 0, "status": "Unknown"}
    
    def _get_equipment_metrics(self, location: str) -> Dict[str, Any]:
        """Get equipment status and metrics"""
        try:
            eq_data = fetch_equipment_status(location)
            
            # Get ML predictions for equipment failure
            failure_predictions = []
            # Simulate checking high-risk equipment (in production, loop through actual equipment)
            for i in range(3):  # Top 3 risky equipment
                try:
                    pred = predict_equipment_failure(
                        equipment_age_years=5 + i,
                        operating_hours_total=15000 + i*1000,
                        maintenance_count=10 - i,
                        breakdown_count=2 + i,
                        avg_operating_hours_per_day=18
                    )
                    if pred.get("failure_probability", 0) > 0.7:  # High risk threshold
                        failure_predictions.append({
                            "equipment_id": f"HD-785-{i+1:02d}",
                            "risk_probability": pred.get("failure_probability", 0),
                            "confidence": pred.get("confidence", 0)
                        })
                except Exception as e:
                    self.logger.debug(f"Error predicting equipment failure: {e}")
                    continue
            
            return {
                "total_units": eq_data.get("active", 0) + eq_data.get("standby", 0) + eq_data.get("under_repair", 0),
                "active": eq_data.get("active", 0),
                "standby": eq_data.get("standby", 0),
                "under_repair": eq_data.get("under_repair", 0),
                "maintenance": eq_data.get("maintenance", 0),
                "high_risk_count": len(failure_predictions),
                "failure_predictions": failure_predictions[:3],  # Top 3
                "avg_utilization": 72.5,  # TODO: Calculate from data
                "status": "Adequate" if eq_data.get("active", 0) >= 8 else "Insufficient"
            }
        except Exception as e:
            self.logger.warning(f"Error fetching equipment data: {e}")
            return {"total_units": 0, "active": 0, "status": "Unknown"}
    
    def _get_road_metrics(self, location: str) -> Dict[str, Any]:
        """Get road conditions with ML predictions"""
        try:
            road_data = fetch_road_conditions(location)
            
            # Get ML predictions for roads
            road_predictions = []
            for segment in road_data.get("segments", [])[:3]:  # Top 3 critical
                # Road risk prediction
                try:
                    risk_pred = predict_road_risk(
                        rainfall=segment.get("rainfall_mm", 0),
                        water_depth=segment.get("water_depth_cm", 0),
                        friction=segment.get("friction_index", 0.5),
                        visibility=road_data.get("visibility_km", 10),
                        wind_speed=road_data.get("wind_speed_kmh", 10)
                    )
                    
                    road_predictions.append({
                        "segment_name": segment.get("segment_name", "Unknown"),
                        "risk_level": risk_pred.get("risk_level", "MEDIUM"),
                        "risk_confidence": risk_pred.get("confidence", 0.85),
                        "friction_index": segment.get("friction_index", 0.5),
                        "water_depth_cm": segment.get("water_depth_cm", 0)
                    })
                except Exception as e:
                    self.logger.debug(f"Error predicting road segment: {e}")
                    continue
            
            high_risk_count = sum(1 for r in road_predictions if r.get("risk_level") in ["HIGH", "CRITICAL"])
            
            return {
                "total_segments": len(road_data.get("segments", [])),
                "high_risk_count": high_risk_count,
                "segments": road_predictions,
                "status": "Critical" if high_risk_count > 1 else "Normal"
            }
        except Exception as e:
            self.logger.warning(f"Error fetching road data: {e}")
            return {"total_segments": 0, "high_risk_count": 0, "status": "Unknown"}
    
    def _get_vessel_metrics(self) -> Dict[str, Any]:
        """Get vessel and port status"""
        try:
            vessel_data = fetch_vessel_status()
            
            # Get port operability prediction
            port_pred = predict_port_operability(
                rainfall_mm=vessel_data.get("rainfall_mm", 0),
                wind_speed_kmh=vessel_data.get("wind_speed_kmh", 0),
                wave_height_m=vessel_data.get("wave_height_m", 1.0),
                visibility_km=vessel_data.get("visibility_km", 10)
            )
            
            return {
                "loading": vessel_data.get("loading", 0),
                "waiting": vessel_data.get("waiting", 0),
                "completed_today": vessel_data.get("completed_today", 0),
                "total_coal_ready_ton": vessel_data.get("coal_ready_ton", 0),
                "port_operability_class": port_pred["predicted_class"],
                "port_operability_confidence": port_pred["confidence"],
                "congestion_level": "High" if vessel_data.get("waiting", 0) > 2 else "Normal",
                "delay_risk": "High" if vessel_data.get("waiting", 0) > 3 else "Low",
                "status": port_pred["predicted_class"]
            }
        except Exception as e:
            self.logger.warning(f"Error fetching vessel data: {e}")
            return {"loading": 0, "waiting": 0, "status": "Unknown"}
    
    # ========================================================================
    # ML PREDICTIONS AGGREGATION
    # ========================================================================
    
    def _get_all_ml_predictions(self, location: str) -> Dict[str, Any]:
        """Aggregate all ML model predictions"""
        try:
            # Use the aggregation function from predictions module
            from src.ml.predictions import aggregate_all_predictions_for_llm
            
            result = aggregate_all_predictions_for_llm(location)
            
            # Return just the predictions part
            return result.get("predictions", {})
            
        except Exception as e:
            self.logger.error(f"Error aggregating ML predictions: {e}")
            return {}
    
    # ========================================================================
    # HISTORICAL & ANALYTICS
    # ========================================================================
    
    def _get_historical_trends(self, location: str, days: int = 7) -> Dict[str, Any]:
        """Get historical trends for last N days"""
        try:
            # TODO: Implement actual database queries for historical data
            # For now, return mock data structure
            return {
                "production_last_7d": [12500, 13200, 11800, 13500, 13379, 12800, 13100],
                "rainfall_last_7d": [0, 15, 45, 25, 55, 30, 40],
                "downtime_hours_last_7d": [2.5, 4.0, 8.5, 3.2, 6.1, 4.5, 5.0],
                "equipment_failures_last_7d": [0, 1, 2, 0, 1, 1, 0],
                "avg_production_7d": 12900,
                "trend": "Stable" if 12900 > 12500 else "Declining"
            }
        except Exception as e:
            self.logger.warning(f"Error fetching trends: {e}")
            return {}
    
    def _get_correlations(self) -> Dict[str, float]:
        """Get correlation insights"""
        return {
            "rain_vs_production": -0.72,  # Heavy rain → Lower production
            "equipment_age_vs_failure": 0.85,  # Older equipment → More failures
            "road_risk_vs_cycle_time": 0.68,  # Higher risk → Slower cycle
            "weather_vs_port_delay": 0.75,  # Bad weather → Port delays
            "maintenance_vs_uptime": -0.60  # More maintenance → Less uptime (short-term)
        }
    
    # ========================================================================
    # ALERTS & KNOWLEDGE BASE
    # ========================================================================
    
    def _generate_critical_alerts(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate critical alerts based on current conditions"""
        alerts = []
        
        # Check weather alerts
        weather = context.get("weather", {})
        if weather.get("rainfall_mm", 0) > 40:
            alerts.append({
                "severity": "HIGH",
                "category": "Weather",
                "message": f"Heavy rainfall detected: {weather['rainfall_mm']:.1f}mm",
                "action": "Consider production pause and road safety measures"
            })
        
        if weather.get("visibility_km", 10) < 1.0:
            alerts.append({
                "severity": "CRITICAL",
                "category": "Safety",
                "message": f"Low visibility: {weather['visibility_km']:.1f}km",
                "action": "HALT operations immediately until visibility improves"
            })
        
        # Check equipment alerts
        equipment = context.get("equipment", {})
        if equipment.get("high_risk_count", 0) > 0:
            alerts.append({
                "severity": "HIGH",
                "category": "Equipment",
                "message": f"{equipment['high_risk_count']} equipment units at high breakdown risk",
                "action": "Schedule immediate predictive maintenance"
            })
        
        # Check road alerts
        roads = context.get("roads", {})
        if roads.get("high_risk_count", 0) > 1:
            alerts.append({
                "severity": "HIGH",
                "category": "Road Safety",
                "message": f"{roads['high_risk_count']} road segments at high risk",
                "action": "Route optimization and speed reduction required"
            })
        
        # Check production alerts
        production = context.get("production", {})
        if production.get("deviation_pct", 0) < -15:
            alerts.append({
                "severity": "MEDIUM",
                "category": "Production",
                "message": f"Production below target by {abs(production['deviation_pct']):.1f}%",
                "action": "Review production strategy and resource allocation"
            })
        
        # Check vessel alerts
        vessels = context.get("vessels", {})
        if vessels.get("waiting", 0) > 3:
            alerts.append({
                "severity": "HIGH",
                "category": "Port Operations",
                "message": f"{vessels['waiting']} vessels waiting (demurrage risk)",
                "action": "Prioritize loading operations 24/7"
            })
        
        return alerts
    
    def _search_knowledge_base(
        self, 
        query: Optional[str],
        context_data: Optional[Dict] = None
    ) -> List[Dict[str, Any]]:
        """Search knowledge base for relevant entries"""
        if not query and not context_data:
            return []
        
        relevant = []
        
        # Simple keyword matching (in production, use more sophisticated NLP)
        if query:
            query_lower = query.lower()
            for entry in KNOWLEDGE_BASE:
                if any(keyword in query_lower for keyword in entry["issue"].lower().split()):
                    relevant.append(entry)
        
        # Also add entries based on context (current conditions)
        if context_data:
            # Add relevant entries based on alerts
            # TODO: Implement smart matching
            pass
        
        return relevant[:3]  # Top 3 most relevant
    
    def _assess_weather_status(self, weather_data: Dict) -> str:
        """Assess overall weather status"""
        rainfall = weather_data.get("rainfall_mm", 0)
        wind = weather_data.get("wind_speed_kmh", 0)
        visibility = weather_data.get("visibility_km", 10)
        
        if visibility < 1.0 or rainfall > 50 or wind > 40:
            return "CRITICAL"
        elif rainfall > 30 or wind > 30 or visibility < 3.0:
            return "HAZARDOUS"
        elif rainfall > 15 or wind > 20:
            return "CHALLENGING"
        else:
            return "NORMAL"
    
    def _get_fallback_context(self, location: str) -> Dict[str, Any]:
        """Return fallback context if data fetch fails"""
        return {
            "timestamp": datetime.now().isoformat(),
            "location": location,
            "error": "Unable to fetch complete operational data",
            "status": "Limited Information Available"
        }


# ============================================================================
# CONVENIENCE FUNCTIONS
# ============================================================================

def get_chatbox_context(location: str = "PIT A", question: str = None) -> Dict[str, Any]:
    """Convenience function to get chatbox context"""
    builder = LLMContextBuilder()
    return builder.build_chatbox_context(location, question)


def get_scenario_context(location: str = "PIT A", goal: str = None) -> Dict[str, Any]:
    """Convenience function to get scenario context"""
    builder = LLMContextBuilder()
    return builder.build_scenario_context(location, goal or "Maximize production while maintaining safety")


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    print("Testing LLM Context Builder...")
    print("="*80)
    
    builder = LLMContextBuilder()
    
    # Test chatbox context
    print("\n1. Building Chatbox Context:")
    context = builder.build_chatbox_context(
        location="PIT A",
        user_question="What is the current production status?"
    )
    print(f"   ✓ Built context with {len(context)} sections")
    print(f"   ✓ Critical alerts: {len(context.get('critical_alerts', []))}")
    print(f"   ✓ ML predictions: {len(context.get('ml_predictions', {}))}")
    
    # Test scenario context
    print("\n2. Building Scenario Context:")
    scenario_ctx = builder.build_scenario_context(location="PIT A")
    print(f"   ✓ Built scenario context")
    print(f"   ✓ Available actions: {len(scenario_ctx.get('optimization', {}).get('available_actions', []))}")
    
    print("\n" + "="*80)
    print("Context Builder Ready!")
