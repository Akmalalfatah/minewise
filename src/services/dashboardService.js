import apiClient from "./apiClient";

export async function getTotalProduction(filters) {
    const res = await apiClient.get("/dashboard/total-production", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.total_production;
}

export async function getWeatherCondition(filters) {
    const res = await apiClient.get("/dashboard/weather-condition", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.weather_condition;
}

export async function getProductionEfficiency(filters) {
    const res = await apiClient.get("/dashboard/production-efficiency", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.production_efficiency;
}

export async function getEquipmentStatus(filters) {
    const res = await apiClient.get("/dashboard/equipment-status", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.equipment_status;
}

export async function getVesselStatus(filters) {
    const res = await apiClient.get("/dashboard/vessel-status", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.vessel_status;
}

export async function getProductionWeatherOverview(filters) {
    const res = await apiClient.get("/dashboard/production-weather-overview", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.production_weather_overview;
}

export async function getRoadConditionOverview(filters) {
    const res = await apiClient.get("/dashboard/road-condition-overview", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.road_condition_overview;
}

export async function getCausesOfDowntime(filters) {
    const res = await apiClient.get("/dashboard/causes-of-downtime", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.causes_of_downtime;
}

export async function getDecisionImpact(filters) {
    const res = await apiClient.get("/dashboard/decision-impact", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.decision_impact;
}

export async function getAISummary(filters) {
    const res = await apiClient.get("/dashboard/ai-summary", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.ai_summary;
}
