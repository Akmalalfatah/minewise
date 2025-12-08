import React, { useEffect, useState } from "react";
import { getReasoningData } from "../../services/aiChatService";

const DEFAULT_STEPS = [
  "AI menganalisis konteks permintaan.",
  "AI mengecek data cuaca dan kondisi jalan.",
  "AI membandingkan pola historis.",
  "AI menyusun rekomendasi terbaik."
];

function ReasoningChainPanel() {
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [dataSources, setDataSources] = useState({
    weather: "Connected",
    equipment: "Connected",
    road: "Connected",
    vessel: "Connected"
  });

  useEffect(() => {
    async function load() {
      const result = await getReasoningData();
      if (!result) return;

      if (Array.isArray(result.reasoning_steps) && result.reasoning_steps.length) {
        setSteps(result.reasoning_steps);
      }

      if (result.data_sources) {
        setDataSources((prev) => ({
          ...prev,
          ...result.data_sources
        }));
      }
    }

    load();
  }, []);

  return (
    <section className="w-full h-[520px] bg-white rounded-3xl px-6 py-6 flex flex-col">
      <div className="flex-1 flex flex-col justify-between">
        <header className="flex items-center">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              AI Reasoning Chain
            </h2>
            <p className="text-sm text-gray-500">
              Memahami bagaimana AI membuat keputusan.
            </p>
          </div>
        </header>


        <section className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Reasoning Steps
          </h3>
          <ol className="flex flex-col gap-5 text-sm text-gray-800">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#111827] flex items-center justify-center text-[11px] text-white font-semibold">
                  {index + 1}
                </div>
                <p className="flex items-center justify-center">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Data Sources
          </h3>

          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-gray-800">Weather API</span>
              <div className="w-20 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-white">
                  {dataSources.weather || "Connected"}
                </span>
              </div>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-800">Equipment Sensors</span>
              <div className="w-20 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-white">
                  {dataSources.equipment || "Connected"}
                </span>
              </div>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-800">Road Monitoring</span>
              <div className="w-20 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-white">
                  {dataSources.road || "Connected"}
                </span>
              </div>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-800">Vessel Tracking</span>
              <div className="w-20 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-white">
                  {dataSources.vessel || "Connected"}
                </span>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </section>
  );
}

export default ReasoningChainPanel;
