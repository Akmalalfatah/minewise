import React from 'react';

function WeatherConditionCard() {
    return (
        <div data-layer="weather_condition_card" className="WeatherConditionCard w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
            <div data-layer="header_container" className="HeaderContainer w-[205px] h-[197px] flex flex-col justify-center items-start gap-3">
                <div data-layer="header_left_group" className="HeaderLeftGroup size- rounded-3xl inline-flex justify-center items-center gap-3">
                    <div data-layer="icon_wrapper" className="IconWrapper size-8 px-[7px] py-2 bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
                        <img data-layer="icon_rain" className="IconRain size-[18px]" src="https://placehold.co/18x18" />
                    </div>
                    <div data-layer="weather_condition_title" className="WeatherConditionTitle justify-start text-black text-sm font-semibold">Kondisi Cuaca</div>
                </div>
                <div data-layer="content_container" className="ContentContainer self-stretch flex flex-col justify-start items-start gap-[15px]">
                    <div data-layer="info_rows" className="InfoRows self-stretch inline-flex justify-between items-center">
                        <div data-layer="label_container" className="LabelContainer w-[133px] inline-flex flex-col justify-start items-start gap-3">
                            <div data-layer="rain_prob_pct_title" className="RainProbPctTitle self-stretch justify-start text-black text-sm font-normal">Probabilitas hujan</div>
                            <div data-layer="wind_speed_mps_title" className="WindSpeedMpsTitle self-stretch justify-start text-black text-sm font-normal">Kecepatan angin</div>
                            <div data-layer="visibility_km_title" className="VisibilityKmTitle justify-start text-black text-sm font-normal">Visibilitas jarak (km) </div>
                            <div data-layer="extreme_flag_title" className="ExtremeFlagTitle justify-start text-black text-sm font-normal">Cuaca ekstrem</div>
                        </div>
                        <div data-layer="value_container" className="ValueContainer w-[9px] inline-flex flex-col justify-start items-end gap-3">
                            <div data-layer="rain_prob_pct" className="RainProbPct text-right justify-start text-black text-sm font-semibold">{rainProbPct}</div>
                            <div data-layer="wind_speed_mps" className="WindSpeedMps text-right justify-start text-black text-sm font-semibold">{windSpeedMps}</div>
                            <div data-layer="visibility_km" className="VisibilityKm text-right justify-start text-black text-sm font-semibold">{visibilityKm}</div>
                            <div data-layer="extreme_flag" className="ExtremeFlag text-right justify-start text-black text-sm font-semibold">{extremeFlag}</div>
                        </div>
                    </div>
                    <div data-layer="divider" className="Divider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"></div>
                    <div data-layer="footer_container" className="FooterContainer self-stretch inline-flex justify-between items-center">
                        <div data-layer="source_location_title" className="SourceLocationTitle justify-start text-black/60 text-sm font-normal">Lokasi Source</div>
                        <div data-layer="source_location" className="SourceLocation text-right justify-start text-[#666666] text-sm font-semibold">{sourceLocation}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherConditionCard;