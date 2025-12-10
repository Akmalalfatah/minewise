import { getSimulationOverview as getSimulationOverviewService } from "../services/simulationService.js";

export async function getSimulationOverview(req, res, next) {
  try {
    const data = await getSimulationOverviewService();

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
}
