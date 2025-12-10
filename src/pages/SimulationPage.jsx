import React, { useState, useEffect } from "react";
import { getSimulationOverview } from "../services/simulationService";

function SimulationPage() {
  const [expectedRainfall, setExpectedRainfall] = useState(0);
  const [equipmentHealth, setEquipmentHealth] = useState(0);
  const [vesselDelay, setVesselDelay] = useState(0);

  const [inputParams, setInputParams] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [description, setDescription] = useState("");

  const [activeScenario, setActiveScenario] = useState("optimized");
  const [lastRun, setLastRun] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getSimulationOverview();

        setInputParams(data.inputParameters || null);
        setScenarios(data.scenarios || []);
        setAiRecommendations(data.aiRecommendations || []);
        setDescription(data.description || "");

        if (data.inputParameters) {
          setExpectedRainfall(data.inputParameters.expectedRainfallMm ?? 0);
          setEquipmentHealth(data.inputParameters.equipmentHealthPct ?? 0);
          setVesselDelay(data.inputParameters.vesselDelayHours ?? 0);
        }

        const optimizedExists = (data.scenarios || []).some(
          (s) => s.id === "optimized"
        );
        if (optimizedExists) {
          setActiveScenario("optimized");
        } else if ((data.scenarios || []).length > 0) {
          setActiveScenario(data.scenarios[0].id);
        } else {
          setActiveScenario("baseline");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load simulation data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRunScenario = () => {
    setLastRun(new Date().toLocaleTimeString());
  };

  const handleReset = () => {
    if (inputParams) {
      setExpectedRainfall(inputParams.expectedRainfallMm ?? 0);
      setEquipmentHealth(inputParams.equipmentHealthPct ?? 0);
      setVesselDelay(inputParams.vesselDelayHours ?? 0);
    }
    const baseline = scenarios.find((s) => s.id === "baseline");
    setActiveScenario(baseline ? baseline.id : scenarios[0]?.id || "baseline");
    setLastRun(null);
  };

  const getScenarioLabel = () => {
    const found = scenarios.find((s) => s.id === activeScenario);
    if (!found) {
      if (activeScenario === "baseline") return "Baseline";
      if (activeScenario === "optimized") return "Optimized";
      if (activeScenario === "conservative") return "Conservative";
      return "Selected";
    }
    return found.title || "Selected";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] px-8 py-6">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-sm text-gray-500">Loading simulation data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] px-8 py-6">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-8 py-6">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        <section
          aria-label="AI simulation scenario controls"
          className="bg-white rounded-3xl p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="IconWrapper size-8 px-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
              <img
                className="IconWarning size-[18px]"
                src="/icons/icon_combo_chart.png"
                alt=""
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                AI Scenario
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScenarioControlCard
              label="Expected Rainfall"
              valueLabel={`${expectedRainfall} mm`}
              impactText={
                inputParams?.impactNotes?.rainfall ||
                "Impact: Road conditions & mining operations"
              }
              min={0}
              max={100}
              value={expectedRainfall}
              onChange={setExpectedRainfall}
            />

            <ScenarioControlCard
              label="Equipment Health"
              valueLabel={`${equipmentHealth}%`}
              impactText={
                inputParams?.impactNotes?.equipmentHealth ||
                "Impact: Load efficiency & operating hours"
              }
              min={0}
              max={100}
              value={equipmentHealth}
              onChange={setEquipmentHealth}
            />

            <ScenarioControlCard
              label="Vessel Delay"
              valueLabel={`${vesselDelay} jam`}
              impactText={
                inputParams?.impactNotes?.vesselDelay ||
                "Impact: Port queue & hauling coordination"
              }
              min={0}
              max={12}
              value={vesselDelay}
              onChange={setVesselDelay}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleRunScenario}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[15px] bg-[#1c2534] text-white text-sm font-semibold hover:bg-black transition-colors"
            >
              ▶ Run Scenario
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[15px] border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ⟲ Reset Parameter
            </button>

            {lastRun && (
              <span className="text-xs text-gray-500">
                Last run at <span className="font-mono">{lastRun}</span>
              </span>
            )}
          </div>
        </section>

        <section
          aria-label="Scenario comparison cards"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {scenarios.map((scenario) => (
            <ScenarioResultCard
              key={scenario.id}
              title={scenario.title}
              isActive={activeScenario === scenario.id}
              onSelect={() => setActiveScenario(scenario.id)}
              productionOutput={scenario.productionOutputPct}
              costEfficiency={scenario.costEfficiencyPct}
              riskLevel={scenario.riskLevelPct}
            />
          ))}
        </section>

        <section
          aria-label="AI optimization recommendations"
          className="bg-[#101828] rounded-3xl p-6 flex flex-col gap-4 text-white"
        >
          <div className="flex items-center gap-3">
            <div className="IconWrapper size-8 p-[7px] bg-white rounded-2xl flex justify-center items-center">
              <img
                className="IconRobot size-[18px]"
                src="/icons/icon_robot_black.png"
                alt=""
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                AI Optimization Recommendations
              </h2>
              <p className="text-xs text-gray-300">
                {description || "Rekomendasi di bawah ini diasumsikan berdasarkan skenario terpilih."}{" "}
                Saat ini berdasarkan skenario{" "}
                <span className="font-semibold">{getScenarioLabel()}</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiRecommendations.map((item) => (
              <RecommendationCard
                key={item.id}
                title={item.title}
                description={item.detail}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ScenarioControlCard({
  label,
  valueLabel,
  impactText,
  min,
  max,
  value,
  onChange,
}) {
  return (
    <div className="bg-[#efefef] rounded-[20px] p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs font-medium text-gray-700">{valueLabel}</p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#ff7b54]"
      />
      <p className="text-[11px] text-gray-500">{impactText}</p>
    </div>
  );
}

function ScenarioResultCard({
  title,
  isActive,
  onSelect,
  productionOutput,
  costEfficiency,
  riskLevel,
}) {
  return (
    <div className="rounded-3xl px-5 py-6 bg-gradient-to-br from-[#111827] to-[#1f2937] text-white flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onSelect}
          className={`w-4 h-4 rounded-full border-2 ${
            isActive ? "border-white bg-white" : "border-white/50"
          }`}
          aria-label={`Select ${title}`}
        />
      </div>

      <div className="flex flex-col gap-3 text-xs">
        <ScenarioMetric label="Production Output" value={productionOutput} />
        <ScenarioMetric label="Cost Efficiency" value={costEfficiency} />
        <ScenarioMetric label="Risk Level" value={riskLevel} />
      </div>
    </div>
  );
}

function ScenarioMetric({ label, value }) {
  const numericValue =
    typeof value === "number" ? value : parseFloat(String(value).replace("%", ""));
  const displayValue =
    typeof value === "number" ? `${value}%` : String(value);

  const width = Number.isFinite(numericValue) ? `${numericValue}%` : "0%";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span>{label}</span>
        <span className="font-semibold">{displayValue}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
        <div
          className="h-1.5 rounded-full bg-[#ff7b54]"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function RecommendationCard({ title, description }) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-2">
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="text-xs text-gray-200 leading-relaxed">{description}</p>
    </div>
  );
}

export default SimulationPage;
