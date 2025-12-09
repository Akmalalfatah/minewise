import { loadJSON } from "../utils/jsonLoader.js";
import { applyFilters } from "../utils/filterUtil.js";

function getPortSlice(filters = {}) {
  const json = loadJSON("shipping_planner.json");
  const ports = json.ports || {};

  if (!Object.keys(ports).length) {
    return { json, slice: json };
  }

  const requestedLocation = (filters.location || "Port A").toUpperCase();

  const matchedKey =
    Object.keys(ports).find(
      (key) => key.toUpperCase() === requestedLocation
    ) || "Port A";

  return { json, slice: ports[matchedKey] || ports["Port A"] || {} };
}

export function getPortWeatherConditions(filters = {}) {
  const { slice } = getPortSlice(filters);
  return slice.port_weather_conditions || null;
}

export function getAIShippingRecommendation(filters = {}) {
  const { slice } = getPortSlice(filters);

  return (
    slice.ai_recommendation || {
      scenarios: [],
      analysis_sources: "-",
    }
  );
}

export function getVesselSchedules(filters = {}) {
  const { slice } = getPortSlice(filters);
  let list = slice.vessel_schedules || [];

  if (Array.isArray(list)) {
    list = applyFilters(list, filters);
  }

  return list;
}

export function getCoalVolumeReady(filters = {}) {
  const { slice } = getPortSlice(filters);
  let list = slice.coal_volume_ready || [];

  if (Array.isArray(list)) {
    list = applyFilters(list, filters);
  }

  return list;
}

export function getLoadingProgress(filters = {}) {
  const { slice } = getPortSlice(filters);
  let list = slice.loading_progress || [];

  if (Array.isArray(list)) {
    list = applyFilters(list, filters);
  }

  return list;
}

export function getPortCongestionStatus(filters = {}) {
  const { slice } = getPortSlice(filters);
  return slice.port_congestion || null;
}
