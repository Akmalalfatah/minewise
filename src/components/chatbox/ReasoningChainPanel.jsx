import React, { useEffect, useState } from "react";
import { getReasoningData } from "../../services/aiChatService";

function AiReasoningChainCard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function load() {
            const result = await getReasoningData();
            setData(result);
        }
        load();
    }, []);

    if (!data) return null;

    return (
        <div
            data-layer="ai_reasoning_chain_card"
            className="w-96 h-[625px] px-6 py-8 bg-white rounded-3xl inline-flex justify-center items-center"
        >
            <div className="w-96 h-[563px] flex flex-col gap-10">

                {/* Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <div className="inline-flex items-center gap-[3px]">
                            <div className="w-8 h-8 flex justify-center items-center">
                                <img className="w-4 h-4" src="/icons/reasoning_icon.png" alt="Reasoning Icon" />
                            </div>
                            <div className="text-black text-sm font-semibold">
                                AI Reasoning Chain
                            </div>
                        </div>

                        <div className="text-stone-500 text-sm">
                            Understanding how the AI makes decisions
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="flex flex-col gap-7">

                        {[0, 1, 2, 3].map(index => (
                            <div key={index} className="inline-flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-800 rounded-2xl flex justify-center items-center">
                                    <div className="text-white text-sm">{index + 1}</div>
                                </div>
                                <div className="w-72 text-black text-sm">
                                    {data.reasoning_steps[index]}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* Data sources */}
                <div className="flex flex-col gap-6">
                    <div className="text-black/60 text-sm">Data Sources</div>

                    <div className="flex flex-col gap-3">

                        <div className="flex justify-between items-center">
                            <div className="text-black text-sm font-semibold">Weather API</div>
                            <div className="w-24 h-6 bg-green-500 rounded-md flex justify-center items-center">
                                <div className="text-white text-xs font-semibold">
                                    {data.data_sources.weather}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-black text-sm font-semibold">Equipment Sensors</div>
                            <div className="w-24 h-6 bg-green-500 rounded-md flex justify-center items-center">
                                <div className="text-white text-xs font-semibold">
                                    {data.data_sources.equipment}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-black text-sm font-semibold">Road Monitoring</div>
                            <div className="w-24 h-6 bg-green-500 rounded-md flex justify-center items-center">
                                <div className="text-white text-xs font-semibold">
                                    {data.data_sources.road}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-black text-sm font-semibold">Vessel Tracking</div>
                            <div className="w-24 h-6 bg-green-500 rounded-md flex justify-center items-center">
                                <div className="text-white text-xs font-semibold">
                                    {data.data_sources.vessel}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default AiReasoningChainCard;
