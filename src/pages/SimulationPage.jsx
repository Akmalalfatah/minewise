import React, { useState } from "react";

function SimulationPage() {
  const [expectedRainfall, setExpectedRainfall] = useState(50);
  const [equipmentHealth, setEquipmentHealth] = useState(80);
  const [vesselDelay, setVesselDelay] = useState(5);
  const [activeScenario, setActiveScenario] = useState("optimized");
  const [lastRun, setLastRun] = useState(null);

  const handleRunScenario = () => {
    setLastRun(new Date().toLocaleTimeString());
  };

  const handleReset = () => {
    setExpectedRainfall(50);
    setEquipmentHealth(80);
    setVesselDelay(5);
    setActiveScenario("baseline");
    setLastRun(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* TITLE */}
        <header>
          <h1 className="text-2xl font-semibold text-gray-900">
            Simulation Analysis
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Jalankan skenario simulasi untuk melihat dampak perubahan cuaca,
            kesehatan alat, dan keterlambatan kapal terhadap produksi serta
            risiko operasi.
          </p>
        </header>

        {/* AI SCENARIO CONTROL PANEL */}
        <section className="bg-white rounded-3xl p-6 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1c2534] flex items-center justify-center text-white text-lg">
              🤖
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                AI Scenario
              </h2>
              <p className="text-xs text-gray-500">
                Atur parameter simulasi untuk mengevaluasi skenario produksi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScenarioControlCard
              label="Expected Rainfall"
              valueLabel={`${expectedRainfall} mm`}
              impactText="Impact: Road conditions & mining operations"
              min={0}
              max={100}
              value={expectedRainfall}
              onChange={setExpectedRainfall}
            />

            <ScenarioControlCard
              label="Equipment Health"
              valueLabel={`${equipmentHealth}%`}
              impactText="Impact: Load efficiency & operating hours"
              min={0}
              max={100}
              value={equipmentHealth}
              onChange={setEquipmentHealth}
            />

            <ScenarioControlCard
              label="Vessel Delay"
              valueLabel={`${vesselDelay} jam`}
              impactText="Impact: Road conditions & mining operations"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c2534] text-white text-sm font-semibold hover:bg-black transition-colors"
            >
              ▶ Run Scenario
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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

        {/* SCENARIO RESULT CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScenarioResultCard
            title="Baseline Scenario"
            isActive={activeScenario === "baseline"}
            onSelect={() => setActiveScenario("baseline")}
            productionOutput="78%"
            costEfficiency="71%"
            riskLevel="60%"
          />

          <ScenarioResultCard
            title="Optimized Scenario"
            isActive={activeScenario === "optimized"}
            onSelect={() => setActiveScenario("optimized")}
            productionOutput="92%"
            costEfficiency="89%"
            riskLevel="45%"
          />

          <ScenarioResultCard
            title="Conservative"
            isActive={activeScenario === "conservative"}
            onSelect={() => setActiveScenario("conservative")}
            productionOutput="68%"
            costEfficiency="76%"
            riskLevel="35%"
          />
        </section>

        {/* AI RECOMMENDATIONS */}
        <section className="bg-[#101828] rounded-3xl p-6 flex flex-col gap-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              💡
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                AI Optimization Recommendations
              </h2>
              <p className="text-xs text-gray-300">
                Rekomendasi di bawah ini diasumsikan berdasarkan skenario{" "}
                <span className="font-semibold">
                  {activeScenario === "baseline"
                    ? "Baseline"
                    : activeScenario === "optimized"
                    ? "Optimized"
                    : "Conservative"}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RecommendationCard
              title="Production Strategy"
              description="Pindahkan 2 unit dump truck dari PIT A ke PIT B untuk mempercepat proses hauling. Estimasi peningkatan efisiensi produksi: +8.7%."
            />
            <RecommendationCard
              title="Logistics Optimization"
              description="Sinkronkan jadwal hauling dan loading kapal agar idle time berkurang 12%. Potensi penghematan biaya operasional ±Rp110 juta/minggu."
            />
            <RecommendationCard
              title="Equipment Allocation"
              description="Jadwalkan maintenance alat EX-04 sebelum 7 Nov untuk mencegah downtime tak terencana ±6 jam/minggu."
            />
            <RecommendationCard
              title="Risk Mitigation"
              description="Tunda aktivitas malam di area PIT C saat curah hujan tinggi untuk menurunkan risiko kecelakaan hingga 15%."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ScenarioControlCard({
  label,
  valueLabel,
  impactText,
  min,
  max,
  value,
  onChange
}) {
  return (
    <div className="bg-[#f7f7f8] rounded-3xl p-4 flex flex-col gap-3">
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
  riskLevel
}) {
  return (
    <div className="rounded-3xl px-5 py-4 bg-gradient-to-br from-[#111827] to-[#1f2937] text-white flex flex-col gap-4">
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
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
        <div
          className="h-1.5 rounded-full bg-[#ff7b54]"
          style={{ width: value }}
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
