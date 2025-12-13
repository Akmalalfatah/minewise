"""
Frontend-Compatible API Endpoints
Endpoints yang match dengan contract JSON dari frontend team

Author: ML Team
Date: December 9, 2025
"""

from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import random
import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api", tags=["Frontend Integration"])
logger = logging.getLogger(__name__)
# =============================================================================
# Import ML Predictions (existing)
# =============================================================================
try:
    from src.ml.predictions import (
        predict_road_risk,
        predict_equipment_failure,
        predict_port_operability,
        predict_fleet_performance,
        predict_cycle_time,
    )
    ML_AVAILABLE = True
except Exception as e:
    ML_AVAILABLE = False
    logging.warning(f"ML predictions not available. Using fallback logic. Detail: {e}")

# =============================================================================
# ✅ Import Simulation Engine (REAL ML)
# =============================================================================
try:
    # wajib: fungsi ini yang nanti kamu isi beneran pakai model
    from src.ai.simulation_engine import run_simulation_ml
    SIM_ENGINE_AVAILABLE = True
except Exception as e:
    SIM_ENGINE_AVAILABLE = False
    logging.warning(f"Simulation engine not available: {e}")

# =============================================================================
# Request Models
# =============================================================================
class DashboardRequest(BaseModel):
    location: str = Field(default="PIT A", description="Source location (PIT A, PIT B, etc)")
    date: Optional[str] = Field(default=None, description="Date filter (YYYY-MM-DD)")


class MinePlannerRequest(BaseModel):
    area: str = Field(default="PIT A", description="Mining area")
    date: Optional[str] = Field(default=None, description="Date for planning")


class ShippingPlannerRequest(BaseModel):
    location: str = Field(default="PIT A", description="Port location")
    date: Optional[str] = Field(default=None, description="Date filter")


class ChatboxRequest(BaseModel):
    human_answer: str = Field(..., description="User question")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Additional context")


class SimulationAnalysisRequest(BaseModel):
    expected_rainfall_mm: float = Field(50, ge=0, le=500)
    equipment_health_pct: float = Field(80, ge=0, le=100)
    vessel_delay_hours: float = Field(5, ge=0, le=72)



# =============================================================================
# Helper Functions - Dashboard (dynamic mock + optional ML)
# =============================================================================
def get_weather_condition(location: str = "PIT A") -> Dict[str, Any]:
    rain_prob = random.randint(15, 85)
    wind_speed = random.randint(10, 35)
    visibility = round(random.uniform(0.8, 5.0), 1)

    extreme = (rain_prob > 60) or (wind_speed > 28) or (visibility < 2.0)

    return {
        "rain_probability_pct": rain_prob,
        "wind_speed_kmh": wind_speed,
        "visibility_km": visibility,
        "extreme_weather_flag": extreme,
        "source_location": location,
    }


def get_production_data(location: str = "PIT A", date: Optional[str] = None) -> Dict[str, Any]:
    target = 15000
    weather = get_weather_condition(location)
    equipment_count = random.randint(10, 15)

    rainfall_mm = weather["rain_probability_pct"] / 2.0
    weather_impact = 1.0

    if rainfall_mm > 50:
        weather_impact = 0.70
    elif rainfall_mm > 20:
        weather_impact = 0.85
    elif rainfall_mm > 5:
        weather_impact = 0.95

    if weather["visibility_km"] < 1.0:
        weather_impact *= 0.85
    elif weather["visibility_km"] < 2.0:
        weather_impact *= 0.93

    equipment_factor = min(equipment_count / 12.0, 1.1)
    actual = int(target * weather_impact * equipment_factor * random.uniform(0.95, 1.02))

    deviation = round(((actual - target) / target) * 100, 1)
    avg_daily = round(actual / 7, 0)

    return {
        "produce_ton": actual,
        "target_ton": target,
        "avg_production_per_day": int(avg_daily),
        "deviation_pct": deviation,
        "source_location": location,
    }


def get_production_efficiency(location: str = "PIT A") -> Dict[str, Any]:
    effective = round(random.uniform(14.0, 19.0), 1)
    maintenance = round(random.uniform(1.5, 4.5), 1)
    total = effective + maintenance
    efficiency = round((effective / total) * 100, 1)

    return {
        "effective_hours": effective,
        "maintenance_hours": maintenance,
        "efficiency_rate": efficiency,
        "source_location": location,
    }


def get_equipment_status(location: str = "PIT A") -> Dict[str, Any]:
    total_equipment = random.randint(18, 25)

    if ML_AVAILABLE:
        try:
            high_risk_count = 0
            for i in range(3):
                pred = predict_equipment_failure(
                    equipment_id=f"ALAT_{i+1:02d}",
                    operating_hours=random.uniform(100, 200),
                    maintenance_hours=random.uniform(10, 30),
                    equipment_age_months=random.randint(12, 48),
                )
                if str(pred.get("risk_level", "")).lower() == "high":
                    high_risk_count += 1

            under_repair = high_risk_count
            maintenance = random.randint(1, 3)
        except Exception:
            under_repair = random.randint(2, 4)
            maintenance = random.randint(1, 3)
    else:
        under_repair = random.randint(2, 4)
        maintenance = random.randint(1, 3)

    standby = random.randint(3, 6)
    active = total_equipment - (standby + under_repair + maintenance)

    return {
        "active": active,
        "standby": standby,
        "under_repair": under_repair,
        "maintenance": maintenance,
        "source_location": location,
    }


def get_vessel_status() -> Dict[str, Any]:
    weather = get_weather_condition("PORT")
    delay_risk = True

    if ML_AVAILABLE:
        try:
            port_pred = predict_port_operability(
                wave_height=random.uniform(1.0, 2.5),
                wind_speed=weather["wind_speed_kmh"],
                visibility=weather["visibility_km"],
                rainfall=weather["rain_probability_pct"] / 2.0,
            )
            delay_risk = bool(port_pred.get("delay_risk", weather["extreme_weather_flag"]))
        except Exception:
            delay_risk = weather["extreme_weather_flag"]
    else:
        delay_risk = weather["extreme_weather_flag"]

    loading = random.randint(1, 3)
    waiting = random.randint(0, 2) if delay_risk else 0
    vessel_names = ["MV Makassar", "MV Sunrise", "MV Ocean Spirit", "MV Pacific Glory"]

    return {
        "loading": loading,
        "waiting": waiting,
        "non_delay_risk": not delay_risk,
        "vessel_name": random.choice(vessel_names),
    }


def get_production_weather_overview(location: str = "PIT A") -> Dict[str, Any]:
    production = [random.randint(1100, 1500) for _ in range(4)]
    target = [1500] * 4

    avg_prod = sum(production) / len(production)
    deviation = ((avg_prod - 1500) / 1500) * 100

    flags: List[str] = []
    if deviation < -10:
        flags.append(f"Produksi menurun {abs(deviation):.1f}% dari target.")
    elif deviation < 0:
        flags.append(f"Produksi sedikit di bawah target ({deviation:.1f}%).")
    else:
        flags.append("Produksi memenuhi target.")

    weather = get_weather_condition(location)
    if weather["extreme_weather_flag"]:
        flags.append("Cuaca ekstrem berpotensi menghambat hauling.")

    return {"production": production, "target": target, "ai_flag": flags}


def get_road_condition_overview(location: str = "PIT A") -> Dict[str, Any]:
    weather = get_weather_condition(location)
    road_names = ["Road A", "Road B", "Road C"]

    segments = []
    total_risk_score = 0.0

    for road in road_names[:2]:
        friction = round(random.uniform(0.25, 0.55), 2)
        water_depth = random.randint(0, 15) if friction < 0.4 else 0

        if ML_AVAILABLE:
            try:
                risk_pred = predict_road_risk(
                    friction_index=friction,
                    water_depth=water_depth,
                    wind_speed=weather["wind_speed_kmh"],
                    visibility=weather["visibility_km"],
                    rainfall=weather["rain_probability_pct"] / 2.0,
                )
                speed = int(risk_pred.get("predicted_speed", 25))
                status = str(risk_pred.get("risk_level", "Medium"))
                if status == "High":
                    status = "Bahaya"
                elif status == "Medium":
                    status = "Waspada"
                else:
                    status = "Normal"

                total_risk_score += float(risk_pred.get("risk_score", 50))
            except Exception:
                status = "Bahaya" if friction < 0.3 or water_depth > 10 else "Waspada" if friction < 0.4 else "Normal"
                speed = int(30 * friction * 1.5) if status != "Normal" else 30
                total_risk_score += (50 if status == "Waspada" else 80 if status == "Bahaya" else 20)
        else:
            status = "Bahaya" if friction < 0.3 or water_depth > 10 else "Waspada" if friction < 0.4 else "Normal"
            speed = int(30 * friction * 1.5) if status != "Normal" else 30
            total_risk_score += (50 if status == "Waspada" else 80 if status == "Bahaya" else 20)

        segments.append({"road": road, "status": status, "speed": speed, "friction": friction, "water": water_depth})

    avg_risk = total_risk_score / max(len(segments), 1)
    efficiency = int(100 - avg_risk)

    worst_road = min(segments, key=lambda x: x["friction"])
    ai_flag = f"Friction rendah pada {worst_road['road']}." if worst_road["friction"] < 0.35 else "Kondisi jalan dalam batas normal."

    return {"segments": segments, "route_efficiency_score": efficiency, "ai_flag": ai_flag}


def get_causes_of_downtime() -> Dict[str, Any]:
    total_downtime = round(random.uniform(4.0, 10.0), 1)
    lost_output = int(total_downtime * random.randint(100, 150))

    maintenance = random.randint(30, 50)
    weather = random.randint(20, 40)
    road_conditions = 100 - maintenance - weather

    insights: List[str] = []
    if maintenance > 40:
        insights.append("Maintenance spike detected due to component failures.")
    if weather > 30:
        insights.append("Weather significantly impacting operations.")
    if road_conditions > 25:
        insights.append("Road conditions causing delays.")
    if not insights:
        insights.append("Operations within normal parameters.")

    return {
        "total_downtime_hours": total_downtime,
        "lost_output_ton": lost_output,
        "top_causes": {"Maintenance": maintenance, "Weather": weather, "Road_conditions": road_conditions},
        "ai_breakdown": insights,
    }


def get_decision_impact() -> Dict[str, Any]:
    return {"correlation": {"rain_vs_production": -0.72, "visibility_vs_loading": -0.35}}


def generate_ai_summary(_: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "summary_points": [
            "Produksi menurun 14.3% dari target.",
            "Cuaca ekstrem berpotensi menghambat hauling.",
            "Road B menyebabkan bottleneck pada haul fleet.",
            "AI menyarankan maintenance shift penyesuaian.",
        ]
    }


# =============================================================================
# DASHBOARD ENDPOINT
# =============================================================================
@router.get("/dashboard")
@router.post("/dashboard")
async def get_dashboard(
    location: str = Query(default="PIT A", description="Source location"),
    date: Optional[str] = Query(default=None, description="Date filter (YYYY-MM-DD)"),
):
    try:
        import asyncio

        (
            production,
            weather,
            efficiency,
            equipment,
            vessels,
            prod_weather,
            roads,
            downtime,
            decision,
        ) = await asyncio.gather(
            asyncio.to_thread(get_production_data, location, date),
            asyncio.to_thread(get_weather_condition, location),
            asyncio.to_thread(get_production_efficiency, location),
            asyncio.to_thread(get_equipment_status, location),
            asyncio.to_thread(get_vessel_status),
            asyncio.to_thread(get_production_weather_overview, location),
            asyncio.to_thread(get_road_condition_overview, location),
            asyncio.to_thread(get_causes_of_downtime),
            asyncio.to_thread(get_decision_impact),
            return_exceptions=True,
        )

        dashboard_data = {
            "total_production": production,
            "weather_condition": weather,
            "production_efficiency": efficiency,
            "equipment_status": equipment,
            "vessel_status": vessels,
            "production_weather_overview": prod_weather,
            "road_condition_overview": roads,
            "causes_of_downtime": downtime,
            "decision_impact": decision,
        }
        dashboard_data["ai_summary"] = generate_ai_summary(dashboard_data)
        return dashboard_data

    except Exception as e:
        logger.error(f"Dashboard endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# MINE PLANNER ENDPOINT (placeholder)
# =============================================================================
def get_environment_conditions(area: str = "PIT A") -> Dict[str, Any]:
    return {
        "area": area,
        "location": area,
        "rainfall": "45.8 mm (Heavy)",
        "temperature": "24.1°C – 28.9°C",
        "humidity": "82%",
        "wind": "18 km/h",
        "pressure": "1008 hPa",
        "visibility": "1.2 km",
        "lightning": True,
        "updated": datetime.now().strftime("%B %d, %Y"),
        "risk": {"score": 79, "title": "High weather-related danger", "subtitle": "High risk of weather-related delays detected."},
    }


def generate_ai_scenarios() -> Dict[str, Any]:
    return {
        "scenarios": [
            {
                "title": "Scenario 1 - Most Recommended",
                "description": "Reallocate 3 excavators and 3 dump trucks from PIT B to PIT A to improve production balance.",
            },
            {"title": "Scenario 2", "description": "Set hauling for Road B for one day to reduce slip risk. Reroute via Road A."},
            {"title": "Scenario 3", "description": "Over-plan to anticipate upcoming rainfall. Increase rainy loading/hauling activities."},
        ],
        "analysis_sources": "Weather API, Equipment Store, Road Monitoring, Vessel Tracking",
    }


def get_road_conditions_detailed() -> Dict[str, Any]:
    return {
        "segment_name": "SEG_ROAD_PL01",
        "road_condition_label": "Slippery",
        "travel_time": "16.2 min",
        "friction_index": 0.32,
        "water_depth": "9.6 cm",
        "speed_limit": "40 km/h",
        "actual_speed": "25 km/h",
        "alert": {"title": "High Risk Alert", "description": "Water depth detected on segment 01 (9.6cm)."},
    }


def get_equipment_status_detailed(area: str = "PIT A") -> Dict[str, Any]:
    return {
        "summary": {"excellent": 31, "good": 37, "maintenanceRequired": 17, "slightlyDamaged": 12, "severelyDamaged": 8},
        "equipments": [
            {"id": "ALAT_01", "type": "Excavator", "model": "Hitachi ZX200", "condition": "Good", "operatingHours": 4, "maintenanceHours": 0},
            {"id": "ALAT_02", "type": "Dozer", "model": "Komatsu PC200", "condition": "Excellent", "operatingHours": 3, "maintenanceHours": 0},
            {"id": "ALAT_03", "type": "Dump Truck", "model": "CAT 777D", "condition": "Slightly Damaged", "operatingHours": 5, "maintenanceHours": 1},
            {"id": "ALAT_04", "type": "Wheel Loader", "model": "Komatsu PC300", "condition": "Good", "operatingHours": 2, "maintenanceHours": 0},
        ],
        "fleet_overview": [
            {"equipmentType": "Excavator", "active": 9, "maintenance": 2, "idle": 3},
            {"equipmentType": "Dozer", "active": 5, "maintenance": 1, "idle": 1},
            {"equipmentType": "Truck", "active": 8, "maintenance": 3, "idle": 2},
            {"equipmentType": "Wheel Loader", "active": 10, "maintenance": 2, "idle": 5},
            {"equipmentType": "Grader", "active": 7, "maintenance": 0, "idle": 4},
        ],
    }


@router.get("/mine-planner")
@router.post("/mine-planner")
async def get_mine_planner(
    area: str = Query(default="PIT A", description="Mining area"),
    date: Optional[str] = Query(default=None, description="Date for planning"),
):
    try:
        return {
            "environment_conditions": get_environment_conditions(area),
            "ai_recommendation": generate_ai_scenarios(),
            "road_conditions": get_road_conditions_detailed(),
            "equipment_status": get_equipment_status_detailed(area),
        }
    except Exception as e:
        logger.error(f"Mine planner endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# SHIPPING PLANNER ENDPOINT (placeholder)
# =============================================================================
def get_port_weather_conditions(location: str = "PIT A") -> Dict[str, Any]:
    return {
        "area": location,
        "location": location,
        "rainfall": "41.0 mm",
        "temperature": "25.8°C – 32.3°C",
        "humidity": "82%",
        "wind": "10.87 km/h",
        "pressure": "1007.87 hPa",
        "visibility": "1.4 km",
        "lightning": True,
        "updated": datetime.now().strftime("%B %d, %Y"),
        "riskScore": 79,
        "riskTitle": "High risk of weather-related delays",
        "riskSubtitle": "Heavy rainfall and visibility issues detected.",
    }


def get_vessel_schedules() -> List[Dict[str, Any]]:
    return [
        {"vessel_name": "MV Sunrise", "eta": "2025-01-10T08:00:00Z", "etb": "2025-01-10T12:00:00Z", "etd": "2025-01-11T20:00:00Z", "laycan_start": "2025-01-09", "laycan_end": "2025-01-11", "destination": "China", "status": "On Route"},
        {"vessel_name": "MV Ocean Spirit", "eta": "2025-01-15T09:00:00Z", "etb": "2025-01-15T13:00:00Z", "etd": "2025-01-16T22:00:00Z", "laycan_start": "2025-01-14", "laycan_end": "2025-01-16", "destination": "India", "status": "Scheduled"},
    ]


def get_coal_volume_ready() -> List[Dict[str, Any]]:
    return [
        {"stockpile": "SP-01", "volume": 52000, "grade": "GAR 4200", "updated_at": "2025-01-08T10:00:00Z"},
        {"stockpile": "SP-02", "volume": 38000, "grade": "GAR 5000", "updated_at": "2025-01-08T10:00:00Z"},
    ]


def get_loading_progress() -> List[Dict[str, Any]]:
    return [
        {"vessel_name": "MV Sunrise", "progress": 65, "tonnage_loaded": 32500, "tonnage_target": 50000, "last_update": "2025-01-09T14:00:00Z"},
        {"vessel_name": "MV Ocean Spirit", "progress": 0, "tonnage_loaded": 0, "tonnage_target": 55000, "last_update": "2025-01-09T14:00:00Z"},
    ]


def get_port_congestion() -> Dict[str, Any]:
    return {
        "updatedText": f"Updated: {datetime.now().strftime('%b %d, %Y - %I:%M %p')} (Asia/Makassar)",
        "shipsLoading": [{"name": "MV Mahakan Queen (Panamax)"}, {"name": "MV Kalimantan Pride (Ultramax)"}],
        "shipsWaiting": [{"name": "MV Baruna", "eta": "Jul 29"}, {"name": "MV Atrantis", "eta": "Aug 01"}, {"name": "MV Arwana", "eta": "Aug 04"}],
        "shipsCompletedText": "(No recent departure)",
        "congestionLevel": "High",
        "operationalNote": "Increased queue length indicates port congestion. Expect 2–4 hours additional delay for incoming vessels.",
    }


@router.get("/shipping-planner")
@router.post("/shipping-planner")
async def get_shipping_planner(
    location: str = Query(default="PIT A", description="Port location"),
    date: Optional[str] = Query(default=None, description="Date filter"),
):
    try:
        return {
            "port_weather_conditions": get_port_weather_conditions(location),
            "ai_recommendation": generate_ai_scenarios(),
            "vessel_schedules": get_vessel_schedules(),
            "coal_volume_ready": get_coal_volume_ready(),
            "loading_progress": get_loading_progress(),
            "port_congestion": get_port_congestion(),
        }
    except Exception as e:
        logger.error(f"Shipping planner endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# CHATBOX ENDPOINT (placeholder)
# =============================================================================
@router.post("/chatbox")
async def chatbox_interaction(request: ChatboxRequest):
    try:
        human_question = request.human_answer

        ai_answer = f"Based on current operational data and weather conditions, {human_question.lower()}"

        steps = [
            "Collected weather data from dim_cuaca_harian",
            "Compared historical pattern vs real-time",
            "Evaluated operational impact factors",
            "Generated operational recommendation",
        ]

        data_sources = {
            "weather": "dim_cuaca_harian",
            "equipment": "fct_operasional_alat",
            "road": "fct_kondisi_jalan",
            "vessel": "fct_pemuatan_kapal",
        }

        quick_questions = [
            "Optimal truck allocation?",
            "Which road has highest risk today?",
            "How does rain impact production?",
            "Any delay risk for vessels?",
        ]

        return {
            "ai_answer": ai_answer,
            "ai_time": datetime.now().strftime("%H:%M"),
            "human_answer": human_question,
            "human_time": datetime.now().strftime("%H:%M"),
            "quick_questions": quick_questions,
            "steps": steps,
            "data_sources": data_sources,
        }

    except Exception as e:
        logger.error(f"Chatbox endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# REPORTS ENDPOINT (placeholder)
# =============================================================================
@router.get("/reports")
async def get_reports():
    try:
        return {
            "generator_form": {
                "report_types": ["Operational", "Weather Impact", "Equipment Status", "Production Summary", "Port Operations", "Cost Analysis"],
                "time_periods": ["Daily", "Weekly", "Monthly", "Quarterly"],
                "formats": ["PDF", "CSV", "Excel", "JSON"],
            },
            "recent_reports": [
                {"title": "Weekly Production Summary", "date": "2025-12-08", "frequency": "Weekly", "type": "Operational"},
                {"title": "Monthly Equipment Status", "date": "2025-12-01", "frequency": "Monthly", "type": "Equipment Status"},
                {"title": "Weather Impact Analysis", "date": "2025-12-07", "frequency": "Daily", "type": "Weather Impact"},
            ],
        }
    except Exception as e:
        logger.error(f"Reports endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# ✅ SIMULATION ANALYSIS ENDPOINT (REAL: GET Query + POST JSON Body)
# =============================================================================
@router.get("/simulation-analysis")
async def get_simulation_analysis_get(
    expected_rainfall_mm: float = Query(default=50, ge=0, le=500),
    equipment_health_pct: float = Query(default=80, ge=0, le=100),
    vessel_delay_hours: float = Query(default=5, ge=0, le=72),
):
    if not SIM_ENGINE_AVAILABLE:
        raise HTTPException(status_code=500, detail="simulation_engine not available")

    logger.info(
        f"🔥 HIT GET /simulation-analysis q="
        f"{expected_rainfall_mm},{equipment_health_pct},{vessel_delay_hours}"
    )

    return run_simulation_ml(
        expected_rainfall_mm=expected_rainfall_mm,
        equipment_health_pct=equipment_health_pct,
        vessel_delay_hours=vessel_delay_hours,
    )


@router.post("/simulation-analysis")
async def post_simulation_analysis(payload: SimulationAnalysisRequest = Body(...)):
    if not SIM_ENGINE_AVAILABLE:
        raise HTTPException(status_code=500, detail="simulation_engine not available")

    logger.info(f"🔥 HIT POST /simulation-analysis payload={payload.dict()}")

    return run_simulation_ml(
        expected_rainfall_mm=payload.expected_rainfall_mm,
        equipment_health_pct=payload.equipment_health_pct,
        vessel_delay_hours=payload.vessel_delay_hours,
    )


@router.get("/health")
async def frontend_health_check():
    return {
        "status": "healthy",
        "service": "Frontend Integration API",
        "endpoints": {
            "dashboard": "/api/dashboard",
            "mine_planner": "/api/mine-planner",
            "shipping_planner": "/api/shipping-planner",
            "simulation_analysis": "/api/simulation-analysis",
            "chatbox": "/api/chatbox",
            "reports": "/api/reports",
        },
        "timestamp": datetime.now().isoformat(),
    }