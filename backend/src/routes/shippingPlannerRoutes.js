import express from "express";
import {
    getPortWeatherConditions,
    getAIShippingRecommendation,
    getVesselSchedule,
    getCoalVolumeReady,
    getLoadingProgress,
    getPortCongestionStatus,
} from "../controllers/shippingPlannerController.js";

const router = express.Router();

router.get("/port-weather", getPortWeatherConditions);
router.get("/ai-recommendation", getAIShippingRecommendation);
router.get("/vessel-schedules", getVesselSchedule);
router.get("/coal-volume", getCoalVolumeReady);
router.get("/loading-progress", getLoadingProgress);
router.get("/port-congestion", getPortCongestionStatus);

export default router;
