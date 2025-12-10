import React, { useEffect, useState } from "react";
import { getPortWeatherConditions } from "../../services/shippingPlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function PortWeatherConditions() {
  const [data, setData] = useState(null);
  const { location, timePeriod, shift } = useFilterQuery();

  useEffect(() => {
    async function load() {
      try {
        const filters = { location, timePeriod, shift };
        const result = await getPortWeatherConditions(filters);
        setData(result);
      } catch (err) {
        console.error("Failed to load port weather conditions:", err);
        setData(null);
      }
    }
    load();
  }, [location, timePeriod, shift]);

  const area = data?.area || "-";
  const loc = data?.location || "-";
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
                  className="IconEnvironment size-[18px]"
                  src="/icons/icon_environment.png"
                  alt="Environment icon"
                />
              </figure>

              <h2 className="PortWeatherConditionTitle text-black text-sm font-semibold">
                Port Weather Conditions
              </h2>
            </div>
          </header>

          <section className="AreaSectionContainer self-stretch inline-flex justify-between items-center">
            <span className="AreaLabel text-black text-xs font-semibold">
              Area:
            </span>
            <span className="AreaValue text-right text-black text-xs font-semibold">
              {area}
            </span>
          </section>

          <hr className="DividerTop self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]" />

          <section className="WeatherInfoSection self-stretch inline-flex justify-between items-center">
            <dl className="w-full flex justify-between">
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

              <div className="ValueColumnContainer inline-flex flex-col justify-start items-end gap-3 text-black text-sm font-semibold">
                <dd>{loc}</dd>
                <dd>{rainfall}</dd>
                <dd>{temperature}</dd>
                <dd>{humidity}</dd>
                <dd>{wind}</dd>
                <dd>{pressure}</dd>
                <dd>{visibility}</dd>
                <dd>{lightning ? "Detected" : "None"}</dd>
                <dd>{updated}</dd>
              </div>
            </dl>
          </section>
        </div>

        <hr className="DividerMiddle self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]" />

        <section className="RiskSectionContainer self-stretch flex flex-col justify-start items-start gap-2.5">
          <h3 className="RiskSectionTitle self-stretch text-black text-sm font-semibold">
            Weather-Based Risk
          </h3>

          <div className="RiskContentContainer self-stretch inline-flex justify-start items-center gap-[18px]">
            <div className="RiskScoreContainer w-[105px] h-14 px-2.5 py-[13px] bg-[#ffedef] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#ffd4c7] flex justify-center items-center">
              <p className="RiskScoreValue text-center text-[#8f0b09] text-2xl font-semibold">
                {riskScore}<span>/100</span>
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
