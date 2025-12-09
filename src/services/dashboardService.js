import apiClient from "./apiClient";

export async function getTotalProduction(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard/total-production", {
    params: { location },
  });
  return res.data.total_production;
}

export async function getWeatherCondition(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard/weather-condition", {
    params: { location },
  });
  return res.data.weather_condition;
}

export async function getProductionEfficiency(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard/production-efficiency", {
    params: { location },
  });
  return res.data.production_efficiency;
}

export async function getEquipmentStatus(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard/equipment-status", {
    params: { location },
  });
  return res.data.equipment_status;
}

export async function getVesselStatus(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard/vessel-status", {
    params: { location },
  });
  return res.data.vessel_status;
}

export async function getProductionWeatherOverview(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard/production-weather-overview", {
    params: { location },
  });
  return res.data.production_weather_overview;
}

export async function getRoadConditionOverview(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard/road-condition-overview", {
    params: { location },
  });
  return res.data.road_condition_overview;
}

export async function getCausesOfDowntime(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard/causes-of-downtime", {
    params: { location },
  });
  return res.data.causes_of_downtime;
}

export async function getDecisionImpact(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard/decision-impact", {
    params: { location },
  });
  return res.data.decision_impact;
}

export async function getAISummary(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard/ai-summary", {
    params: { location },
  });
  return res.data.ai_summary;
}

export async function getDashboard(filters = {}) {
  const { location } = filters;
  const res = await apiClient.get("/dashboard", {
    params: { location },
  });
  return res.data;
}
