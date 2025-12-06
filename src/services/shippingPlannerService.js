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

export async function getVesselSchedule(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/shipping-planner/vessel-schedules", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data.vessel_schedule;
}

export async function getCoalVolumeReady(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/shipping-planner/coal-volume", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data.coal_volume_ready;
}

export async function getLoadingProgress(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/shipping-planner/loading-progress", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data.loading_progress;
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
