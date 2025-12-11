import { loadJSON } from "../utils/jsonLoader.js";

function normalizeKey(key) {
  return key.replace(/\s+/g, "").replace(/_/g, "").toUpperCase();
}

function getLocationSlice(filters = {}) {
  const json = loadJSON("mine_planner.json");

  const locations = json.locations || json;

  if (!locations || !Object.keys(locations).length) {
    return { json, slice: {} };
  }

  const requestedRaw = filters.location || "PIT A";

  const requestedNorm = normalizeKey(requestedRaw);

  const matchedKey =
    Object.keys(locations).find(
      (key) => normalizeKey(key) === requestedNorm
    ) || Object.keys(locations)[0];

  const slice = locations[matchedKey] || {};

  const uiLocation =
    matchedKey === "PIT_A"
      ? "PIT A"
      : matchedKey === "PIT_B"
      ? "PIT B"
      : matchedKey;

  if (slice.environment_conditions) {
    slice.environment_conditions = {
      ...slice.environment_conditions,
      source_location:
        slice.environment_conditions.source_location || uiLocation,
    };
  }

  if (slice.ai_recommendation) {
    slice.ai_recommendation = {
      ...slice.ai_recommendation,
      source_location:
        slice.ai_recommendation.source_location || uiLocation,
    };
  }

  if (slice.road_conditions) {
    slice.road_conditions = {
      ...slice.road_conditions,
      source_location: slice.road_conditions.source_location || uiLocation,
    };
  }

  if (slice.equipment_status) {
    slice.equipment_status = {
      ...slice.equipment_status,
      source_location:
        slice.equipment_status.source_location || uiLocation,
    };
  }

  return { json, slice };
}

export function getEnvironmentConditions(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.environment_conditions || null;
}

export function getMineRoadConditions(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.road_conditions || null;
}

export function getEquipmentStatusMine(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.equipment_status || null;
}

export function getAIMineRecommendation(filters = {}) {
  const { slice } = getLocationSlice(filters);
  return slice.ai_recommendation || null;
}
