from typing import Dict, Any
from src.api.model_store import registry, feature_engineer


# =========================
# Helpers
# =========================
def _clamp(x: float, lo: float = 0.0, hi: float = 100.0) -> int:
    if x < lo:
        return int(lo)
    if x > hi:
        return int(hi)
    return int(round(x))


def _surface_from_rain(rain_mm: float) -> str:
    if rain_mm <= 5:
        return "KERING"
    if rain_mm <= 30:
        return "BASAH"
    return "BERLUMPUR"


def _road_condition_from_risk(pred: str) -> str:
    p = str(pred).upper()
    if "TERBATAS" in p:
        return "BURUK"
    if "WASPADA" in p:
        return "SEDANG"
    return "BAIK"


def _safe_max_proba(proba: Any, default: float = 0.5) -> float:
    try:
        return float(max(proba))
    except Exception:
        return float(default)


def _safe_prob_index(proba: Any, idx: int, default: float = 0.5) -> float:
    try:
        return float(proba[idx])
    except Exception:
        return float(default)


# =========================
# Main Simulation (NO distance_km)
# =========================
def run_simulation_ml(
    expected_rainfall_mm: float,
    equipment_health_pct: float,
    vessel_delay_hours: float,
) -> Dict[str, Any]:
    rain = float(expected_rainfall_mm)
    health = float(equipment_health_pct)
    delay = float(vessel_delay_hours)

    # Default internal (karena API kamu belum punya distance_km)
    DEFAULT_DISTANCE_KM = 12.5

    # ============================================================
    # 1) Road Speed (ML)
    # ============================================================
    road_speed_req = {
        "jenis_jalan": "UTAMA",
        "kondisi_permukaan": _surface_from_rain(rain),
        "curah_hujan_mm": max(rain, 0.0),
        "suhu_celcius": 28.0 - min(rain / 40.0, 4.0),
        "kecepatan_angin_ms": 3.0 + min(delay / 10.0, 3.0),
        "elevasi_mdpl": 450.0,
        "kemiringan_persen": 5.0 + min(rain / 50.0, 8.0),
        "beban_muatan_ton": 85.0,
        "jam_operasi": 10,
    }
    road_speed_features = feature_engineer.engineer_road_speed_features(road_speed_req)
    speed_kmh = float(registry.predict("road_speed", road_speed_features)[0])

    # ============================================================
    # 2) Road Risk (ML)
    # ============================================================
    road_risk_req = {
        "jenis_jalan": "UTAMA",
        "kondisi_permukaan": _surface_from_rain(rain),
        "curah_hujan_mm": max(rain, 0.0),
        "kemiringan_persen": 5.0 + min(rain / 50.0, 8.0),
    }
    road_risk_features = feature_engineer.engineer_road_risk_features(road_risk_req)
    road_risk_pred = registry.predict("road_risk", road_risk_features)[0]
    road_risk_proba = registry.predict_proba("road_risk", road_risk_features)[0]
    road_risk_conf = _safe_max_proba(road_risk_proba, 0.5)

    # ============================================================
    # 3) Cycle Time (ML) - pakai jarak default internal
    # ============================================================
    cycle_time_req = {
        "jarak_tempuh_km": max(DEFAULT_DISTANCE_KM, 0.1),
        "kecepatan_prediksi_kmh": max(speed_kmh, 5.0),
        "curah_hujan_mm": max(rain, 0.0),
        "kondisi_jalan": _road_condition_from_risk(road_risk_pred),
        "beban_muatan_ton": 90.0,
        "jumlah_stop": int(2 + min(delay / 6.0, 4.0)),
    }
    cycle_time_features = feature_engineer.engineer_cycle_time_features(cycle_time_req)
    cycle_time_min = float(registry.predict("cycle_time", cycle_time_features)[0])

    # ============================================================
    # 4) Equipment Failure (ML)
    # ============================================================
    equip_age = 3.0 + (100.0 - health) / 18.0
    jam_op = 8.0 + (100.0 - health) / 10.0
    ritase = 40.0 + (100.0 - health) / 3.5

    equipment_failure_req = {
        "jenis_equipment": "Dump Truck",
        "umur_tahun": float(equip_age),
        "jam_operasional_harian": float(min(max(jam_op, 0.0), 24.0)),
        "ritase_harian": float(max(ritase, 0.0)),
    }
    equipment_features = feature_engineer.engineer_equipment_failure_features(equipment_failure_req)
    _ = registry.predict("equipment_failure", equipment_features)[0]
    equipment_proba = registry.predict_proba("equipment_failure", equipment_features)[0]
    breakdown_prob = _safe_prob_index(equipment_proba, 1, 0.5)

    # ============================================================
    # 5) Port Operability (ML)
    # ============================================================
    port_operability_req = {
        "tinggi_gelombang_m": 1.0 + min(delay / 24.0, 2.0) + min(rain / 120.0, 1.0),
        "kecepatan_angin_kmh": 18.0 + min(delay * 1.8, 30.0),
        "tipe_kapal": "Bulk Carrier",
        "kapasitas_muatan_ton": 65000.0,
    }
    port_features = feature_engineer.engineer_port_operability_features(port_operability_req)
    port_pred = registry.predict("port_operability", port_features)[0]
    port_proba = registry.predict_proba("port_operability", port_features)[0]
    port_conf = _safe_max_proba(port_proba, 0.5)

    # ============================================================
    # 6) Aggregate Scores (scenarios)
    # ============================================================
    rr = str(road_risk_pred).upper()
    risk_from_road = 35.0 if "TERBATAS" in rr else 18.0 if "WASPADA" in rr else 8.0
    risk_from_equip = 30.0 * breakdown_prob

    pp = str(port_pred).lower()
    risk_from_port = 22.0 if "break" in pp else 12.0 if "maint" in pp else 6.0

    base_risk = _clamp(
        20.0
        + risk_from_road
        + risk_from_equip
        + risk_from_port
        + min(rain / 10.0, 20.0)
        + min(delay * 1.2, 20.0)
    )

    prod_penalty = (
        min(max((cycle_time_min - 25.0) * 1.2, 0.0), 35.0)
        + min(rain / 8.0, 18.0)
        + min(delay * 1.0, 18.0)
    )
    prod_bonus = (
        min(max(speed_kmh - 18.0, 0.0) * 0.9, 20.0)
        + min(health / 6.0, 16.0)
    )
    base_prod = _clamp(80.0 - prod_penalty + prod_bonus)

    cost_bonus = min(health / 5.5, 18.0) + min(speed_kmh / 3.5, 14.0)
    cost_penalty = (
        min(rain / 9.0, 16.0)
        + min(delay * 1.1, 20.0)
        + (12.0 * breakdown_prob)
    )
    base_cost = _clamp(75.0 + cost_bonus - cost_penalty)

    baseline = {
        "title": "Baseline Scenario",
        "production_output_pct": base_prod,
        "cost_efficiency_pct": base_cost,
        "risk_level_pct": base_risk,
    }

    optimized = {
        "title": "Optimized Scenario",
        "production_output_pct": _clamp(base_prod + 10.0 + min((1.0 - breakdown_prob) * 8.0, 8.0)),
        "cost_efficiency_pct": _clamp(base_cost + 9.0),
        "risk_level_pct": _clamp(base_risk - 12.0),
    }

    conservative = {
        "title": "Conservative Scenario",
        "production_output_pct": _clamp(base_prod - 8.0),
        "cost_efficiency_pct": _clamp(base_cost + 4.0),
        "risk_level_pct": _clamp(base_risk - 18.0),
    }

    dominant = "equipment_health" if breakdown_prob > 0.55 else "rainfall" if rain > 50 else "vessel_delay"

    # ============================================================
    # 7) Return (MATCH FRONTEND CONTRACT - NO distance_km)
    # ============================================================
    prod_gain = optimized["production_output_pct"] - baseline["production_output_pct"]
    prod_gain_pct = round((prod_gain / max(baseline["production_output_pct"], 1)) * 100.0, 1)

    return {
        "input_parameters": {
            "expected_rainfall_mm": rain,
            "equipment_health_pct": health,
            "vessel_delay_hours": delay,
            "impact_notes": {
                "rainfall": "Impact: Road conditions & mining operations",
                "equipment_health": "Impact: Load efficiency & operating hours",
                "vessel_delay": "Impact: Port queue & hauling coordination",
            },
        },
        "scenarios": {
            "baseline": baseline,
            "optimized": optimized,
            "conservative": conservative,
        },
        "ai_recommendations": {
            "description": "Rekomendasi AI diasumsikan berdasarkan hasil ML pada skenario Optimized.",
            "production_strategy": {
                "title": "Production Strategy",
                "detail": (
                    f"Optimasi rute & kecepatan hauling (pred speed {speed_kmh:.1f} km/h, "
                    f"cycle {cycle_time_min:.1f} menit) berpotensi menaikkan output ~{prod_gain_pct}%."
                ),
            },
            "equipment_allocation": {
                "title": "Equipment Allocation",
                "detail": (
                    f"Probabilitas breakdown dump truck ~{breakdown_prob:.2f}. "
                    f"Prioritaskan preventive maintenance untuk unit berisiko tinggi agar downtime turun."
                ),
            },
            "logistics_optimization": {
                "title": "Logistics Optimization",
                "detail": (
                    f"Port status: {port_pred} (conf {port_conf:.2f}). "
                    f"Sinkronkan jadwal hauling vs loading untuk mengurangi idle akibat delay {delay:.0f} jam."
                ),
            },
            "risk_mitigation": {
                "title": "Risk Mitigation",
                "detail": (
                    f"Road risk: {road_risk_pred} (conf {road_risk_conf:.2f}). "
                    f"Terapkan SOP kecepatan & inspeksi permukaan saat hujan {rain:.0f}mm."
                ),
            },
        },
        "ml_signals": {
            "road_speed_kmh": round(speed_kmh, 2),
            "road_risk_pred": str(road_risk_pred),
            "road_risk_conf": round(road_risk_conf, 3),
            "cycle_time_min": round(cycle_time_min, 2),
            "equipment_breakdown_prob": round(breakdown_prob, 3),
            "port_operability_pred": str(port_pred),
            "port_operability_conf": round(port_conf, 3),
            "dominant_driver": dominant,
            "assumed_distance_km": DEFAULT_DISTANCE_KM,  # opsional info internal
        },
    }
