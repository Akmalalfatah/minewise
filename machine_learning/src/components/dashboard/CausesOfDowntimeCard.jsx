import ChartPieInteractive from '../ui/ChartPieInteractive';

function CausesOfDowntimeCard({
    totalDowntimeWeekInput,
    lostOutputItemInput,
    causedDetailedInput,
    causeDetailedGroup1,
    causeDetailedGroup2,
    causeDetailedGroup3
}) {
    return (
        <div data-layer="causes_of_downtime_card" className="CausesOfDowntimeCard w-[807px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-start gap-2.5">
            <div data-layer="card_container" className="CardContainer self-stretch flex flex-col justify-center items-start gap-6">
                <div data-layer="header_left_group" className="HeaderLeftGroup w-[270.41px] h-[32.09px] inline-flex justify-start items-center gap-3">
                    <div data-layer="icon_wrapper" className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
                        <img data-layer="icon_warning" className="IconWarning size-[18px]" src="src/icons/icon_warning.png" />
                    </div>
                    <div data-layer="causes_downtime_title" className="CausesDowntimeTitle justify-start text-black text-sm font-semibold">Causes of Downtime</div>
                </div>
                <div data-layer="content_container" className="ContentContainer self-stretch h-[261px] relative">
                    <div data-layer="stats_section" className="StatsSection w-[249px] left-0 top-0 absolute inline-flex flex-col justify-start items-start gap-3">
                        <div data-layer="stats_group" className="StatsGroup w-[151px] flex flex-col justify-start items-start gap-[11px]">
                            <div data-layer="total_downtime_week_row" className="TotalDowntimeWeekRow self-stretch flex flex-col justify-start items-start gap-2">
                                <div data-layer="total_downtime_week_title" className="TotalDowntimeWeekTitle self-stretch justify-start text-black/60 text-xs font-normal">Total Downtime This Week</div>
                                <div data-layer="total_downtime_week_input" className="TotalDowntimeWeekInput justify-start text-black text-2xl font-semibold">{totalDowntimeWeekInput}</div>
                            </div>
                            <div data-layer="lost_output_item_row" className="LostOutputItemRow self-stretch flex flex-col justify-start items-start gap-2">
                                <div data-layer="lost_output_item_title" className="LostOutputItemTitle justify-start text-black/60 text-xs font-normal">Total Lost Output</div>
                                <div data-layer="lost_output_item_input" className="LostOutputItemInput justify-start text-black text-2xl font-semibold">{lostOutputItemInput}</div>
                            </div>
                        </div>
                        <div data-layer="divider" className="Divider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"></div>
                        <div data-layer="cause_detailed_row" className="CauseDetailedRow w-[223px] h-[122px] flex flex-col justify-start items-start gap-[9px]">
                            <div data-layer="cause_detailed_title" className="CauseDetailedTitle self-stretch justify-start text-black text-xs font-semibold">Top Cause Detailed</div>
                            <div data-layer="cause_detailed_input" className="CauseDetailedInput self-stretch justify-start"><span className="text-black text-2xl font-normal">{causedDetailedInput}</span></div>
                            <div data-layer="cause_detailed_header" className="CauseDetailedHeader self-stretch flex flex-col justify-start items-start gap-2">
                                <div data-layer="cause_detailed_group_1" className="CauseDetailedGroup1 self-stretch justify-start text-black/60 text-xs font-normal">{causeDetailedGroup1}</div>
                                <div data-layer="cause_detailed_group_2" className="CauseDetailedGroup2 self-stretch justify-start text-black/60 text-xs font-normal">{causeDetailedGroup2}</div>
                                <div data-layer="cause_detailed_group_3" className="CauseDetailedGroup3 self-stretch justify-start"><span className="text-black/60 text-xs font-semibold">{causeDetailedGroup3}</span></div>
                            </div>
                        </div>
                    </div>
                    <div data-layer="divider" className="Divider w-[315px] h-0 left-[273px] top-[-54px] absolute origin-top-left rotate-90 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"></div>
                    { /* Shadcn chart pie interactive */ }
                    <div className="PieChart w-[462px] h-[318px] absolute left-[330px] top-[-30px]">
                        <ChartPieInteractive />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CausesOfDowntimeCard;
