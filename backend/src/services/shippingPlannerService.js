import { loadJSON } from "../utils/jsonLoader.js";
import { applyFilters } from "../utils/filterUtil.js";

const DEFAULT_PORT = "Port A";

function getLocationSlice(filters = {}) {
  const json = loadJSON("shipping_planner.json");
  const locations = json.locations || {};

  if (!Object.keys(locations).length) {
    return { json, slice: json };
  }

  const requestedLocation = (filters.location || DEFAULT_PORT).toUpperCase();

  const matchedKey =
    Object.keys(locations).find(
      (key) => key.toUpperCase() === requestedLocation
    ) || DEFAULT_PORT;

  return {
    json,
    slice: locations[matchedKey] || locations[DEFAULT_PORT] || {}
  };
}

export function getPortWeatherConditions(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.port_weather_conditions || null;
}

export function getAIShippingRecommendation(filters = {}) {
  const { slice } = getLocationSlice(filters);

  return (
    slice.ai_recommendation || {
      scenarios: [],
      analysis_sources: "-"
    }
  );
}

export function getVesselSchedules(filters = {}) {
  const { slice } = getLocationSlice(filters);
  const list = slice.vessel_schedules || [];
  return applyFilters(list, filters);
}

export function getCoalVolumeReady(filters = {}) {
  const { slice } = getLocationSlice(filters);
  const list = slice.coal_volume_ready || [];
  return applyFilters(list, filters);
}

export function getLoadingProgress(filters = {}) {
  const { slice } = getLocationSlice(filters);
  const list = slice.loading_progress || [];
  return applyFilters(list, filters);
}

export function getPortCongestionStatus(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.port_congestion || null;
}
