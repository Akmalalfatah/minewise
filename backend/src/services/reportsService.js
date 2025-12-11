import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../db/index.js";
import { loadJSON } from "../utils/jsonLoader.js";
import { buildMinewisePdf } from "../utils/buildMinewisePdf.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, "..", "..");
const GENERATED_DIR = path.join(ROOT_DIR, "generated_reports");

export function getReportGeneratorForm() {
  const json = loadJSON("reports.json");
  return json.generator_form || null;
}

function pickDefaultLocationBlock(raw, preferredKey) {
  if (!raw || typeof raw !== "object") return {};

  if (!raw.locations) return raw;

  if (preferredKey && raw.locations[preferredKey]) {
    return raw.locations[preferredKey];
  }

  const keys = Object.keys(raw.locations);
  if (keys.length === 0) return {};
  return raw.locations[keys[0]] || {};
}

function loadRawDataForReport() {
  const rawDashboard = loadJSON("dashboard.json");
  const rawMinePlanner = loadJSON("mine_planner.json");
  const rawShipping = loadJSON("shipping_planner.json");

  let simulationRaw = {};
  try {
    simulationRaw = loadJSON("simulation_analysis.json");
  } catch {
    simulationRaw = {};
  }

  let simulationAnalysis = {
    scenario_analysis: {
      simulations: [],
    },
  };

  if (
    simulationRaw.scenario_analysis &&
    Array.isArray(simulationRaw.scenario_analysis.simulations)
  ) {
    simulationAnalysis = simulationRaw;
  } else if (
    simulationRaw.scenarios &&
    typeof simulationRaw.scenarios === "object"
  ) {
    simulationAnalysis.scenario_analysis.simulations = Object.values(
      simulationRaw.scenarios
    ).map((s) => ({
      title: s.title || "Scenario",
      description: s.description || "",
      impact: {
        production_change_pct:
          s.production_output_pct !== undefined
            ? s.production_output_pct + "%"
            : null,
        cost_efficiency_pct:
          s.cost_efficiency_pct !== undefined
            ? s.cost_efficiency_pct + "%"
            : null,
        risk_level_pct:
          s.risk_level_pct !== undefined ? s.risk_level_pct + "%" : null,
      },
      recommended_actions: [],
      notes: "",
    }));
  }

  const dashboard = pickDefaultLocationBlock(rawDashboard, "PIT A");
  const minePlanner = pickDefaultLocationBlock(rawMinePlanner, "PIT A");
  const shipping = pickDefaultLocationBlock(rawShipping, "Port A");

  return { dashboard, minePlanner, shipping, simulationAnalysis };
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

export async function generateAndStorePdf(payload = {}, userId = null) {
  const rawData = loadRawDataForReport();

  const pdfBuffer = await buildMinewisePdf({
    report_type: payload.report_type || null,
    time_period: payload.time_period || null,
    sections: payload.sections || [],
    notes: payload.notes || "",
    data: rawData,
  });

  await ensureDir(GENERATED_DIR);

  const safeUser = userId ? `user_${userId}` : "anonymous";
  const userDirRelative = path.join("generated_reports", safeUser);
  const userDirAbsolute = path.join(ROOT_DIR, userDirRelative);

  await ensureDir(userDirAbsolute);

  const timestamp = Date.now();
  const baseName = payload.report_type || "custom";
  const filename = `MineWise_Report_${baseName}_${timestamp}.pdf`;

  const absolutePath = path.join(userDirAbsolute, filename);
  const relativePath = path.join(userDirRelative, filename);

  await fs.promises.writeFile(absolutePath, pdfBuffer);

  const [result] = await pool.query(
    "INSERT INTO reports_generated (user_id, sections, report_file_path) VALUES (?, ?, ?)",
    [userId, JSON.stringify(payload.sections || []), relativePath]
  );

  return {
    buffer: pdfBuffer,
    filename,
    reportId: result.insertId,
  };
}

export async function generateReport(payload = {}, userId = null) {
  const { reportId, filename } = await generateAndStorePdf(payload, userId);
  return {
    status: "success",
    report_id: reportId,
    filename,
    generated_at: new Date().toISOString(),
    options: payload,
  };
}

export async function downloadReport(payload = {}, userId = null) {
  const rawData = loadRawDataForReport();

  const pdfBuffer = await buildMinewisePdf({
    report_type: payload.report_type || null,
    time_period: payload.time_period || null,
    sections: payload.sections || [],
    notes: payload.notes || "",
    data: rawData,
  });

  const baseName = payload.report_type || "custom";
  const filename = `MineWise_Report_${baseName}_${Date.now()}.pdf`;

  return { buffer: pdfBuffer, filename };
}

export async function getRecentReports(limit = 6) {
  const [rows] = await pool.query(
    "SELECT id, user_id, sections, report_file_path, generated_at FROM reports_generated ORDER BY generated_at DESC LIMIT ?",
    [limit]
  );

  return rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    sections: row.sections,
    report_file_path: row.report_file_path,
    generated_at: row.generated_at,
    title: `Report ${new Date(row.generated_at).toLocaleString("id-ID", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`,
  }));
}

export async function getReportFileById(id) {
  const [rows] = await pool.query(
    "SELECT report_file_path FROM reports_generated WHERE id = ?",
    [id]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  const storedPath = rows[0].report_file_path;
  const absolutePath = path.join(ROOT_DIR, storedPath);
  const buffer = await fs.promises.readFile(absolutePath);
  const filename = path.basename(absolutePath);

  return { buffer, filename };
}

export async function getScheduledReports() {
  const json = loadJSON("reports.json");
  return json.scheduled_reports || [];
}

export async function getExportTemplates() {
  const json = loadJSON("reports.json");
  if (Array.isArray(json.templates) && json.templates.length > 0) {
    return json.templates;
  }
  if (json.generator_form && Array.isArray(json.generator_form.templates)) {
    return json.generator_form.templates;
  }
  return [];
}

export async function getReportReview() {
  const json = loadJSON("reports.json");
  if (json.review) return json.review;
  return {
    executiveSummaryText: "No review available",
    aiRecommendationsText: "",
    operationalOverviewText: "",
    costAnalysisText: "",
  };
}
