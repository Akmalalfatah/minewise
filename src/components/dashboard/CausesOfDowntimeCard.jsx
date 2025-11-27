import React from 'react';

function CausesOfDowntimeCard() {
    return (
        <div data-layer="causes_of_downtime_card" className="CausesOfDowntimeCard w-[807px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-start gap-2.5">
            <div data-layer="card_container" className="CardContainer self-stretch flex flex-col justify-center items-start gap-6">
                <div data-layer="header_left_group" className="HeaderLeftGroup w-[270.41px] h-[32.09px] inline-flex justify-start items-center gap-3">
                    <div data-layer="icon_wrapper" className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
                        <img data-layer="icon_warning" className="IconWarning size-[18px]" src="https://placehold.co/18x18" />
                    </div>
                    <div data-layer="causes_downtime_title" className="CausesDowntimeTitle justify-start text-black text-sm font-semibold">Causes of Downtime</div>
                </div>
                <div data-layer="content_container" className="ContentContainer self-stretch h-[261px] relative">
                    <div data-layer="stats_section" className="StatsSection w-[249px] left-0 top-0 absolute inline-flex flex-col justify-start items-start gap-3">
                        <div data-layer="stats_group" className="StatsGroup w-[151px] flex flex-col justify-start items-start gap-[11px]">
                            <div data-layer="total_downtime_week_row" className="TotalDowntimeWeekRow self-stretch flex flex-col justify-start items-start gap-2">
                                <div data-layer="total_downtime_week_title" className="TotalDowntimeWeekTitle self-stretch justify-start text-black/60 text-xs font-normal">Total Downtime This Week</div>
                                <div data-layer="total_downtime_week_input" className="TotalDowntimeWeekInput justify-start text-black text-2xl font-semibold">14.2 hours</div>
                            </div>
                            <div data-layer="lost_output_item_row" className="LostOutputItemRow self-stretch flex flex-col justify-start items-start gap-2">
                                <div data-layer="lost_output_item_title" className="LostOutputItemTitle justify-start text-black/60 text-xs font-normal">Total Lost Output</div>
                                <div data-layer="lost_output_item_input" className="LostOutputItemInput justify-start text-black text-2xl font-semibold">1,560 ton</div>
                            </div>
                        </div>
                        <div data-layer="divider" className="Divider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"></div>
                        <div data-layer="cause_detailed_row" className="CauseDetailedRow w-[223px] h-[122px] flex flex-col justify-start items-start gap-[9px]">
                            <div data-layer="cause_detailed_title" className="CauseDetailedTitle self-stretch justify-start text-black text-xs font-semibold">Top Cause Detailed</div>
                            <div data-layer="cause_detailed_input" className="CauseDetailedInput self-stretch justify-start"><span class="text-black text-2xl font-normal">Maintanance</span><span class="text-black text-2xl font-semibold"> </span><span class="text-[#ff7b54] text-2xl font-semibold">(42%)</span></div>
                            <div data-layer="cause_detailed_header" className="CauseDetailedHeader self-stretch flex flex-col justify-start items-start gap-2">
                                <div data-layer="cause_detailed_group_1" className="CauseDetailedGroup1 self-stretch justify-start text-black/60 text-xs font-normal">3 units affected</div>
                                <div data-layer="cause_detailed_group_2" className="CauseDetailedGroup2 self-stretch justify-start text-black/60 text-xs font-normal">Avg downtime per unit: 1.5 hours</div>
                                <div data-layer="cause_detailed_group_3" className="CauseDetailedGroup3 self-stretch justify-start"><span class="text-black/60 text-xs font-semibold">Related fleet:</span><span class="text-black/60 text-xs font-normal"> Dump Truck, Grader</span></div>
                            </div>
                        </div>
                    </div>
                    <div data-layer="divider" className="Divider w-[315px] h-0 left-[273px] top-[-54px] absolute origin-top-left rotate-90 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"></div>
                    <div data-layer="chart_section" className="ChartSection w-[462px] h-[317.09px] left-[297px] top-[-56.09px] absolute">
                        <div data-layer="chart_header" className="ChartHeader w-[174px] h-[152px] left-0 top-[165.09px] absolute inline-flex flex-col justify-start items-start gap-2">
                            <div data-layer="chart_item_1" className="ChartItem1 w-[123px] inline-flex justify-start items-center gap-[11px]">
                                <div data-layer="Rectangle 138" className="Rectangle138 w-1.5 h-6 bg-[#ff7b54]" />
                                <div data-layer="Maintenance" className="Maintenance justify-start text-black text-sm font-normal">Maintenance</div>
                            </div>
                            <div data-layer="chart_item_2" className="ChartItem2 w-[119px] inline-flex justify-start items-center gap-[11px]">
                                <div data-layer="Rectangle 139" className="Rectangle139 w-1.5 h-6 bg-[#1c2534]" />
                                <div data-layer="Operator Shift" className="OperatorShift justify-start text-black text-sm font-normal">Operator Shift</div>
                            </div>
                            <div data-layer="chart_item_3" className="ChartItem3 size- inline-flex justify-start items-center gap-[11px]">
                                <div data-layer="Rectangle 140" className="Rectangle140 w-1.5 h-6 bg-[#6a7d9b]" />
                                <div data-layer="Weather" className="Weather justify-start text-black text-sm font-normal">Weather</div>
                            </div>
                            <div data-layer="chart_item_4" className="ChartItem4 size- inline-flex justify-start items-center gap-[11px]">
                                <div data-layer="Rectangle 140" className="Rectangle140 w-1.5 h-6 bg-[#d9d9d9]" />
                                <div data-layer="Mechanical Breakdown" className="MechanicalBreakdown justify-start text-black text-sm font-normal">Mechanical Breakdown</div>
                            </div>
                            <div data-layer="chart_item_5" className="ChartItem5 size- inline-flex justify-start items-center gap-[11px]">
                                <div data-layer="Rectangle 140" className="Rectangle140 w-1.5 h-6 bg-[#d9d9d9]" />
                                <div data-layer="Fuel Issue" className="FuelIssue justify-start text-black text-sm font-normal">Fuel Issue</div>
                            </div>
                        </div>
                        <img data-layer="pie_chart" className="PieChart w-[298px] h-[293px] left-[164px] top-0 absolute" src="https://placehold.co/298x293" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CausesOfDowntimeCard;