import * as service from "../services/shippingPlannerService.js";
import { parseFilters } from "../utils/filterUtil.js";

export async function getPortWeatherConditions(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getPortWeatherConditions(filters);
    return res.json(payload);
}

export async function getAIShippingRecommendation(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getAIShippingRecommendation(filters);
    return res.json(payload);
}

export async function getVesselSchedules(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getVesselSchedules(filters);
    return res.json(payload);
}

export async function getCoalVolumeReady(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getCoalVolumeReady(filters);
    return res.json(payload);
}

export async function getLoadingProgress(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getLoadingProgress(filters);
    return res.json(payload);
}

export async function getPortCongestionStatus(req, res) {
    const filters = parseFilters(req.query);
    const payload = await service.getPortCongestionStatus(filters);
    return res.json(payload);
}
