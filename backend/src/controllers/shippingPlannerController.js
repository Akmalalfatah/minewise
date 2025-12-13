import * as service from "../services/shippingPlannerService.js";
import { parseFilters } from "../utils/filterUtil.js";

export async function getShippingPlanner(req, res) {
  const filters = parseFilters(req.query);

  const port_weather_conditions = await service.getPortWeatherConditions(filters);
  const ai_recommendation = await service.getAIShippingRecommendation(filters);
  const vessel_schedules = await service.getVesselSchedules(filters);
  const coal_volume_ready = await service.getCoalVolumeReady(filters);
  const loading_progress = await service.getLoadingProgress(filters);
  const port_congestion = await service.getPortCongestionStatus(filters);

  return res.json({
    port_weather_conditions,
    ai_recommendation,
    vessel_schedules,
    coal_volume_ready,
    loading_progress,
    port_congestion,
  });
}

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
