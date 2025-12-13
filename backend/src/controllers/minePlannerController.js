import * as service from "../services/minePlannerService.js";
import { parseFilters } from "../utils/filterUtil.js";

export async function getMinePlanner(req, res) {
  const filters = parseFilters(req.query);

  const environment_conditions = await service.getEnvironmentConditions(filters);
  const road_conditions = await service.getMineRoadConditions(filters);
  const equipment_status = await service.getEquipmentStatusMine(filters);
  const ai_recommendation = await service.getAIMineRecommendation(filters);

  return res.json({
    environment_conditions,
    road_conditions,
    equipment_status,
    ai_recommendation,
  });
}

export async function getEnvironmentConditions(req, res) {
  const filters = parseFilters(req.query);
  const payload = await service.getEnvironmentConditions(filters);
  return res.json(payload);
}

export async function getMineRoadConditions(req, res) {
  const filters = parseFilters(req.query);
  const payload = await service.getMineRoadConditions(filters);
  return res.json(payload);
}

export async function getEquipmentStatusMine(req, res) {
  const filters = parseFilters(req.query);
  const payload = await service.getEquipmentStatusMine(filters);
  return res.json(payload);
}

export async function getAIMineRecommendation(req, res) {
  const filters = parseFilters(req.query);
  const payload = await service.getAIMineRecommendation(filters);
  return res.json(payload);
}
