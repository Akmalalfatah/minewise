import apiClient from "./apiClient";

export async function getPortWeatherConditions(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/shipping-planner/port-weather", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data.port_weather_conditions;
}

export async function getAIShippingRecommendation(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/shipping-planner/ai-recommendation", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data.ai_shipping_recommendation;
}

export async function getVesselSchedule(params = {}) {
  const res = await apiClient.get("/shipping-planner/vessel-schedules", { params });
  return res.data.vessels;
}

export async function getCoalVolumeReady(params = {}) {
  const res = await apiClient.get("/shipping-planner/coal-volume", { params });
  return res.data.stockpiles;
}

export async function getLoadingProgress(params = {}) {
  const res = await apiClient.get("/shipping-planner/loading-progress", { params });
  return res.data.shipments;
}

export async function getPortCongestionStatus(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/shipping-planner/port-congestion", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data.port_congestion;
}
