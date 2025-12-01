import apiClient from "./apiClient";

export async function getPortWeatherConditions(filters) {
    const res = await apiClient.get("/shipping-planner/port-weather-conditions", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.port_weather_conditions;
}

export async function getAIShippingRecommendation(filters) {
    const res = await apiClient.get("/shipping-planner/ai-recommendation", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.ai_shipping_recommendation;
}

export async function getVesselSchedule(filters) {
    const res = await apiClient.get("/shipping-planner/vessel-schedule", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.vessel_schedule;
}

export async function getCoalVolumeReady(filters) {
    const res = await apiClient.get("/shipping-planner/coal-volume-ready", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.coal_volume_ready;
}

export async function getLoadingProgress(filters) {
    const res = await apiClient.get("/shipping-planner/loading-progress", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.loading_progress;
}

export async function getPortCongestionStatus(filters) {
    const res = await apiClient.get("/shipping-planner/port-congestion", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.port_congestion;
}
