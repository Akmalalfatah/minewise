import apiClient from "./apiClient";

export async function getPortWeatherConditions() {
    const res = await apiClient.get("/shipping-planner/port-weather-conditions");
    return res.data.port_weather_conditions;
}

export async function getAIShippingRecommendation() {
    const res = await apiClient.get("/shipping-planner/ai-recommendation");
    return res.data.ai_shipping_recommendation;
}

export async function getVesselSchedule() {
    const res = await apiClient.get("/shipping-planner/vessel-schedule");
    return res.data.vessel_schedule;
}

export async function getCoalVolumeReady() {
    const res = await apiClient.get("/shipping-planner/coal-volume-ready");
    return res.data.coal_volume_ready;
}

export async function getLoadingProgress() {
    const res = await apiClient.get("/shipping-planner/loading-progress");
    return res.data.loading_progress;
}

export async function getPortCongestionStatus() {
    const res = await apiClient.get("/shipping-planner/port-congestion");
    return res.data.port_congestion;
}
