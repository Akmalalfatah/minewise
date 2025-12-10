import express from "express";
import { getSimulationOverview } from "../controllers/simulationController.js";

const router = express.Router();

router.get("/overview", getSimulationOverview);

export default router;
