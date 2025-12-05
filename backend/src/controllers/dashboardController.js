import * as service from "../services/dashboardService.js";
import { parseFilters } from "../utils/filterUtil.js";

export async function getTotalProduction(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getTotalProduction(filters);
    return res.json({ total_production: payload });
}

export async function getWeatherCondition(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getWeatherCondition(filters);
    return res.json({ weather_condition: payload });
}

export async function getProductionEfficiency(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getProductionEfficiency(filters);
    return res.json({ production_efficiency: payload });
}

export async function getEquipmentStatus(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getEquipmentStatus(filters);
    return res.json({ equipment_status: payload });
}

export async function getVesselStatus(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getVesselStatus(filters);
    return res.json({ vessel_status: payload });
}

export async function getProductionWeatherOverview(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getProductionWeatherOverview(filters);
    return res.json({ production_weather_overview: payload });
}

export async function getRoadConditionOverview(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getRoadConditionOverview(filters);
    return res.json({ road_condition_overview: payload });
}

export async function getCausesOfDowntime(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getCausesOfDowntime(filters);
    return res.json({ causes_of_downtime: payload });
}

export async function getDecisionImpact(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getDecisionImpact(filters);
    return res.json({ decision_impact: payload });
}

export async function getAISummary(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getAISummary(filters);
    return res.json({ ai_summary: payload });
}
