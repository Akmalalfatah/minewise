import React, { useEffect, useState } from "react";
import { getWeatherCondition } from "../../services/dashboardService";

function WeatherConditionCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getWeatherCondition();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  return (
    <section
      data-layer="weather_condition_card"
      aria-label="Weather condition summary"
      className="WeatherConditionCard w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="header_container"
        className="HeaderContainer w-[205px] h-[197px] flex flex-col justify-center items-start gap-3"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup size- rounded-3xl inline-flex justify-center items-center gap-3"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper size-8 px-[7px] py-2 bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
          >
            <img
              data-layer="icon_rain"
              className="IconRain size-[18px]"
              src="/icons/icon_rain.png"
              alt="Weather icon"
            />
          </div>

          <h2
            data-layer="weather_condition_title"
            className="WeatherConditionTitle justify-start text-black text-sm font-semibold"
          >
            Kondisi Cuaca
          </h2>
        </header>

        {/* Content */}
        <section
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-[15px]"
        >
          {/* Info Rows */}
          <div
            data-layer="info_rows"
            className="InfoRows self-stretch inline-flex justify-between items-center"
          >
            {/* Labels */}
            <div
              data-layer="label_container"
              className="LabelContainer w-[133px] inline-flex flex-col justify-start items-start gap-3"
            >
              <span className="RainProbPctTitle text-black text-sm font-normal">
                Probabilitas hujan
              </span>
              <span className="WindSpeedMpsTitle text-black text-sm font-normal">
                Kecepatan angin
              </span>
              <span className="VisibilityKmTitle text-black text-sm font-normal">
                Visibilitas jarak (km)
              </span>
              <span className="ExtremeFlagTitle text-black text-sm font-normal">
                Cuaca ekstrem
              </span>
            </div>

            {/* Values */}
            <div
              data-layer="value_container"
              className="ValueContainer w-[9px] inline-flex flex-col justify-start items-end gap-3"
            >
              <p className="RainProbPct text-right text-black text-sm font-semibold">
                {data.rainProbPct}
              </p>
              <p className="WindSpeedMps text-right text-black text-sm font-semibold">
                {data.windSpeedMps}
              </p>
              <p className="VisibilityKm text-right text-black text-sm font-semibold">
                {data.visibilityKm}
              </p>
              <p className="ExtremeFlag text-right text-black text-sm font-semibold">
                {data.extremeFlag}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            data-layer="divider"
            className="Divider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
          ></div>

          {/* Footer */}
          <footer
            data-layer="footer_container"
            className="FooterContainer self-stretch inline-flex justify-between items-center"
          >
            <span className="SourceLocationTitle text-black/60 text-sm font-normal">
              Lokasi Source
            </span>
            <span className="SourceLocation text-right text-[#666666] text-sm font-semibold">
              {data.sourceLocation}
            </span>
          </footer>
        </section>
      </div>
    </section>
  );
}

export default WeatherConditionCard;
