import express from "express";
import {
    getEnvironmentConditions,
    getMineRoadConditions,
    getEquipmentStatusMine,
    getAIMineRecommendation,
} from "../controllers/minePlannerController.js";

const router = express.Router();

router.get("/environment-conditions", getEnvironmentConditions);
router.get("/road-conditions", getMineRoadConditions);
router.get("/equipment-status", getEquipmentStatusMine);
router.get("/ai-mine-recommendation", getAIMineRecommendation);

export default router;
