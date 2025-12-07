import React, { useEffect, useState } from "react";
import { getReasoningData } from "../../services/aiChatService";

function AiReasoningChainCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await getReasoningData();
        setData(result);
      } catch (error) {
        console.error("Failed to load reasoning data:", error);
        setData({
          reasoning_steps: [],
          data_sources: {},
        });
      }
    }
    load();
  }, []);

  if (!data) return null;

  const stepsRaw =
    Array.isArray(data.reasoning_steps)
      ? data.reasoning_steps
      : Array.isArray(data.steps)
        ? data.steps
        : [];

  const steps =
    stepsRaw.length > 0
      ? stepsRaw
      : [
          "AI menganalisis konteks permintaan dan kondisi operasional terkini.",
          "AI mengecek data cuaca, kondisi jalan, dan status peralatan.",
          "AI membandingkan pola historis dengan kondisi saat ini.",
          "AI menyusun rekomendasi yang paling aman dan efisien.",
        ];

  const dataSources = data.data_sources || {
    weather: "Live",
    equipment: "Live",
    road: "Live",
    vessel: "Live",
  };

  return (
    <section
      data-layer="ai_reasoning_chain_card"
      aria-label="AI reasoning chain and data sources"
      className="w-96 h-[625px] px-6 py-8 bg-white rounded-3xl inline-flex justify-center items-center"
    >
      <main className="w-96 h-[563px] flex flex-col gap-10">
        {/* Header + Reasoning Steps */}
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-[3px]">
              <div className="w-8 h-8 flex justify-center items-center">
                <img
                  className="w-4 h-4"
                  src="/icons/reasoning_icon.png"
                  alt="Reasoning Icon"
                />
              </div>
              <h2 className="text-black text-sm font-semibold">
                AI Reasoning Chain
              </h2>
            </div>

            <p className="text-stone-500 text-sm">
              Understanding how the AI makes decisions
            </p>
          </div>

          {/* Steps */}
          <section
            aria-label="Steps taken by AI to reach a decision"
            className="flex flex-col"
          >
            {steps.length > 0 ? (
              <ol className="flex flex-col gap-7">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className="inline-flex items-center gap-2"
                  >
                    <div className="w-8 h-8 bg-gray-800 rounded-2xl flex justify-center items-center">
                      <span className="text-white text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <p className="w-72 text-black text-sm">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-stone-500 text-sm">
                No reasoning data available yet.
              </p>
            )}
          </section>
        </header>

        {/* Data sources */}
        <section
          aria-label="AI data sources"
          className="flex flex-col gap-6"
        >
          <h3 className="text-black/60 text-sm">Data Sources</h3>

          <ul className="flex flex-col gap-3">
            <li className="flex justify-between items-center">
              <span className="text-black text-sm font-semibold">
                Weather API
              </span>
              <div className="w-24 h-6 bg-green-500 rounded-md flex justify-center items-center">
                <span className="text-white text-xs font-semibold">
                  {dataSources.weather ?? "-"}
                </span>
              </div>
            </li>

            <li className="flex justify-between items-center">
              <span className="text-black text-sm font-semibold">
                Equipment Sensors
              </span>
              <div className="w-24 h-6 bg-green-500 rounded-md flex justify-center items-center">
                <span className="text-white text-xs font-semibold">
                  {dataSources.equipment ?? "-"}
                </span>
              </div>
            </li>

            <li className="flex justify-between items-center">
              <span className="text-black text-sm font-semibold">
                Road Monitoring
              </span>
              <div className="w-24 h-6 bg-green-500 rounded-md flex justify-center items-center">
                <span className="text-white text-xs font-semibold">
                  {dataSources.road ?? "-"}
                </span>
              </div>
            </li>

            <li className="flex justify-between items-center">
              <span className="text-black text-sm font-semibold">
                Vessel Tracking
              </span>
              <div className="w-24 h-6 bg-green-500 rounded-md flex justify-center items-center">
                <span className="text-white text-xs font-semibold">
                  {dataSources.vessel ?? "-"}
                </span>
              </div>
            </li>
          </ul>
        </section>
      </main>
    </section>
  );
}

export default AiReasoningChainCard;
