import PDFDocument from "pdfkit";

const BRAND_COLOR = "#1C2534";
const TEXT_COLOR = "#000000";

function mapReportType(v) {
  const map = {
    daily: "Daily Report",
    weekly: "Weekly Report",
    monthly: "Monthly Report",
  };
  return map[v] || "Custom Report";
}

function mapTimePeriod(v) {
  const map = {
    today: "Today",
    last_7_days: "Last 7 Days",
    last_30_days: "Last 30 Days",
  };
  return map[v] || "Current Period";
}

function hasSection(arr, name) {
  return Array.isArray(arr) && arr.includes(name);
}

function formatPercent(n) {
  return typeof n === "number" ? `${n.toFixed(1)}%` : "—";
}

function formatNumber(n) {
  return typeof n === "number" ? `${n}` : "—";
}

function drawTable(doc, headers, rows, colFractions) {
  if (!rows || rows.length === 0) return;

  const marginL = doc.page.margins.left;
  const marginR = doc.page.margins.right;
  const fullWidth = doc.page.width - marginL - marginR;

  const cols =
    colFractions && colFractions.length === headers.length
      ? colFractions
      : new Array(headers.length).fill(1 / headers.length);

  const widths = cols.map((f) => f * fullWidth);
  const rowHeight = 22;

  const bottomY = () => doc.page.height - doc.page.margins.bottom;

  const drawHeader = () => {
    let headerTop = doc.y + 10;
    if (headerTop + rowHeight > bottomY()) {
      doc.addPage();
      headerTop = doc.page.margins.top;
    }

    let x = marginL;
    for (let i = 0; i < headers.length; i++) {
      const w = widths[i];

      doc.fillColor(BRAND_COLOR).rect(x, headerTop, w, rowHeight).fill();
      doc
        .fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(headers[i], x + 6, headerTop + 5, {
          width: w - 12,
          align: "center",
          height: rowHeight - 10,
          ellipsis: true,
        });

      x += w;
    }

    doc.y = headerTop + rowHeight;
  };

  const drawRow = (row, rowIndex) => {
    // cek apakah baris berikutnya muat di halaman ini
    if (doc.y + rowHeight > bottomY()) {
      doc.addPage();
      drawHeader();
    }

    const y = doc.y;
    let xRow = marginL;
    const bg = rowIndex % 2 === 0 ? "#F7F7F7" : "#FFFFFF";

    for (let i = 0; i < headers.length; i++) {
      const w = widths[i];
      const txt = row[i] ?? "—";

      doc.fillColor(bg).rect(xRow, y, w, rowHeight).fill();
      doc
        .strokeColor("#B0B0B0")
        .lineWidth(0.5)
        .rect(xRow, y, w, rowHeight)
        .stroke();

      doc
        .fillColor(TEXT_COLOR)
        .font("Helvetica")
        .fontSize(10)
        .text(String(txt), xRow + 6, y + 5, {
          width: w - 12,
          align: "left",
          height: rowHeight - 10,
          ellipsis: true,
        });

      xRow += w;
    }

    doc.y = y + rowHeight;
  };

  drawHeader();
  rows.forEach((row, idx) => drawRow(row, idx));
  doc.moveDown(1.5);
  doc.x = marginL;
}

function drawKpi(doc, kpi) {
  const headers = ["Metric", "Value"];
  const rows = [
    [
      "Total Production",
      `${kpi.totalProduction} ton (Target ${kpi.productionTarget} ton)`,
    ],
    ["Achievement %", kpi.achievementPercent],
    ["Active Excavators", kpi.activeExcavators],
    ["Active Dump Trucks", kpi.activeDumpTrucks],
  ];
  drawTable(doc, headers, rows, [0.5, 0.5]);
}

export function buildMinewisePdf(payload = {}) {
  const { report_type, time_period, sections = [], notes = "", data = {} } =
    payload;

  const dashboard = data.dashboard || {};
  const minePlanner = data.minePlanner || {};
  const shipping = data.shipping || {};
  const simulationAnalysis = data.simulationAnalysis || {};

  const totalProd = dashboard.total_production || {};
  const weatherDash = dashboard.weather_condition || {};
  const roadOverview = dashboard.road_condition_overview || {};
  const downtime = dashboard.causes_of_downtime || {};
  const decisionImpact = (dashboard.decision_impact || {}).correlation || {};
  const aiSummary = (dashboard.ai_summary || {}).summary_points || [];

  const env =
    minePlanner.environment_conditions ||
    shipping.environment_conditions ||
    shipping.port_weather_conditions ||
    {};

  const envRisk =
    env.risk || {
      score: shipping.port_weather_conditions?.riskScore,
      title: shipping.port_weather_conditions?.riskTitle,
      subtitle: shipping.port_weather_conditions?.riskSubtitle,
    };

  const ai =
    minePlanner.ai_recommendation ||
    dashboard.ai_recommendation ||
    shipping.ai_recommendation ||
    {};

  const aiScenarios = ai.scenarios || [];

  const road = minePlanner.road_conditions || shipping.road_conditions || {};
  const roadAlert = road.alert || {};

  const equip =
    minePlanner.equipment_status || dashboard.equipment_status || {};

  const equipSummary = equip.summary || {};
  const equipRows = equip.equipments || [];
  const fleetRows = equip.fleet_overview || [];

  const scenarioAnalysisBlock =
    simulationAnalysis.scenario_analysis || {};
  const scenarioSimulations = scenarioAnalysisBlock.simulations || [];

  let totalProduction = formatNumber(totalProd.produce_ton);
  let productionTarget = formatNumber(totalProd.target_ton);

  let achievementPercent = "—";
  if (totalProd.produce_ton && totalProd.target_ton) {
    achievementPercent = formatPercent(
      (totalProd.produce_ton / totalProd.target_ton) * 100
    );
  } else if (typeof totalProd.deviation_pct === "number") {
    achievementPercent = formatPercent(100 + totalProd.deviation_pct);
  }

  const avgProductionPerDay = formatNumber(totalProd.avg_production_per_day);

  let activeExcavators = "—";
  let activeDumpTrucks = "—";

  const fleetExc = fleetRows.find((f) =>
    (f.equipmentType || "").toLowerCase().includes("excavator")
  );
  const fleetTruck = fleetRows.find((f) =>
    (f.equipmentType || "").toLowerCase().includes("truck")
  );

  if (fleetExc) activeExcavators = formatNumber(fleetExc.active);
  if (fleetTruck) activeDumpTrucks = formatNumber(fleetTruck.active);

  const weatherRain =
    env.rainfall ||
    (typeof weatherDash.rain_probability_pct === "number"
      ? `${weatherDash.rain_probability_pct}%`
      : "—");

  const weatherTemp = env.temperature || "—";

  const roadSegments = roadOverview.segments || [];

  let worstSegment = null;
  if (roadSegments.length > 0) {
    worstSegment =
      roadSegments.find((s) =>
        (s.status || "").toLowerCase().includes("banjir")
      ) ||
      roadSegments.find((s) =>
        (s.status || "").toLowerCase().includes("critical")
      ) ||
      roadSegments.find((s) =>
        (s.status || "").toLowerCase().includes("waspada")
      ) ||
      roadSegments[roadSegments.length - 1];
  }

  const roadCondLabel =
    road.road_condition_label ||
    (worstSegment && worstSegment.status) ||
    "—";

  const roadFriction =
    road.friction_index ?? (worstSegment && worstSegment.friction) ?? "—";

  const roadAlertTitle =
    roadAlert.title || (worstSegment && worstSegment.status) || "—";

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const reportTypeLabel = mapReportType(report_type);
      const timePeriodLabel = mapTimePeriod(time_period);
      const generatedAt = new Date().toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // ===== HEADER UTAMA =====
      doc
        .fillColor(BRAND_COLOR)
        .font("Helvetica-Bold")
        .fontSize(20)
        .text("MineWise Operational Report", {
          align: "center",
        });

      doc
        .moveDown(0.3)
        .fillColor(TEXT_COLOR)
        .font("Helvetica")
        .fontSize(11)
        .text(`${reportTypeLabel} • ${timePeriodLabel}`, {
          align: "center",
        });

      doc
        .moveDown(0.2)
        .fontSize(9)
        .fillColor("#555555")
        .text(`Generated at: ${generatedAt}`, {
          align: "center",
        });

      doc.moveDown(0.8);
      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .lineWidth(1)
        .stroke(BRAND_COLOR);

      doc.moveDown(1);

      const header = (title) => {
        doc.x = doc.page.margins.left;
        doc
          .fillColor(BRAND_COLOR)
          .font("Helvetica-Bold")
          .fontSize(13)
          .text(title, {
            align: "left",
          });
        doc
          .moveDown(0.2)
          .fillColor(TEXT_COLOR)
          .font("Helvetica")
          .fontSize(10);
      };

      // ===== 1. EXECUTIVE SUMMARY =====
      if (sections.length === 0 || hasSection(sections, "Executive Summary")) {
        header("1. Executive Summary");
        doc.text(
          "This section summarizes production performance, weather impact, equipment availability, road conditions, and key operational risks for the selected period.",
          { align: "justify" }
        );
        doc.moveDown(0.5);

        doc.font("Helvetica-Bold").text("Snapshot:", { align: "left" });
        doc.font("Helvetica");
        doc.text(
          `• Total Production       : ${totalProduction} ton (Target: ${productionTarget} ton)`,
          { align: "left" }
        );
        doc.text(
          `• Achievement (%)        : ${achievementPercent}`,
          { align: "left" }
        );
        doc.text(
          `• Avg Production / Day   : ${avgProductionPerDay} ton/day`,
          { align: "left" }
        );
        doc.text(`• Active Excavators      : ${activeExcavators}`, {
          align: "left",
        });
        doc.text(`• Active Dump Trucks     : ${activeDumpTrucks}`, {
          align: "left",
        });
        doc.text(
          `• Weather Highlight      : ${weatherRain} (Temp: ${weatherTemp})`,
          { align: "left" }
        );
        doc.text(
          `• Road Status Highlight  : ${roadCondLabel} (Friction: ${roadFriction}, Alert: ${roadAlertTitle})`,
          { align: "left" }
        );

        if (aiSummary.length > 0) {
          doc.moveDown(0.5);
          doc.font("Helvetica-Bold").text("AI Summary:", { align: "left" });
          doc.font("Helvetica");
          aiSummary.forEach((p) =>
            doc.text(`• ${p}`, { align: "left" })
          );
        }
      }

      // ===== KPI TABLE =====
      header("Key Performance Indicators (KPI)");
      drawKpi(doc, {
        totalProduction,
        productionTarget,
        achievementPercent,
        activeExcavators,
        activeDumpTrucks,
      });

      // ===== 2. OPERATIONAL OVERVIEW =====
      if (hasSection(sections, "Operational Overview")) {
        header("2. Operational Overview");
        doc.text(
          "Overview of overall mine production compared to target, including cumulative tonnage, average daily output, and high-level efficiency indicators.",
          { align: "justify" }
        );
      }

      // ===== 3. WEATHER ANALYSIS =====
      if (hasSection(sections, "Weather Analysis")) {
        header("3. Weather Analysis");

        if (Object.keys(env).length || Object.keys(weatherDash).length) {
          const loc =
            env.location ||
            env.area ||
            weatherDash.source_location ||
            totalProd.source_location ||
            "—";

          const headersW = ["Parameter", "Value"];
          const rowsW = [
            ["Location", loc],
            ["Rainfall / Probability", weatherRain],
            ["Temperature", weatherTemp],
            ["Humidity", env.humidity || weatherDash.humidity || "—"],
            [
              "Wind Speed",
              env.wind || `${weatherDash.wind_speed_kmh || "—"} km/h`,
            ],
            [
              "Visibility",
              env.visibility || `${weatherDash.visibility_km || "—"} km`,
            ],
            [
              "Extreme Flag",
              weatherDash.extreme_weather_flag || env.lightning
                ? "Yes"
                : "No",
            ],
            ["Updated", env.updated || "—"],
          ];

          drawTable(doc, headersW, rowsW, [0.4, 0.6]);

          if (envRisk && (envRisk.score || envRisk.title || envRisk.subtitle)) {
            doc.font("Helvetica-Bold").text("Weather Risk", {
              align: "left",
            });
            const headerR = ["Field", "Value"];
            const rowsR = [
              ["Score", envRisk.score ?? "—"],
              ["Title", envRisk.title || "—"],
              ["Description", envRisk.subtitle || "—"],
            ];
            drawTable(doc, headerR, rowsR, [0.3, 0.7]);
          }
        }
      }

      // ===== 4. EQUIPMENT STATUS =====
      if (hasSection(sections, "Equipment Status")) {
        header("4. Equipment Status");

        if (Object.keys(equip).length > 0) {
          if (Object.keys(equipSummary).length > 0) {
            doc.font("Helvetica-Bold").text("Condition Summary", {
              align: "left",
            });

            const hE = ["Condition", "Units"];
            const rE = [
              ["Excellent", equipSummary.excellent ?? "—"],
              ["Good", equipSummary.good ?? "—"],
              [
                "Maintenance Required",
                equipSummary.maintenanceRequired ?? "—",
              ],
              ["Slightly Damaged", equipSummary.slightlyDamaged ?? "—"],
              ["Severely Damaged", equipSummary.severelyDamaged ?? "—"],
            ];

            drawTable(doc, hE, rE, [0.6, 0.4]);
          }

          if (fleetRows.length > 0) {
            doc.font("Helvetica-Bold").text("Fleet Overview", {
              align: "left",
            });

            const hF = ["Type", "Active", "Maintenance", "Idle"];
            const rF = fleetRows.map((f) => [
              f.equipmentType,
              f.active,
              f.maintenance,
              f.idle,
            ]);

            drawTable(doc, hF, rF, [0.4, 0.2, 0.2, 0.2]);
          }
        }
      }

      // ===== 5. ROAD CONDITIONS =====
      if (hasSection(sections, "Road Conditions")) {
        header("5. Road Conditions");

        if (roadSegments.length > 0) {
          doc.font("Helvetica-Bold").text("Haul Road Overview (Dashboard)", {
            align: "left",
          });

          const h = ["Road", "Status", "Speed", "Friction", "Water"];
          const r = roadSegments.slice(0, 5).map((s) => [
            s.road,
            s.status,
            `${s.speed} km/h`,
            s.friction,
            `${s.water} cm`,
          ]);

          drawTable(doc, h, r, [0.25, 0.2, 0.2, 0.2, 0.15]);
        }
      }

      // ===== 6. AI RECOMMENDATIONS =====
      if (hasSection(sections, "AI Recommendations")) {
        header("6. AI Recommendations");

        if (aiScenarios.length > 0) {
          aiScenarios.slice(0, 3).forEach((s, i) => {
            doc.font("Helvetica-Bold").text(
              `• ${s.title || `Scenario ${i + 1}`}`,
              { align: "left" }
            );
            doc
              .font("Helvetica")
              .text(s.description || "—", { align: "justify" });
            doc.moveDown(0.3);
          });
        } else {
          doc.text("No AI recommendations available for this period.", {
            align: "left",
          });
        }
      }

      // ===== 7. SCENARIO ANALYSIS =====
        if (hasSection(sections, "Scenario Analysis")) {
        header("7. Scenario Analysis");

        const simsToUse =
            scenarioSimulations.length > 0 ? scenarioSimulations : aiScenarios;

        if (simsToUse.length > 0) {
            simsToUse.slice(0, 3).forEach((s, index) => {
            const title = s.title || `Scenario ${index + 1}`;
            doc.font("Helvetica-Bold").text(title, {
                align: "left",
            });

            if (s.description) {
                doc.font("Helvetica").text(s.description, { align: "justify" });
            }

            const impact = s.impact || {};
            const hasImpact =
                impact.production_change_pct ||
                impact.cost_efficiency_pct ||
                impact.risk_level_pct;

            if (hasImpact) {
                doc.moveDown(0.2);
                doc.font("Helvetica-Bold").text("Impact:", { align: "left" });
                doc.font("Helvetica");
                if (impact.production_change_pct) {
                doc.text(
                    `• Production Change: ${impact.production_change_pct}`,
                    { align: "left" }
                );
                }
                if (impact.cost_efficiency_pct) {
                doc.text(
                    `• Cost Efficiency: ${impact.cost_efficiency_pct}`,
                    { align: "left" }
                );
                }
                if (impact.risk_level_pct) {
                doc.text(
                    `• Risk Level: ${impact.risk_level_pct}`,
                    { align: "left" }
                );
                }
            }

            if (Array.isArray(s.recommended_actions)) {
                if (s.recommended_actions.length > 0) {
                doc.moveDown(0.2);
                doc
                    .font("Helvetica-Bold")
                    .text("Recommended Actions:", { align: "left" });
                doc.font("Helvetica");
                s.recommended_actions.forEach((a) =>
                    doc.text(`• ${a}`, { align: "left" })
                );
                }
            }

            if (s.notes) {
                doc.moveDown(0.2);
                doc.font("Helvetica-Bold").text("Notes:", { align: "left" });
                doc.font("Helvetica").text(s.notes, { align: "justify" });
            }

            doc.moveDown(0.5);
            });
        } else {
            doc.text(
            "No scenario simulations are available for this period.",
            { align: "left" }
            );
        }
        }


      // ===== 8. RISK ASSESSMENT =====
      if (hasSection(sections, "Risk Assessment")) {
        header("8. Risk Assessment");

        if (envRisk && (envRisk.score || envRisk.title || envRisk.subtitle)) {
          doc.font("Helvetica-Bold").text("Weather-related Risk", {
            align: "left",
          });

          const h = ["Field", "Value"];
          const r = [
            ["Score", envRisk.score ?? "—"],
            ["Title", envRisk.title || "—"],
            ["Description", envRisk.subtitle || "—"],
          ];

          drawTable(doc, h, r, [0.3, 0.7]);
        } else {
          doc.text("No consolidated risk assessment available.", {
            align: "left",
          });
        }
      }

      // ===== OPERATOR NOTES =====
      if (notes && notes.trim() !== "") {
        doc.addPage();

        header("Operator Notes");
        doc.font("Helvetica-Oblique").fontSize(10).text(notes, {
          align: "justify",
        });
      }

      // ===== FOOTER =====
      doc.moveDown(2);
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#777777")
        .text("Generated by MineWise • Automated Mining Intelligence", {
          align: "center",
        });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
