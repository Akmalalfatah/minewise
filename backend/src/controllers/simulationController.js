import { getSimulationOverview as getSimulationOverviewService } from "../services/simulationService.js";

export async function getSimulationOverview(req, res, next) {
  try {
    const input = req.query || {};
    const data = await getSimulationOverviewService(input);
    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function runSimulation(req, res, next) {
  try {
    const input = req.body || {};
    const data = await getSimulationOverviewService(input);
    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
}
