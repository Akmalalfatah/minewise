import React from 'react';

function ProductionWeatherOverview() {
    return (
        <div data-layer="production_weather_overview_card" className="ProductionWeatherOverviewCard w-[807px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
            <div data-layer="card_container" className="CardContainer self-stretch flex flex-col justify-start items-start gap-6">
                <div data-layer="header_left_group" className="HeaderLeftGroup w-[269px] inline-flex justify-start items-center gap-3">
                    <div data-layer="icon_wrapper" className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
                        <img data-layer="icon_overview" className="IconOverview size-[18px]" src="https://placehold.co/18x18" />
                    </div>
                    <div data-layer="production_weather_title" className="ProductionWeatherTitle justify-start text-black text-sm font-semibold">Production & Weather Overview</div>
                </div>
                <div data-layer="content_container" className="ContentContainer self-stretch h-[269px] inline-flex justify-start items-end gap-6">
                    <div data-layer="production_section" className="ProductionSection w-[277px] inline-flex flex-col justify-center items-start gap-3">
                        <div data-layer="production_header" className="ProductionHeader self-stretch flex flex-col justify-start items-start gap-3">
                            <div data-layer="production_title" className="ProductionTitle self-stretch justify-start text-black text-xs font-semibold">Data untuk Produksi</div>
                            <div data-layer="divider" className="Divider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-black/25"></div>
                        </div>
                        <div data-layer="total_production_row" className="TotalProductionRow w-[225px] flex flex-col justify-start items-start gap-2">
                            <div data-layer="total_production_title" className="TotalProductionTitle self-stretch justify-start text-[#666666] text-xs font-normal">Total Produksi</div>
                            <div data-layer="total_production_input" className="TotalProductionInput justify-start text-black text-2xl font-semibold">{totalProductionInput}</div>
                        </div>
                        <div data-layer="target_row" className="TargetRow w-[225px] flex flex-col justify-start items-start gap-2">
                            <div data-layer="target_production_title" className="TargetProductionTitle self-stretch justify-start text-[#666666] text-xs font-normal">Target</div>
                            <div data-layer="target_production_input" className="TotalProductionInput justify-start text-black text-2xl font-semibold">{targetProductionInput}</div>
                        </div>
                        <div data-layer="anomaly_ai_section" className="AnomalyAiSection self-stretch flex flex-col justify-start items-start gap-3">
                            <div data-layer="anomaly_ai_section_title" className="AnomalyAiSectionTitle self-stretch justify-start text-[#666666] text-xs font-normal">Anomali (AI flag)</div>
                            <div data-layer="anomaly_header" className="AnomalyHeader size- flex flex-col justify-start items-start gap-3">
                                <div data-layer="anomaly_ai_item_1" className="AnomalyAiItem1 size- inline-flex justify-start items-center gap-2">
                                    <img data-layer="icon_importance" className="IconImportance size-[17px]" src="https://placehold.co/17x17" />
                                    <div data-layer="anomaly_ai_input_1_production" className="AnomalyAiInput1 justify-start text-black text-xs font-normal">{anomalyAiInput1Production}</div>
                                </div>
                                <div data-layer="anomaly_ai_item_2" className="AnomalyAiItem2 size- inline-flex justify-start items-center gap-2">
                                    <img data-layer="icon_importance" className="IconImportance size-[17px]" src="https://placehold.co/17x17" />
                                    <div data-layer="anomaly_ai_input_2_production" className="AnomalyAiInput2 justify-start text-black text-xs font-normal">{anomalyAiInput2Production}</div>
                                </div>
                                <div data-layer="anomaly_ai_item_3" className="AnomalyAiItem3 size- inline-flex justify-start items-center gap-2">
                                    <img data-layer="icon_importance" className="IconImportance size-[17px]" src="https://placehold.co/17x17" />
                                    <div data-layer="anomaly_ai_input_3_production" className="AnomalyAiInput3 justify-start text-black text-xs font-normal">{anomalyAiInput3Production}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img data-layer="production_weather_graph" className="ProductionWeatherGraph w-[457px] h-[325px]" src="https://placehold.co/457x325" />
                </div>
            </div>
        </div>
    );
}

export default ProductionWeatherOverview;