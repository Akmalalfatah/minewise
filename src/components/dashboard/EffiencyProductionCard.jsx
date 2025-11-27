import React from 'react';

function EfficiencyProductionCard() {
    return (
        <div data-layer="efficiency_production_card.jsx" className="EfficiencyProductionCardJsx w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
            <div data-layer="header_container" className="HeaderContainer size- flex flex-col justify-center items-start gap-[18px]">
                <div data-layer="header_left_group" className="HeaderLeftGroup size- rounded-3xl inline-flex justify-center items-center gap-3">
                    <div data-layer="icon_wrapper" className="IconWrapper size-8 px-[7px] py-2 bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
                        <img data-layer="icon_performance" className="IconPerformance size-[18px]" src="https://placehold.co/18x18" />
                    </div>
                    <div data-layer="efficiency_production_title" className="EfficiencyProductionTitle justify-start text-black text-sm font-semibold">Efisiensi Produksi</div>
                </div>
                <div data-layer="contant_container" className="ContantContainer size- flex flex-col justify-start items-start gap-[18px]">
                    <div data-layer="info_rows" className="InfoRows w-[205px] h-[92px] inline-flex justify-between items-center">
                        <div data-layer="label_container" className="LabelContainer w-[117px] inline-flex flex-col justify-center items-start gap-5">
                            <div data-layer="effective_hours_title" className="EffectiveHoursTitle self-stretch justify-start text-black text-sm font-normal">Jam efektif</div>
                            <div data-layer="maintanance_hours_title" className="MaintananceHoursTitle justify-start text-black text-sm font-normal">Jam maintanance</div>
                            <div data-layer="efficiency_rate_title" className="EfficiencyRateTitle self-stretch justify-start text-black text-sm font-normal">Efficiency Rate</div>
                        </div>
                        <div data-layer="value_container" className="ValueContainer w-[9px] h-[75px] inline-flex flex-col justify-center items-end gap-5">
                            <div data-layer="effective_hours" className="EffectiveHours text-right justify-start text-black text-sm font-semibold">{effectiveHours}</div>
                            <div data-layer="maintanance_hours" className="MaintananceHours text-right justify-start text-black text-sm font-semibold">{maintananceHours}</div>
                            <div data-layer="efficiency_rate" className="EfficiencyRate text-right justify-start text-[#4caf50] text-sm font-semibold">{efficiencyRate}</div>
                        </div>
                    </div>
                    <div data-layer="divider" className="Divider w-[205px] h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"></div>
                    <div data-layer="footer_container" className="FooterContainer w-[205px] h-[17px] inline-flex justify-between items-center">
                        <div data-layer="source_location_title" className="SourceLocationTitle justify-start text-black/60 text-sm font-normal">Lokasi Source</div>
                        <div data-layer="source_location" className="SourceLocation text-right justify-start text-[#666666] text-sm font-semibold">{sourceLocation}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EfficiencyProductionCard;;