import { loadJSON } from "../utils/jsonLoader.js";

const USE_ML_API = String(process.env.USE_ML_API || "").toLowerCase() === "true";
const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

function normalizeKey(key) {
  return String(key || "").replace(/\s+/g, "").replace(/_/g, "").toUpperCase();
}

function getPortSliceFromJson(filters = {}) {
  const json = loadJSON("shipping_planner.json");
  const ports = json.ports || json;

  if (!ports || !Object.keys(ports).length) {
    return { json, slice: {} };
  }

  const requestedRaw = filters.location || "Port A";
  const requestedNorm = normalizeKey(requestedRaw);

  const matchedKey =
    Object.keys(ports).find((key) => normalizeKey(key) === requestedNorm) ||
    Object.keys(ports)[0];

  return { json, slice: ports[matchedKey] || {} };
}

async function fetchShippingPlannerFromML(filters = {}) {
  const location = encodeURIComponent(filters.location || "Port A");
  const timePeriod = encodeURIComponent(filters.timePeriod || "");
  const shift = encodeURIComponent(filters.shift || "");

  const url =
    `${ML_API_URL}/api/shipping-planner?location=${location}` +
    (timePeriod ? `&timePeriod=${timePeriod}` : "") +
    (shift ? `&shift=${shift}` : "");

  const res = await fetch(url);
  if (!res.ok) throw new Error("ML API error");
  return await res.json();
}

async function getShippingPlanner(filters = {}) {
  if (USE_ML_API) {
    try {
      return await fetchShippingPlannerFromML(filters);
    } catch {
      const { slice } = getPortSliceFromJson(filters);
      return slice;
    }
  }

  const { slice } = getPortSliceFromJson(filters);
  return slice;
}

export async function getPortWeatherConditions(filters = {}) {
  const data = await getShippingPlanner(filters);
  return data.port_weather_conditions || null;
}

export async function getAIShippingRecommendation(filters = {}) {
  const data = await getShippingPlanner(filters);
  return (
    data.ai_recommendation || {
      scenarios: [],
      analysis_sources: "-",
    }
  );
}

export async function getVesselSchedules(filters = {}) {
  const data = await getShippingPlanner(filters);
  return data.vessel_schedules || [];
}

export async function getCoalVolumeReady(filters = {}) {
  const data = await getShippingPlanner(filters);
  return data.coal_volume_ready || [];
}

export async function getLoadingProgress(filters = {}) {
  const data = await getShippingPlanner(filters);
  return data.loading_progress || [];
}

export async function getPortCongestionStatus(filters = {}) {
  const data = await getShippingPlanner(filters);
  return data.port_congestion || null;
}
