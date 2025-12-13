import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "../data/simulation_analysis.json");

const USE_ML_API = String(process.env.USE_ML_API || "").toLowerCase() === "true";
const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

function loadSimulationData() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function mapSimulationResponse(raw) {
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

  const scenarios = Object.entries(raw.scenarios || {}).map(([id, value]) => ({
    id,
    title: value.title,
    productionOutputPct: value.production_output_pct,
    costEfficiencyPct: value.cost_efficiency_pct,
    riskLevelPct: value.risk_level_pct,
  }));

  const aiRecommendations = Object.entries(raw.ai_recommendations || {})
    .filter(([key]) => key !== "description")
    .map(([id, value]) => ({
      id,
      title: value.title,
      detail: value.detail,
    }));

  const description = raw.ai_recommendations?.description || "";

  return { inputParameters, scenarios, aiRecommendations, description };
}

function normalizeInput(input = {}) {
  const expected_rainfall_mm = Number(
    input.expected_rainfall_mm ?? input.expectedRainfallMm ?? input.expectedRainfall ?? 50
  );
  const equipment_health_pct = Number(
    input.equipment_health_pct ?? input.equipmentHealthPct ?? input.equipmentHealth ?? 80
  );
  const vessel_delay_hours = Number(
    input.vessel_delay_hours ?? input.vesselDelayHours ?? input.vesselDelay ?? 5
  );

  return { expected_rainfall_mm, equipment_health_pct, vessel_delay_hours };
}

async function fetchSimulationFromML(input = null) {
  const body = normalizeInput(input || {});

  const res = await fetch(`${ML_API_URL}/api/simulation-analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ML API error: ${res.status} ${text}`);
  }

  return await res.json();
}

export async function getSimulationOverview(input = null) {
  if (USE_ML_API) {
    try {
      const mlResult = await fetchSimulationFromML(input);
      return mapSimulationResponse(mlResult);
    } catch {
      const raw = loadSimulationData();
      return mapSimulationResponse(raw);
    }
  }

  const raw = loadSimulationData();
  return mapSimulationResponse(raw);
}
