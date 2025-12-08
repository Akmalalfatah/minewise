import apiClient from "./apiClient";

export async function getTotalProduction(filters = {}) {
  const { location, timePeriod, shift } = filters;
  const res = await apiClient.get("/dashboard/total-production", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });
  return res.data.total_production;
}

export async function getWeatherCondition(filters = {}) {
  const { location, timePeriod, shift } = filters;
  const res = await apiClient.get("/dashboard/weather-condition", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });
  return res.data.weather_condition;
}

export async function getProductionEfficiency(filters = {}) {
  const { location, timePeriod, shift } = filters;
  const res = await apiClient.get("/dashboard/production-efficiency", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });
  return res.data.production_efficiency;
}

export async function getEquipmentStatus(filters = {}) {
  const { location, timePeriod, shift } = filters;
  const res = await apiClient.get("/dashboard/equipment-status", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });
  return res.data.equipment_status;
}

export async function getVesselStatus(filters = {}) {
  const { location, timePeriod, shift } = filters;
  const res = await apiClient.get("/dashboard/vessel-status", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });
  return res.data.vessel_status;
}

export async function getProductionWeatherOverview(filters = {}) {
  const { location, timePeriod, shift } = filters;
  const res = await apiClient.get("/dashboard/production-weather-overview", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });
  return res.data.production_weather_overview;
}

export async function getRoadConditionOverview(filters = {}) {
  const { location, timePeriod, shift } = filters;
  const res = await apiClient.get("/dashboard/road-condition-overview", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });
  return res.data.road_condition_overview;
}

export async function getCausesOfDowntime(filters = {}) {
  const { location, timePeriod, shift } = filters;
  const res = await apiClient.get("/dashboard/causes-of-downtime", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });
  return res.data.causes_of_downtime;
}

export async function getDecisionImpact(filters = {}) {
  const { location, timePeriod, shift } = filters;
  const res = await apiClient.get("/dashboard/decision-impact", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });
  return res.data.decision_impact;
}

export async function getAISummary(filters = {}) {
  const { location, timePeriod, shift } = filters;
  const res = await apiClient.get("/dashboard/ai-summary", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });
  return res.data.ai_summary;
}

export async function getDashboard() {
  const res = await apiClient.get("/dashboard");
  return res.data;
}
