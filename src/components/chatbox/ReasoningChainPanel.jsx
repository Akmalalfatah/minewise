import React, { useState } from "react";

const DEFAULT_STEPS = [
    "Collected simulation data from ML service",
    "Evaluated weather, equipment, and logistics factors",
    "Selected optimized operational scenario",
    "Generated recommendation using Gemini LLM"
];

const DEFAULT_DATA_SOURCES = {
    weather: "dim_cuaca_harian",
    equipment: "fct_operasional_alat",
    road: "fct_kondisi_jalan",
    vessel: "fct_pemuatan_kapal"
};

function ReasoningChainPanel() {
    const [steps] = useState(DEFAULT_STEPS);
    const [dataSources] = useState(DEFAULT_DATA_SOURCES);

    return (
        <section className="w-full h-[650px] bg-white rounded-3xl px-6 py-6 flex flex-col">
            <div className="flex-1 flex flex-col justify-between">
                <header>
                    <h2 className="text-base font-semibold text-gray-900">
                        AI Reasoning Chain
                    </h2>
                    <p className="text-sm text-gray-500">
                        Memahami bagaimana AI membuat keputusan.
                    </p>
                </header>

                <section className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Reasoning Steps
                    </h3>

                    <ol className="flex flex-col gap-6 text-sm text-gray-800">
                        {steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-[#111827] flex items-center justify-center text-[11px] text-white font-semibold">
                                    {index + 1}
                                </div>
                                <p>{step}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Data Sources
                    </h3>

                    <ul className="flex flex-col gap-5 text-sm">
                        {Object.entries(dataSources).map(([key, value]) => (
                            <li
                                key={key}
                                className="flex items-center justify-between"
                            >
                                <span className="text-gray-800 capitalize">
                                    {key} Source
                                </span>
                                <div className="w-35 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                                    <span className="text-[11px] font-semibold text-white">
                                        {value}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </section>
    );
}

export default ReasoningChainPanel;
