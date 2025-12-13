import { loadJSON } from "../utils/jsonLoader.js";

const USE_ML_API = String(process.env.USE_ML_API || "").toLowerCase() === "true";
const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

function normalizeKey(key) {
  return String(key || "").replace(/\s+/g, "").replace(/_/g, "").toUpperCase();
}

function withSourceLocation(slice, matchedKey) {
  const uiLocation =
    matchedKey === "PIT_A" ? "PIT A" : matchedKey === "PIT_B" ? "PIT B" : matchedKey;

  const out = { ...(slice || {}) };

  if (out.environment_conditions) {
    out.environment_conditions = {
      ...out.environment_conditions,
      source_location: out.environment_conditions.source_location || uiLocation,
    };
  }

  if (out.ai_recommendation) {
    out.ai_recommendation = {
      ...out.ai_recommendation,
      source_location: out.ai_recommendation.source_location || uiLocation,
    };
  }

  if (out.road_conditions) {
    out.road_conditions = {
      ...out.road_conditions,
      source_location: out.road_conditions.source_location || uiLocation,
    };
  }

  if (out.equipment_status) {
    out.equipment_status = {
      ...out.equipment_status,
      source_location: out.equipment_status.source_location || uiLocation,
    };
  }

  return out;
}

function getLocationSliceFromJson(filters = {}) {
  const json = loadJSON("mine_planner.json");
  const locations = json.locations || json;

  if (!locations || !Object.keys(locations).length) {
    return { json, slice: {} };
  }

  const requestedRaw = filters.location || "PIT A";
  const requestedNorm = normalizeKey(requestedRaw);

  const matchedKey =
    Object.keys(locations).find((key) => normalizeKey(key) === requestedNorm) ||
    Object.keys(locations)[0];

  const slice = locations[matchedKey] || {};
  return { json, slice: withSourceLocation(slice, matchedKey) };
}

async function fetchMinePlannerFromML(filters = {}) {
  const location = encodeURIComponent(filters.location || "PIT A");
  const timePeriod = encodeURIComponent(filters.timePeriod || "");
  const shift = encodeURIComponent(filters.shift || "");

  const url =
    `${ML_API_URL}/api/mine-planner?location=${location}` +
    (timePeriod ? `&timePeriod=${timePeriod}` : "") +
    (shift ? `&shift=${shift}` : "");

  const res = await fetch(url);
  if (!res.ok) throw new Error("ML API error");
  const data = await res.json();

  const loc =
    data?.environment_conditions?.source_location ||
    data?.ai_recommendation?.source_location ||
    data?.road_conditions?.source_location ||
    data?.equipment_status?.source_location ||
    filters.location ||
    "PIT A";

  const norm = normalizeKey(loc);
  const matchedKey = norm === "PITA" ? "PIT_A" : norm === "PITB" ? "PIT_B" : String(loc);

  return withSourceLocation(data, matchedKey);
}

async function getMinePlanner(filters = {}) {
  if (USE_ML_API) {
    try {
      return await fetchMinePlannerFromML(filters);
    } catch {
      const { slice } = getLocationSliceFromJson(filters);
      return slice;
    }
  }

  const { slice } = getLocationSliceFromJson(filters);
  return slice;
}

export async function getEnvironmentConditions(filters = {}) {
  const data = await getMinePlanner(filters);
  return data.environment_conditions || null;
}

export async function getMineRoadConditions(filters = {}) {
  const data = await getMinePlanner(filters);
  return data.road_conditions || null;
}

export async function getEquipmentStatusMine(filters = {}) {
  const data = await getMinePlanner(filters);
  return data.equipment_status || null;
}

export async function getAIMineRecommendation(filters = {}) {
  const data = await getMinePlanner(filters);
  return data.ai_recommendation || null;
}
