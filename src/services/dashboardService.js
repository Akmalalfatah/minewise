import apiClient from "./apiClient";

export async function getTotalProduction() {
    const res = await apiClient.get("/dashboard/total-production");
    return res.data.total_production;
}

export async function getWeatherCondition() {
    const res = await apiClient.get("/dashboard/weather-condition");
    return res.data.weather_condition;
}

export async function getProductionEfficiency() {
    const res = await apiClient.get("/dashboard/production-efficiency");
    return res.data.production_efficiency;
}

export async function getEquipmentStatus() {
    const res = await apiClient.get("/dashboard/equipment-status");
    return res.data.equipment_status;
}

export async function getVesselStatus() {
    const res = await apiClient.get("/dashboard/vessel-status");
    return res.data.vessel_status;
}

export async function getProductionWeatherOverview() {
    const res = await apiClient.get("/dashboard/production-weather-overview");
    return res.data.production_weather_overview;
}

export async function getRoadConditionOverview() {
    const res = await apiClient.get("/dashboard/road-condition-overview");
    return res.data.road_condition_overview;
}

export async function getCausesOfDowntime() {
    const res = await apiClient.get("/dashboard/causes-of-downtime");
    return res.data.causes_of_downtime;
}

export async function getDecisionImpact() {
    const res = await apiClient.get("/dashboard/decision-impact");
    return res.data.decision_impact;
}

export async function getAISummary() {
    const res = await apiClient.get("/dashboard/ai-summary");
    return res.data.ai_summary;
}
