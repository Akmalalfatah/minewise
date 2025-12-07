import React, { useEffect, useState } from "react";
import { getPortWeatherConditions } from "../../services/shippingPlannerService";

function PortWeatherConditions() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getPortWeatherConditions();
      setData(result);
    }
    load();
  }, []);

  const area = data?.area || "-";
  const location = data?.location || "-";
  const rainfall = data?.rainfall || "-";
  const temperature = data?.temperature || "-";
  const humidity = data?.humidity || "-";
  const wind = data?.wind || "-";
  const pressure = data?.pressure || "-";
  const visibility = data?.visibility || "-";
  const lightning = data?.lightning || "-";
  const updated = data?.updated || "-";
  const riskScore = data?.riskScore || "-";
  const riskTitle = data?.riskTitle || "-";
  const riskSubtitle = data?.riskSubtitle || "-";

  return (
    <section
      data-layer="port_weather_condition_card"
      className="PortWeatherConditionCard w-full max-w-[360px] p-6 bg-white rounded-3xl flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="port_weather_condition_container"
        className="PortWeatherConditionContainer w-full flex flex-col justify-center items-center gap-[7px]"
      >
        <div
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-3"
        >
          {/* Header */}
          <header
            data-layer="header_container"
            className="HeaderContainer self-stretch flex flex-col justify-start items-start gap-2.5"
          >
            <div
              data-layer="header_left_group"
              className="HeaderLeftGroup relative inline-flex justify-start items-center gap-3"
            >
              <figure
                data-layer="icon_wrapper"
                className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
              >
                <img
                  className="IconWeather size-[18px]"
                  src="/icons/icon_weather.png"
                  alt="Weather icon"
                />
              </figure>

              <h2 className="PortWeatherConditionTitle text-black text-sm font-semibold">
                Port Weather Conditions
              </h2>

              <button
                type="button"
                className="HeaderActionButtonFilter size-8 px-2 py-[7px] right-0 top-0 absolute bg-[#efefef] rounded-2xl inline-flex flex-col justify-center items-center"
              >
                <div className="IconFilter size-[21px] relative" />
              </button>
            </div>
          </header>

          {/* Area */}
          <section className="AreaSectionContainer self-stretch inline-flex justify-between items-center">
            <span className="AreaLabel text-black text-xs font-semibold">
              Area:
            </span>
            <span className="AreaValue text-right text-black text-xs font-semibold">
              {area}
            </span>
          </section>

          <hr className="DividerTop self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]" />

          {/* Weather info */}
          <section className="WeatherInfoSection self-stretch inline-flex justify-between items-center">
            <dl className="w-full flex justify-between">
              {/* Labels */}
              <div className="LabelColumnContainer inline-flex flex-col justify-center items-start gap-3 text-black text-sm font-semibold">
                <dt>Location</dt>
                <dt>Rainfall</dt>
                <dt>Temperature</dt>
                <dt>Humidity</dt>
                <dt>Wind</dt>
                <dt>Pressure</dt>
                <dt>Visibility</dt>
                <dt>Lightning</dt>
                <dt>Updated</dt>
              </div>

              {/* Values */}
              <div className="ValueColumnContainer inline-flex flex-col justify-start items-end gap-3 text-black text-sm font-semibold">
                <dd>{location}</dd>
                <dd>{rainfall}</dd>
                <dd>{temperature}</dd>
                <dd>{humidity}</dd>
                <dd>{wind}</dd>
                <dd>{pressure}</dd>
                <dd>{visibility}</dd>
                <dd>{lightning}</dd>
                <dd>{updated}</dd>
              </div>
            </dl>
          </section>
        </div>

        <hr className="DividerMiddle self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]" />

        {/* Risk section */}
        <section className="RiskSectionContainer self-stretch flex flex-col justify-start items-start gap-2.5">
          <h3 className="RiskSectionTitle self-stretch text-black text-sm font-semibold">
            Weather-Based Risk
          </h3>

          <div className="RiskContentContainer self-stretch inline-flex justify-start items-center gap-[18px]">
            <div className="RiskScoreContainer w-[105px] h-14 px-2.5 py-[13px] bg-[#ffedef] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#ffd4c7] flex justify-center items-center">
              <p className="RiskScoreValue text-center text-[#8f0b09] text-2xl font-semibold">
                {riskScore}
              </p>
            </div>

            <div className="RiskDescriptionContainer flex-1 inline-flex flex-col justify-start items-start gap-0.5">
              <p className="RiskDescriptionTitle self-stretch text-black text-xs font-semibold">
                {riskTitle}
              </p>
              <p className="RiskDescriptionSubtext self-stretch text-black/60 text-xs">
                {riskSubtitle}
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default PortWeatherConditions;
