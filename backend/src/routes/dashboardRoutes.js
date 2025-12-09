import express from "express";
import {
  getTotalProduction,
  getWeatherCondition,
  getProductionEfficiency,
  getEquipmentStatus,
  getVesselStatus,
  getProductionWeatherOverview,
  getRoadConditionOverview,
  getCausesOfDowntime,
  getDecisionImpact,
  getAISummary,
} from "../controllers/dashboardController.js";
import { getDashboard } from "../services/dashboardService.js";
import { parseFilters } from "../utils/filterUtil.js";

const router = express.Router();

// GET /dashboard -> sudah mendukung filter (location, dst)
router.get("/", (req, res) => {
  const filters = parseFilters(req.query);
  const payload = getDashboard(filters);
  res.json(payload);
});

router.get("/total-production", getTotalProduction);
router.get("/weather-condition", getWeatherCondition);
router.get("/production-efficiency", getProductionEfficiency);
router.get("/equipment-status", getEquipmentStatus);
router.get("/vessel-status", getVesselStatus);
router.get("/production-weather-overview", getProductionWeatherOverview);
router.get("/road-condition-overview", getRoadConditionOverview);
router.get("/causes-of-downtime", getCausesOfDowntime);
router.get("/decision-impact", getDecisionImpact);
router.get("/ai-summary", getAISummary);

export default router;
