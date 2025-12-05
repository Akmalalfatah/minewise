import { loadJSON } from "../utils/jsonLoader.js";
import { applyFilters } from "../utils/filterUtil.js";

export function getEnvironmentConditions(filters = {}) {
  const json = loadJSON("mine_planner.json");
  return json.environment_conditions || null;
}

export function getAIMineRecommendation(filters = {}) {
  const json = loadJSON("mine_planner.json");
  return json.ai_recommendation || null;
}

export function getMineRoadConditions(filters = {}) {
  const json = loadJSON("mine_planner.json");
  const rc = json.road_conditions || {};
  if (rc.road_segments) rc.road_segments = applyFilters(rc.road_segments, filters);
  return rc;
}

export function getEquipmentStatusMine(filters = {}) {
  const json = loadJSON("mine_planner.json");
  return json.equipment_status || null;
}
