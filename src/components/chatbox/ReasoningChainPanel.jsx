function AiReasoningChainCard({
step1Text,
step2Text,
step3Text,
step4Text,
sourceWeather,
sourceEquipment,
sourceRoad,
sourceVessel,
}) {
return (
<div
    data-layer="ai_reasoning_chain_card"
    className="w-96 h-[625px] px-6 py-8 bg-white rounded-3xl inline-flex justify-center items-center gap-2.5"
>
    <div className="w-96 h-[563px] inline-flex flex-col justify-center items-start gap-10">
    {/* Header */}
    <div
        data-layer="header"
        className="self-stretch flex flex-col justify-start items-start gap-6"
    >
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="inline-flex justify-start items-center gap-[3px]">
            {/* icon diganti pakai src/icons, bukan shape-outline lagi */}
            <div
            data-layer="reasoning_icon"
            className="w-8 h-8 relative overflow-hidden flex justify-center items-center"
            >
            <img
                className="w-4 h-4"
                src="src/icons/reasoning_icon.png"
            />
            </div>

            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
            AI Reasoning Chain
            </div>
        </div>

        <div className="self-stretch justify-start text-stone-500 text-sm font-normal font-['Inter']">
            Understanding how the AI makes decisions
        </div>
        </div>

        {/* Steps */}
        <div
        data-layer="steps_section"
        className="self-stretch flex flex-col justify-start items-start gap-7"
        >
        <div className="self-stretch inline-flex justify-start items-center gap-2">
            <div className="w-8 h-8 px-3 py-1.5 bg-gray-800 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
            <div className="justify-start text-white text-sm font-normal font-['Inter']">
                1
            </div>
            </div>
            <div className="w-72 justify-start text-black text-sm font-normal font-['Inter']">
            {step1Text}
            </div>
        </div>

        <div className="self-stretch inline-flex justify-start items-center gap-2">
            <div className="w-8 h-8 px-2.5 py-1.5 bg-gray-800 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
            <div className="justify-start text-white text-sm font-normal font-['Inter']">
                2
            </div>
            </div>
            <div className="w-72 justify-start text-black text-sm font-normal font-['Inter']">
            {step2Text}
            </div>
        </div>

        <div className="self-stretch inline-flex justify-start items-center gap-2">
            <div className="w-8 h-8 px-2.5 py-1.5 bg-gray-800 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
            <div className="justify-start text-white text-sm font-normal font-['Inter']">
                3
            </div>
            </div>
            <div className="w-72 justify-start text-black text-sm font-normal font-['Inter']">
            {step3Text}
            </div>
        </div>

        <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="w-8 h-8 px-2.5 py-1.5 bg-gray-800 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
            <div className="justify-start text-white text-sm font-normal font-['Inter']">
                4
            </div>
            </div>
            <div className="w-72 justify-start text-black text-sm font-normal font-['Inter']">
            {step4Text}
            </div>
        </div>
        </div>
    </div>

    {/* Data Sources */}
    <div
        data-layer="data_sources_section"
        className="self-stretch flex flex-col justify-start items-start gap-6"
    >
        <div className="self-stretch justify-start text-black/60 text-sm font-normal font-['Inter']">
        Data Sources
        </div>

        <div className="self-stretch flex flex-col justify-center items-start gap-3">
        <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
            Weather API
            </div>
            <div className="w-24 h-6 px-[5px] py-1.5 bg-green-500 rounded-md flex justify-center items-center gap-2.5">
            <div className="text-right justify-start text-white text-xs font-semibold font-['Inter']">
                {sourceWeather}
            </div>
            </div>
        </div>

        <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
            Equipment Sensors
            </div>
            <div className="w-24 h-6 px-[5px] py-1.5 bg-green-500 rounded-md flex justify-center items-center gap-2.5">
            <div className="text-right justify-start text-white text-xs font-semibold font-['Inter']">
                {sourceEquipment}
            </div>
            </div>
        </div>

        <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
            Road Monitoring
            </div>
            <div className="w-24 h-6 px-[5px] py-1.5 bg-green-500 rounded-md flex justify-center items-center gap-2.5">
            <div className="text-right justify-start text-white text-xs font-semibold font-['Inter']">
                {sourceRoad}
            </div>
            </div>
        </div>

        <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
            Vessel Tracking
            </div>
            <div className="w-24 h-6 px-[5px] py-1.5 bg-green-500 rounded-md flex justify-center items-center gap-2.5">
            <div className="text-right justify-start text-white text-xs font-semibold font-['Inter']">
                {sourceVessel}
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
