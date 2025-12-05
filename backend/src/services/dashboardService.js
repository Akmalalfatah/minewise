import { loadJSON } from "../utils/jsonLoader.js";
import { applyFilters } from "../utils/filterUtil.js";

export function getTotalProduction(filters = {}) {
    const json = loadJSON("dashboard.json");
    const value = json.total_production || json.total_production_dataset || json;
    if (Array.isArray(value)) {
        const filtered = applyArrayFilters(value, filters);
        return filtered.length ? filtered[0] : value[0];
    }
    return value;
}

export function getWeatherCondition(filters = {}) {
    const json = loadJSON("dashboard.json");
    return json.weather_condition || null;
}

export function getProductionEfficiency(filters = {}) {
    const json = loadJSON("dashboard.json");
    return json.production_efficiency || null;
}

export function getEquipmentStatus(filters = {}) {
    const json = loadJSON("dashboard.json");
    return json.equipment_status || null;
}

export function getVesselStatus(filters = {}) {
    const json = loadJSON("dashboard.json");
    return json.vessel_status || null;
}

export function getProductionWeatherOverview(filters = {}) {
    const json = loadJSON("dashboard.json");
    const overview = json.production_weather_overview || {};
    if (Array.isArray(overview.production)) {
        return overview;
    }
    return overview;
}

export function getRoadConditionOverview(filters = {}) {
    const json = loadJSON("dashboard.json");
    const rc = json.road_condition_overview || {};
    if (rc.segments && Array.isArray(rc.segments)) {
        rc.segments = applyFilters(rc.segments, filters);
    }
    return rc;
}

export function getCausesOfDowntime(filters = {}) {
    const json = loadJSON("dashboard.json");
    return json.causes_of_downtime || null;
}

export function getDecisionImpact(filters = {}) {
    const json = loadJSON("dashboard.json");
    return json.decision_impact || null;
}

export function getAISummary(filters = {}) {
    const json = loadJSON("dashboard.json");
    return json.ai_summary || null;
}
