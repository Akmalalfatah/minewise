import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "../data/simulation_analysis.json");

function loadSimulationData() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function getSimulationOverview() {
  const raw = loadSimulationData();

  const input = raw.input_parameters || {};
  const impactNotes = input.impact_notes || {};

  const inputParameters = {
    expectedRainfallMm: input.expected_rainfall_mm ?? 0,
    equipmentHealthPct: input.equipment_health_pct ?? 0,
    vesselDelayHours: input.vessel_delay_hours ?? 0,
    impactNotes: {
      rainfall: impactNotes.rainfall || "",
      equipmentHealth: impactNotes.equipment_health || "",
      vesselDelay: impactNotes.vessel_delay || "",
    },
  };

  const scenarios = Object.entries(raw.scenarios || {}).map(
    ([id, value]) => ({
      id,
      title: value.title,
      productionOutputPct: value.production_output_pct,
      costEfficiencyPct: value.cost_efficiency_pct,
      riskLevelPct: value.risk_level_pct,
    })
  );

  const aiRecommendations = Object.entries(
    raw.ai_recommendations || {}
  )
    .filter(([key]) => key !== "description")
    .map(([id, value]) => ({
      id,
      title: value.title,
      detail: value.detail,
    }));

  const description = raw.ai_recommendations?.description || "";

  return {
    inputParameters,
    scenarios,
    aiRecommendations,
    description,
  };
}
