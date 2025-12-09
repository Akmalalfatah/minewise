import { loadJSON } from "../utils/jsonLoader.js";
import { applyFilters } from "../utils/filterUtil.js";

function getLocationSlice(filters = {}) {
  const json = loadJSON("dashboard.json");
  const locations = json.locations || {};

  if (!Object.keys(locations).length) {
    return { json, slice: json };
  }

  const requestedLocation = (filters.location || "PIT A").toUpperCase();

  const matchedKey =
    Object.keys(locations).find(
      (key) => key.toUpperCase() === requestedLocation
    ) || "PIT A";

  return { json, slice: locations[matchedKey] || locations["PIT A"] || {} };
}

export function getDashboard(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice;
}

export function getTotalProduction(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.total_production || null;
}

export function getWeatherCondition(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.weather_condition || null;
}

export function getProductionEfficiency(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.production_efficiency || null;
}

export function getEquipmentStatus(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.equipment_status || null;
}

export function getVesselStatus(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.vessel_status || null;
}

export function getProductionWeatherOverview(filters = {}) {
  const { slice } = getLocationSlice(filters);
  const overview = slice.production_weather_overview || {};
  return overview;
}

export function getRoadConditionOverview(filters = {}) {
  const { slice } = getLocationSlice(filters);
  const rc = slice.road_condition_overview || {};

  if (rc.segments && Array.isArray(rc.segments)) {
    rc.segments = applyFilters(rc.segments, filters);
  }

  return rc;
}

export function getCausesOfDowntime(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.causes_of_downtime || null;
}

export function getDecisionImpact(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.decision_impact || null;
}

export function getAISummary(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.ai_summary || null;
}
