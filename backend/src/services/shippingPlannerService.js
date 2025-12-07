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

export function getVesselSchedules() {
  const json = loadJSON("shipping_planner.json");
  return json.vessel_schedules || [];
}

export function getCoalVolumeReady() {
  const json = loadJSON("shipping_planner.json");
  return json.coal_volume_ready || [];
}

export function getLoadingProgress() {
  const json = loadJSON("shipping_planner.json");
  return json.loading_progress || [];
}

export function getPortCongestionStatus(filters = {}) {
  const json = loadJSON("shipping_planner.json");
  return json.port_congestion || null;
}
