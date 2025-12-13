import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getSimulationPrediction } from "../services/mlService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadFallbackData() {
  const filePath = path.join(
    __dirname,
    "../data/output_simulation_analysis_real.json"
  );
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function mapResponse(input, mlResult) {
  const { description, ...recommendations } = mlResult.ai_recommendations || {};

  return {
    inputParameters: {
      expectedRainfallMm: input.expected_rainfall_mm,
      equipmentHealthPct: input.equipment_health_pct,
      vesselDelayHours: input.vessel_delay_hours,
      impactNotes: {
        rainfall: "Impact: Road conditions & mining operations",
        equipmentHealth: "Impact: Load efficiency & operating hours",
        vesselDelay: "Impact: Port queue & hauling coordination"
      }
    },
    scenarios: [
      {
        id: "baseline",
        title: "Baseline Scenario",
        productionOutputPct: mlResult.scenarios.baseline.production_output_pct,
        costEfficiencyPct: mlResult.scenarios.baseline.cost_efficiency_pct,
        riskLevelPct: mlResult.scenarios.baseline.risk_level_pct
      },
      {
        id: "optimized",
        title: "Optimized Scenario",
        productionOutputPct: mlResult.scenarios.optimized.production_output_pct,
        costEfficiencyPct: mlResult.scenarios.optimized.cost_efficiency_pct,
        riskLevelPct: mlResult.scenarios.optimized.risk_level_pct
      },
      {
        id: "conservative",
        title: "Conservative Scenario",
        productionOutputPct: mlResult.scenarios.conservative.production_output_pct,
        costEfficiencyPct: mlResult.scenarios.conservative.cost_efficiency_pct,
        riskLevelPct: mlResult.scenarios.conservative.risk_level_pct
      }
    ],
    aiRecommendations: Object.entries(recommendations).map(
      ([key, value]) => ({
        id: key,
        title: value.title,
        detail: value.detail
      })
    ),
    description:
      description || "Rekomendasi di bawah ini diasumsikan berdasarkan skenario terpilih."
  };
}

export async function getSimulationOverview(req, res) {
  const expected_rainfall_mm = Number(req.query.expected_rainfall_mm) || 50;
  const equipment_health_pct = Number(req.query.equipment_health_pct) || 80;
  const vessel_delay_hours = Number(req.query.vessel_delay_hours) || 5;

  const input = {
    expected_rainfall_mm,
    equipment_health_pct,
    vessel_delay_hours
  };

  try {
    const mlResult = await getSimulationPrediction(input);
    const response = mapResponse(input, mlResult);
    res.json(response);
  } catch (error) {
    const fallback = loadFallbackData();
    const mappedFallback = {
      inputParameters: {
        expectedRainfallMm: fallback.input_parameters.expected_rainfall_mm,
        equipmentHealthPct: fallback.input_parameters.equipment_health_pct,
        vesselDelayHours: fallback.input_parameters.vessel_delay_hours,
        impactNotes: {
          rainfall: fallback.input_parameters.impact_notes?.rainfall || "",
          equipmentHealth: fallback.input_parameters.impact_notes?.equipment_health || "",
          vesselDelay: fallback.input_parameters.impact_notes?.vessel_delay || ""
        }
      },
      scenarios: Object.entries(fallback.scenarios).map(([key, value]) => ({
        id: key,
        title: value.title,
        productionOutputPct: value.production_output_pct,
        costEfficiencyPct: value.cost_efficiency_pct,
        riskLevelPct: value.risk_level_pct
      })),
      aiRecommendations: Object.entries(fallback.ai_recommendations || {})
        .filter(([key]) => key !== "description")
        .map(([key, value]) => ({
          id: key,
          title: value.title,
          detail: value.detail
        })),
      description:
        "Rekomendasi di bawah ini diasumsikan berdasarkan skenario terpilih."
    };
    res.json(mappedFallback);
  }
}
