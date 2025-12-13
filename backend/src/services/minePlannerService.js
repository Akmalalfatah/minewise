import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "../data/mine_planner.json");

let CACHE = null;

async function readMinePlannerData() {
  if (CACHE) return CACHE;

  const raw = await fs.readFile(DATA_PATH, "utf-8");
  CACHE = JSON.parse(raw);
  return CACHE;
}

function normalizeLocation(location) {
  if (!location) return "";
  return String(location)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");
}

function pickLocationKey(data, locationRaw) {
  const loc = normalizeLocation(locationRaw);

  if (loc && data[loc]) return loc;

  return data.PIT_A ? "PIT_A" : Object.keys(data)[0];
}

async function getLocationPayload(filters = {}) {
  const data = await readMinePlannerData();
  const key = pickLocationKey(data, filters.location);
  return data[key] || {};
}

export async function getEnvironmentConditions(filters = {}) {
  const payload = await getLocationPayload(filters);
  return payload.environment_conditions || {};
}

export async function getMineRoadConditions(filters = {}) {
  const payload = await getLocationPayload(filters);
  return payload.road_conditions || { segments: [], summary: {} };
}

export async function getEquipmentStatusMine(filters = {}) {
  const payload = await getLocationPayload(filters);
  return payload.equipment_status || { summary: {}, equipments: [], fleet_overview: [] };
}

export async function getAIMineRecommendation(filters = {}) {
  const payload = await getLocationPayload(filters);
  return payload.ai_recommendation || { scenarios: [], analysis_sources: "" };
}
