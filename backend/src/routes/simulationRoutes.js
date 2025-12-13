import express from "express";
import {
  getSimulationOverview,
  runSimulation,
} from "../controllers/simulationController.js";

const router = express.Router();

// GET /api/simulation-analysis
router.get("/", getSimulationOverview);

// POST /api/simulation-analysis
router.post("/", runSimulation);

export default router;
