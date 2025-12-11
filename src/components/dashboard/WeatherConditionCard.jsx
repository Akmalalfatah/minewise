import React from "react";
import AnimatedNumber from "../animation/AnimatedNumber";
import KpiCardWrapper from "../animation/KpiCardWrapper";
import { useGlobalFilter } from "../../context/GlobalFilterContext";

function WeatherConditionCard({ data }) {
  if (!data) return null;

  const { location } = useGlobalFilter();

  const rainProb = Number(data.rain_probability_pct) || 0;
  const windSpeed = Number(data.wind_speed_kmh) || 0;
  const visibility = Number(data.visibility_km) || 0;
  const isExtreme = Boolean(data.extreme_weather_flag);

  return (
    <KpiCardWrapper className="WeatherConditionCard w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
      <section
        data-layer="weather_condition_card"
        aria-label="Weather condition summary"
        className="w-full h-full"
      >
        <div className="HeaderContainer w-[205px] h-[197px] flex flex-col justify-center items-start gap-3">
          <header className="HeaderLeftGroup inline-flex justify-center items-center gap-3">
            <div className="IconWrapper size-8 px-[7px] py-2 bg-[#1c2534] rounded-2xl flex justify-center items-center">
              <img
                className="IconRain size-[18px]"
                src="/icons/icon_rain.png"
                alt="Weather icon"
              />
            </div>

            <h2 className="WeatherConditionTitle text-black text-sm font-semibold">
              Kondisi Cuaca
            </h2>
          </header>

          <section className="ContentContainer self-stretch flex flex-col justify-start items-start gap-[15px]">
            <div className="InfoRows self-stretch inline-flex justify-between items-start">
              <div className="LabelContainer w-[133px] inline-flex flex-col justify-start items-start gap-3">
                <span className="text-black text-sm font-normal">
                  Probabilitas hujan
                </span>
                <span className="text-black text-sm font-normal">
                  Kecepatan angin
                </span>
                <span className="text-black text-sm font-normal">
                  Visibilitas jarak
                </span>
                <span className="text-black text-sm font-normal">
                  Cuaca ekstrem
                </span>
              </div>

              <div className="ValueContainer min-w-[80px] inline-flex flex-col justify-start items-end gap-3">
                <p className="text-right text-black text-sm font-semibold">
                  <AnimatedNumber value={rainProb} decimals={0} />%
                </p>
                <p className="text-right text-black text-sm font-semibold">
                  <AnimatedNumber value={windSpeed} decimals={0} /> km/jam
                </p>
                <p className="text-right text-black text-sm font-semibold">
                  <AnimatedNumber value={visibility} decimals={1} /> km
                </p>
                <p className="text-right text-black text-sm font-semibold">
                  {isExtreme ? "Ya" : "Tidak"}
                </p>
              </div>
            </div>

            <div className="Divider self-stretch h-0 outline outline-[0.50px] outline-[#bdbdbd]" />

            <footer className="FooterContainter self-stretch inline-flex justify-between items-center">
              <span className="text-black/60 text-sm font-normal">Lokasi</span>
              <span className="text-right text-black/60 text-sm font-semibold">
                {location}
              </span>
            </footer>
          </section>
        </div>
      </section>
    </KpiCardWrapper>
  );
}

export default WeatherConditionCard;
