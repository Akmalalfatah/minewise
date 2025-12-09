import { loadJSON } from "../utils/jsonLoader.js";
import { applyFilters } from "../utils/filterUtil.js";

function getLocationSlice(filters = {}) {
  const json = loadJSON("mine_planner.json");
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

export function getEnvironmentConditions(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.environment_conditions || null;
}

export function getAIMineRecommendation(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.ai_recommendation || null;
}

export function getMineRoadConditions(filters = {}) {
  const { slice } = getLocationSlice(filters);
  const rc = slice.road_conditions || {};

  if (rc.road_segments) {
    rc.road_segments = applyFilters(rc.road_segments, filters);
  }

  return rc;
}

export function getEquipmentStatusMine(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.equipment_status || null;
}
