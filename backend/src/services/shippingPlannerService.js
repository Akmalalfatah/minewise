import { loadJSON } from "../utils/jsonLoader.js";
import { applyFilters } from "../utils/filterUtil.js";

export function getPortWeatherConditions(filters = {}) {
  const json = loadJSON("shipping_planner.json");
  return json.port_weather_conditions || null;
}

export function getAIShippingRecommendation(filters = {}) {
  const json = loadJSON("shipping_planner.json");

  return json.ai_recommendation || {
    scenarios: [],
    analysis_sources: "-",
  };
}

export function getVesselSchedule(filters = {}) {
  const json = loadJSON("shipping_planner.json");

  return json.vessel_schedule_overview || [];
}

export function getCoalVolumeReady(filters = {}) {
  const json = loadJSON("shipping_planner.json");
  return json.coal_volume_ready || [];
}

export function getLoadingProgress(filters = {}) {
  const json = loadJSON("shipping_planner.json");
  return json.loading_progress || null;
}

export function getPortCongestionStatus(filters = {}) {
  const json = loadJSON("shipping_planner.json");
  return json.port_congestion || null;
}
