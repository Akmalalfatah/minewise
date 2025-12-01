import React, { useEffect, useState } from "react";
import { getCausesOfDowntime } from "../../services/dashboardService";
import ChartPieInteractive from '../ui/ChartPieInteractive';

function CausesOfDowntimeCard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function load() {
            const result = await getCausesOfDowntime();
            setData(result);
        }
        load();
    }, []);

    if (!data) return null;

    return (
    <div data-layer="causes_of_downtime_card" className="CausesOfDowntimeCard w-[807px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-start gap-2.5">
        <div data-layer="card_container" className="CardContainer self-stretch flex flex-col justify-center items-start gap-6">

            <div data-layer="header_left_group" className="HeaderLeftGroup w-[270.41px] h-[32.09px] inline-flex justify-start items-center gap-3">
                <div data-layer="icon_wrapper" className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
                    <img data-layer="icon_warning" className="IconWarning size-[18px]" src="/icons/icon_downtime.png" />
                </div>
                <div data-layer="causes_downtime_title" className="CausesDowntimeTitle text-black text-sm font-semibold">Causes of Downtime</div>
            </div>

            <div data-layer="content_container" className="ContentContainer self-stretch h-[261px] relative">

                <div data-layer="stats_section" className="StatsSection w-[249px] absolute left-0 top-0 inline-flex flex-col justify-start items-start gap-3">

                    <div data-layer="stats_group" className="StatsGroup w-[151px] flex flex-col justify-start items-start gap-[11px]">

                        <div data-layer="total_downtime_week_row" className="TotalDowntimeWeekRow self-stretch flex flex-col justify-start items-start gap-2">
                            <div data-layer="total_downtime_week_title" className="TotalDowntimeWeekTitle text-black/60 text-xs">Total Downtime</div>
                            <div data-layer="total_downtime_week_input" className="TotalDowntimeWeekInput text-black text-2xl font-semibold">
                                {data.total_downtime_hours} jam
                            </div>
                        </div>

                        <div data-layer="lost_output_item_row" className="LostOutputItemRow self-stretch flex flex-col justify-start items-start gap-2">
                            <div data-layer="lost_output_item_title" className="LostOutputItemTitle text-black/60 text-xs">Lost Output</div>
                            <div data-layer="lost_output_item_input" className="LostOutputItemInput text-black text-2xl font-semibold">
                                {data.lost_output_ton} ton
                            </div>
                        </div>

                    </div>

                    <div data-layer="divider" className="Divider self-stretch h-0 outline outline-[0.50px] outline-[#bdbdbd]"></div>

                    <div data-layer="cause_detailed_row" className="CauseDetailedRow w-[223px] flex flex-col justify-start items-start gap-[9px]">

                        <div data-layer="cause_detailed_title" className="CauseDetailedTitle text-black text-xs font-semibold">Top Cause Detailed</div>

                        <div data-layer="cause_detailed_input" className="CauseDetailedInput text-black text-2xl font-normal">
                            {data.cause_details[0]?.category}
                        </div>

                        <div data-layer="cause_detailed_header" className="CauseDetailedHeader flex flex-col justify-start items-start gap-2">
                            <div data-layer="cause_detailed_group_1" className="CauseDetailedGroup1 text-black/60 text-xs">
                                {data.cause_details[0]?.ai_reason}
                            </div>
                        </div>

                    </div>

                </div>

                <div data-layer="divider" className="Divider w-[315px] h-0 left-[273px] top-[-54px] absolute origin-top-left rotate-90 outline outline-[0.50px] outline-[#bdbdbd]"></div>

                <div className="PieChart w-[462px] h-[318px] absolute left-[330px] top-[-30px]">
                    <ChartPieInteractive />
                </div>

            </div>

        </div>
    </div>
);

}

export default CausesOfDowntimeCard;

