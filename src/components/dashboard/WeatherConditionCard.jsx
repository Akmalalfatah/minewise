import React from "react";

function WeatherConditionCard({ data }) {
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

          <h2 className="WeatherConditionTitle justify-start text-black text-sm font-semibold">
            Kondisi Cuaca
          </h2>
        </header>

        <section
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-[15px]"
        >
          <div className="InfoRows self-stretch inline-flex justify-between items-center">
            <div className="LabelContainer w-[133px] inline-flex flex-col justify-start items-start gap-3">
              <span className="text-black text-sm font-normal">Probabilitas hujan</span>
              <span className="text-black text-sm font-normal">Kecepatan angin</span>
              <span className="text-black text-sm font-normal">Visibilitas jarak (km)</span>
              <span className="text-black text-sm font-normal">Cuaca ekstrem</span>
            </div>

            <div className="ValueContainer w-[9px] inline-flex flex-col justify-start items-end gap-3">
              <p className="text-right text-black text-sm font-semibold">{data.rain_probability_pct}</p>
              <p className="text-right text-black text-sm font-semibold">{data.wind_speed_kmh}</p>
              <p className="text-right text-black text-sm font-semibold">{data.visibility_km}</p>
              <p className="text-right text-black text-sm font-semibold">{data.extreme_weather_flag ? "Ya" : "Tidak"}</p>
            </div>
          </div>

          <div className="Divider self-stretch h-0 outline outline-[0.50px] outline-[#bdbdbd]" />
          <footer
            data-layer="footer__containter"
            className="FooterContainter self-stretch inline-flex justify-between items-center"
          >
            <span className="SourceLocationTitle justify-start text-black/60 text-sm font-normal">
              Lokasi Source
            </span>
            <span className="SourceLocation text-right justify-start text-black/60 text-sm font-semibold">
              {data.source_location}
            </span>
          </footer>
        </section>
      </div>
    </section>
  );
}

export default WeatherConditionCard;
