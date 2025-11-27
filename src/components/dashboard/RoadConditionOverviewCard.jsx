import React from 'react';

function RoadConditionOverviewCard() {
    return (
        <div data-layer="road_condition_overview_card" className="RoadConditionOverviewCard w-[530px] h-[762px] p-6 bg-white rounded-3xl inline-flex flex-col justify-start items-start gap-8">
            <div data-layer="card_container" className="CardContainer size- flex flex-col justify-start items-start gap-8">
                <div data-layer="header_left_group" className="HeaderLeftGroup w-[216px] inline-flex justify-start items-center gap-3">
                    <div data-layer="icon_wrapper" className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
                        <img data-layer="icon_road" className="IconRoad size-[18px]" src="https://placehold.co/18x18" />
                    </div>
                    <div data-layer="road_condition_title" className="RoadConditionTitle w-[172px] justify-start text-black text-sm font-semibold">Road Condition Overview</div>
                </div>
                <div data-layer="content_container" className="ContentContainer size- flex flex-col justify-start items-start gap-4">
                    <div data-layer="segment_summary_section" className="SegmentSummarySection w-[473px] flex flex-col justify-start items-start gap-6">
                        <div data-layer="segment_summary_title" className="SegmentSummaryTitle self-stretch justify-start text-black text-xs font-semibold">Road Segment Summary</div>
                        <img data-layer="segment_summary_table" className="SegmentSummaryTable w-[473px] h-[150px]" src="https://placehold.co/473x150" />
                    </div>
                    <div data-layer="divider" className="Divider w-[470px] h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"></div>
                    <div data-layer="efficiency_and_ai_section" className="EfficiencyAndAiSection w-[471px] h-[169px] inline-flex justify-start items-center gap-2.5">
                        <div data-layer="route_efficiency_score" className="RouteEfficiencyScore w-[198px] inline-flex flex-col justify-start items-start gap-[25px]">
                            <div data-layer="route_efficiency_score_title" className="RouteEfficiencyScoreTitle self-stretch justify-start text-black text-xs font-semibold">Route Efficiency Score</div>
                            <img data-layer="route_efficiency_graph" className="RouteEfficiencyGraph w-[198px] h-[129px]" src="https://placehold.co/198x129" />
                        </div>
                        <div data-layer="ai_indicator" className="AiIndicator w-[263px] h-[169px] p-3 bg-[#efefef] rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5">
                            <div data-layer="ai_inficator_section" className="AiInficatorSection w-[238px] flex flex-col justify-start items-start gap-3">
                                <div data-layer="ai_process_item" className="AiProcessItem w-[227px] h-[50px] flex flex-col justify-start items-start gap-2">
                                    <div data-layer="ai_process_item_title" className="AiProcessItemTitle self-stretch justify-start text-black/60 text-xs font-normal">AI Memproses</div>
                                    <div data-layer="ai_process_item_input" className="AiProcessItemInput self-stretch justify-start text-black text-xs font-normal">friction, water depth, travel time, speed deviation</div>
                                </div>
                                <div data-layer="divider" className="Divider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"></div>
                                <div data-layer="anomaly_ai_section" className="AnomalyAiSection w-[169px] flex flex-col justify-start items-start gap-2">
                                    <div data-layer="anomaly_ai_section_title" className="AnomalyAiSectionTitle self-stretch justify-start text-black/60 text-xs font-normal">AI Flag</div>
                                    <div data-layer="anomaly_ai_header" className="AnomalyAiHeader self-stretch flex flex-col justify-start items-start gap-2">
                                        <div data-layer="anomaly_ai_item_1" className="AnomalyAiItem1 self-stretch inline-flex justify-start items-center gap-2">
                                            <img data-layer="icon_importance" className="IconImportance size-[17px]" src="https://placehold.co/17x17" />
                                            <div data-layer="anomaly_ai_input_1" className="AnomalyAiInput1 justify-start text-black text-xs font-normal">lorem ipsum lorem ipsum </div>
                                        </div>
                                        <div data-layer="anomaly_ai_item_2" className="AnomalyAiItem2 self-stretch inline-flex justify-start items-center gap-2">
                                            <img data-layer="icon_importance" className="IconImportance size-[17px]" src="https://placehold.co/17x17" />
                                            <div data-layer="anomaly_ai_input_2" className="AnomalyAiInput2 justify-start text-black text-xs font-normal">lorem ipsum lorem ipsum </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div data-layer="divider" className="Divider w-[470px] h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"></div>
                    <div data-layer="road_condition_surface_type" className="RoadConditionSurfaceType size- flex flex-col justify-start items-start gap-[13px]">
                        <div data-layer="surface_type_title" className="SurfaceTypeTitle justify-start text-black text-xs font-semibold">Road Conditions Based on Surface Type</div>
                        <img data-layer="surface_type_graphs" className="SurfaceTypeGraphs w-[473px] h-[200px]" src="https://placehold.co/473x200" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoadConditionOverviewCard;