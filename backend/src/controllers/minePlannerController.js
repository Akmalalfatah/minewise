import * as service from "../services/minePlannerService.js";
import { parseFilters } from "../utils/filterUtil.js";

export async function getEnvironmentConditions(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getEnvironmentConditions(filters);
    return res.json({ environment_conditions: payload });
}

export async function getMineRoadConditions(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getMineRoadConditions(filters);
    return res.json({ road_conditions: payload });
}

export async function getEquipmentStatusMine(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getEquipmentStatusMine(filters);
    return res.json({ equipment_status: payload });
}

export async function getAIMineRecommendation(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getAIMineRecommendation(filters);
    return res.json({ ai_mine_recommendation: payload });
}
