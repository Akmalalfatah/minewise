import { loadJSON } from "../utils/jsonLoader.js";

function normalizeKey(key) {
  return String(key || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "")
    .toUpperCase();
}

function formatTon(v) {
  if (v === null || v === undefined || v === "") return "-";
  if (typeof v === "number") return `${v.toLocaleString("en-US")} ton`;
  return String(v);
}

function getPortSliceFromJson(filters = {}) {
  const json = loadJSON("shipping_planner.json");
  const ports = json?.ports || json;

  if (!ports || !Object.keys(ports).length) {
    return { json, slice: {} };
  }

  const requestedRaw = filters.location || "PORT";
  const requestedNorm = normalizeKey(requestedRaw);

  const matchedKey =
    Object.keys(ports).find((key) => normalizeKey(key) === requestedNorm) ||
    Object.keys(ports)[0];

  return { json, slice: ports[matchedKey] || {} };
}

async function getShippingPlanner(filters = {}) {
  const { slice } = getPortSliceFromJson(filters);
  return slice || {};
}

export async function getPortWeatherConditions(filters = {}) {
  const data = await getShippingPlanner(filters);
  return data?.port_weather_conditions || null;
}

export async function getAIShippingRecommendation(filters = {}) {
  const data = await getShippingPlanner(filters);
  return (
    data?.ai_recommendation || {
      scenarios: [],
      analysis_sources: "-",
    }
  );
}

export async function getVesselSchedules(filters = {}) {
  const data = await getShippingPlanner(filters);
  const raw = Array.isArray(data?.vessel_schedules) ? data.vessel_schedules : [];

  const vessels = raw.map((v, i) => ({
    id: v.id || `${i + 1}`,
    name: v.name || v.vessel_name || `Vessel ${i + 1}`,
    destination: v.destination || "-",
    status: v.status || "-",
    plannedLoad: v.plannedLoad || v.planned_load || "-",
    loaded: v.loaded || v.loaded_ton || v.tonnage_loaded || "0 ton",
    eta: v.eta || "-",
    etd: v.etd || "-",
  }));

  return { vessels };
}

export async function getCoalVolumeReady(filters = {}) {
  const data = await getShippingPlanner(filters);
  const raw = Array.isArray(data?.coal_volume_ready) ? data.coal_volume_ready : [];

  const stockpiles = raw.map((sp, i) => ({
    id: sp.id || `${i + 1}`,
    name: sp.name || sp.stockpile || `SP_${i + 1}`,
    volume: sp.volume !== undefined ? formatTon(sp.volume) : sp.volume || "-",
    cv: sp.cv || sp.grade || "-",
    moisture: sp.moisture || "-",
    status: sp.status || "-",
    eta: sp.eta || "-",
    etd: sp.etd || "-",
  }));

  return { stockpiles };
}

export async function getLoadingProgress(filters = {}) {
  const data = await getShippingPlanner(filters);
  const raw = Array.isArray(data?.loading_progress) ? data.loading_progress : [];

  const shipments = raw.map((s, i) => {
    const progress =
      s.progress !== undefined && s.progress !== null
        ? s.progress
        : s.tonnage_target
        ? Math.round(((Number(s.tonnage_loaded) || 0) / Number(s.tonnage_target)) * 100)
        : 0;

    const loaded =
      s.loaded ??
      (s.tonnage_loaded !== undefined ? `${Math.round(Number(s.tonnage_loaded) || 0)} TON` : "0 TON");

    return {
      id: s.id || `${i + 1}`,
      name: s.name || s.vessel_name || `Vessel ${i + 1}`,
      progress,
      loaded,
      status: s.status || "-",
      eta: s.eta || "-",
      etd: s.etd || "-",
    };
  });

  return { shipments };
}

export async function getPortCongestionStatus(filters = {}) {
  const data = await getShippingPlanner(filters);
  return data?.port_congestion || null;
}
