import React, { useEffect, useState } from "react";
import { getRoadConditionOverview } from "../../services/dashboardService";
import ChartTooltip from "../ui/ChartTooltipDefault";

function RoadConditionOverviewCard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function load() {
            const result = await getRoadConditionOverview();
            setData(result);
        }
        load();
    }, []);

    if (!data) return null;

    return (
        <div data-layer="road_condition_overview_card" className="RoadConditionOverviewCard w-[530px] h-[762px] p-6 bg-white rounded-3xl inline-flex flex-col justify-start items-start gap-8">
            <div data-layer="card_container" className="CardContainer flex flex-col justify-start items-start gap-8">

                <div data-layer="header_left_group" className="HeaderLeftGroup w-[216px] inline-flex justify-start items-center gap-3">
                    <div data-layer="icon_wrapper" className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
                        <img data-layer="icon_road" className="IconRoad size-[18px]" src="/icons/icon_road.png" />
                    </div>
                    <div data-layer="road_condition_title" className="RoadConditionTitle text-black text-sm font-semibold">Road Condition Overview</div>
                </div>

                <div data-layer="content_container" className="ContentContainer flex flex-col justify-start items-start gap-4">

                    <div data-layer="segment_summary_section" className="SegmentSummarySection w-[473px] flex flex-col justify-start items-start gap-6">
                        <div data-layer="segment_summary_title" className="SegmentSummaryTitle text-black text-xs font-semibold">Road Segment Summary</div>

                        {data.segment_summary.map((seg, i) => (
                            <div key={i} className="flex justify-between text-xs py-1">
                                <div>{seg.road_id}</div>
                                <div>{seg.status}</div>
                                <div>{seg.speed_kmh} km/h</div>
                                <div>{seg.friction_index}</div>
                                <div>{seg.water_depth_cm} cm</div>
                            </div>
                        ))}
                    </div>

                    <div data-layer="divider" className="Divider w-[470px] h-0 outline outline-[0.50px] outline-[#bdbdbd]"></div>

                    <div data-layer="efficiency_and_ai_section" className="EfficiencyAndAiSection w-[471px] h-[169px] inline-flex justify-start items-center gap-2.5">

                        <div data-layer="route_efficiency_score" className="RouteEfficiencyScore w-[198px] inline-flex flex-col justify-start items-start gap-[25px]">
                            <div data-layer="route_efficiency_score_title" className="RouteEfficiencyScoreTitle text-black text-xs font-semibold">Route Efficiency Score</div>
                            {data.route_efficiency_score}
                        </div>

                        <div data-layer="ai_indicator" className="AiIndicator w-[263px] h-[169px] p-3 bg-[#efefef] rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5">
                            <div data-layer="ai_inficator_section" className="AiInficatorSection w-[238px] flex flex-col justify-start items-start gap-3">

                                <div data-layer="ai_process_item" className="AiProcessItem w-[227px] flex flex-col justify-start items-start gap-2">
                                    <div data-layer="ai_process_item_title" className="AiProcessItemTitle text-black/60 text-xs">AI Memproses</div>
                                    <div data-layer="ai_process_item_input" className="AiProcessItemInput text-black text-xs">
                                        {data.ai_process.analysed_parameters.join(", ")}
                                    </div>
                                </div>

                                <div data-layer="divider" className="Divider w-full h-0 outline outline-[0.50px] outline-[#bdbdbd]"></div>

                                <div data-layer="anomaly_ai_section" className="AnomalyAiSection flex flex-col justify-start items-start gap-2">
                                    <div data-layer="anomaly_ai_section_title" className="AnomalyAiSectionTitle text-black/60 text-xs">AI Flag</div>

                                    <div data-layer="anomaly_ai_header" className="AnomalyAiHeader flex flex-col justify-start items-start gap-2">
                                        {data.ai_flags.map((flag, i) => (
                                            <div key={i} data-layer={`anomaly_ai_item_${i}`} className="AnomalyAiItem inline-flex justify-start items-center gap-2">
                                                <img data-layer="icon_importance" className="IconImportance size-[17px]" src="/icons/icon_importance.png" />
                                                <div className="AnomalyAiInput text-black text-xs">
                                                    {flag.message}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                    <div data-layer="divider" className="Divider w-[470px] h-0 outline outline-[0.50px] outline-[#bdbdbd]"></div>

                    <div data-layer="road_condition_surface_type" className="RoadConditionSurfaceType flex flex-col justify-start items-start gap-[13px]">
                        <div data-layer="surface_type_title" className="SurfaceTypeTitle text-black text-xs font-semibold">Road Conditions Based on Surface Type</div>

                        <div className="SurfaceTypeGraphs w-[473px] h-[200px]">
                            <ChartTooltip />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default RoadConditionOverviewCard;
