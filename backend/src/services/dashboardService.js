import { loadJSON } from "../utils/jsonLoader.js";
import { applyFilters } from "../utils/filterUtil.js";

const USE_ML_API = String(process.env.USE_ML_API || "").toLowerCase() === "true";
const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

function getLocationSliceFromJson(filters = {}) {
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

async function fetchDashboardFromML(filters = {}) {
  const location = encodeURIComponent(filters.location || "PIT A");
  const timePeriod = encodeURIComponent(filters.timePeriod || "");
  const shift = encodeURIComponent(filters.shift || "");

  const url =
    `${ML_API_URL}/api/dashboard?location=${location}` +
    (timePeriod ? `&timePeriod=${timePeriod}` : "") +
    (shift ? `&shift=${shift}` : "");

  const res = await fetch(url);
  if (!res.ok) throw new Error("ML API error");
  return await res.json();
}

export async function getDashboard(filters = {}) {
  if (USE_ML_API) {
    try {
      return await fetchDashboardFromML(filters);
    } catch {
      const { slice } = getLocationSliceFromJson(filters);
      return slice;
    }
  }

  const { slice } = getLocationSliceFromJson(filters);
  return slice;
}

export async function getTotalProduction(filters = {}) {
  const data = await getDashboard(filters);
  return data.total_production || null;
}

export async function getWeatherCondition(filters = {}) {
  const data = await getDashboard(filters);
  return data.weather_condition || null;
}

export async function getProductionEfficiency(filters = {}) {
  const data = await getDashboard(filters);
  return data.production_efficiency || null;
}

export async function getEquipmentStatus(filters = {}) {
  const data = await getDashboard(filters);
  return data.equipment_status || null;
}

export async function getVesselStatus(filters = {}) {
  const data = await getDashboard(filters);
  return data.vessel_status || null;
}

export async function getProductionWeatherOverview(filters = {}) {
  const data = await getDashboard(filters);
  return data.production_weather_overview || {};
}

export async function getRoadConditionOverview(filters = {}) {
  const data = await getDashboard(filters);
  const rc = data.road_condition_overview || {};

  if (rc.segments && Array.isArray(rc.segments)) {
    rc.segments = applyFilters(rc.segments, filters);
  }

  return rc;
}

export async function getCausesOfDowntime(filters = {}) {
  const data = await getDashboard(filters);
  return data.causes_of_downtime || null;
}

export async function getDecisionImpact(filters = {}) {
  const data = await getDashboard(filters);
  return data.decision_impact || null;
}

export async function getAISummary(filters = {}) {
  const data = await getDashboard(filters);
  return data.ai_summary || null;
}
