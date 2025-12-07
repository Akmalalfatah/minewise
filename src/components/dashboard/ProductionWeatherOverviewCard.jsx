import React, { useEffect, useState } from "react";
import { getProductionWeatherOverview } from "../../services/dashboardService";
import { ChartAreaGradient } from "../ui/ChartAreaGradient";

function ProductionWeatherOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getProductionWeatherOverview();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  return (
    <section
      data-layer="production_weather_overview_card"
      aria-label="Production and weather overview"
      className="ProductionWeatherOverviewCard w-full h-full p-6 bg-white rounded-3xl flex flex-col gap-6"
    >
      <div
        data-layer="card_container"
        className="CardContainer self-stretch flex flex-col gap-6"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup inline-flex items-center gap-3"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center"
          >
            <img
              data-layer="icon_overview"
              className="IconOverview size-[18px]"
              src="/icons/icon_overview.png"
              alt="Production and weather overview icon"
            />
          </div>
          <h2
            data-layer="production_weather_title"
            className="ProductionWeatherTitle text-black text-sm font-semibold"
          >
            Production &amp; Weather Overview
          </h2>
        </header>

        {/* Content */}
        <div
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col lg:flex-row items-stretch gap-6"
        >
          {/* Production info & anomalies */}
          <section
            data-layer="production_section"
            aria-label="Production data and AI anomaly flags"
            className="ProductionSection w-full lg:w-1/3 flex flex-col justify-start items-start gap-4"
          >
            {/* Production header */}
            <header
              data-layer="production_header"
              className="ProductionHeader self-stretch flex flex-col gap-3"
            >
              <h3
                data-layer="production_title"
                className="ProductionTitle text-black text-xs font-semibold"
              >
                Data untuk Produksi
              </h3>
              <div
                data-layer="divider"
                className="Divider self-stretch h-px bg-black/25"
              />
            </header>

            {/* Total production */}
            <article
              data-layer="total_production_row"
              className="TotalProductionRow w-full flex flex-col gap-2"
            >
              <span
                data-layer="total_production_title"
                className="TotalProductionTitle text-[#666666] text-xs font-normal"
              >
                Total Produksi
              </span>
              <p
                data-layer="total_production_input"
                className="TotalProductionInput text-black text-2xl font-semibold"
              >
                {data.totalProductionInput}
              </p>
            </article>

            {/* Target production */}
            <article
              data-layer="target_row"
              className="TargetRow w-full flex flex-col gap-2"
            >
              <span
                data-layer="target_production_title"
                className="TargetProductionTitle text-[#666666] text-xs font-normal"
              >
                Target
              </span>
              <p
                data-layer="target_production_input"
                className="TotalProductionInput text-black text-2xl font-semibold"
              >
                {data.targetProductionInput}
              </p>
            </article>

            {/* Anomalies (AI flags) */}
            <section
              data-layer="anomaly_ai_section"
              aria-label="AI anomaly flags for production"
              className="AnomalyAiSection self-stretch flex flex-col gap-3"
            >
              <h4
                data-layer="anomaly_ai_section_title"
                className="AnomalyAiSectionTitle text-[#666666] text-xs font-normal"
              >
                Anomali (AI flag)
              </h4>

              <ul
                data-layer="anomaly_header"
                className="AnomalyHeader flex flex-col gap-3"
              >
                <li
                  data-layer="anomaly_ai_item_1"
                  className="AnomalyAiItem1 inline-flex items-center gap-2"
                >
                  <img
                    data-layer="icon_importance"
                    className="IconImportance size-[17px]"
                    src="/icons/icon_importance.png"
                    alt="Anomaly indicator"
                  />
                  <p
                    data-layer="anomaly_ai_input_1_production"
                    className="AnomalyAiInput1 text-black text-xs font-normal"
                  >
                    {data.anomalyAiInput1Production}
                  </p>
                </li>

                <li
                  data-layer="anomaly_ai_item_2"
                  className="AnomalyAiItem2 inline-flex items-center gap-2"
                >
                  <img
                    data-layer="icon_importance"
                    className="IconImportance size-[17px]"
                    src="/icons/icon_importance.png"
                    alt="Anomaly indicator"
                  />
                  <p
                    data-layer="anomaly_ai_input_2_production"
                    className="AnomalyAiInput2 text-black text-xs font-normal"
                  >
                    {data.anomalyAiInput2Production}
                  </p>
                </li>

                <li
                  data-layer="anomaly_ai_item_3"
                  className="AnomalyAiItem3 inline-flex items-center gap-2"
                >
                  <img
                    data-layer="icon_importance"
                    className="IconImportance size-[17px]"
                    src="/icons/icon_importance.png"
                    alt="Anomaly indicator"
                  />
                  <p
                    data-layer="anomaly_ai_input_3_production"
                    className="AnomalyAiInput3 text-black text-xs font-normal"
                  >
                    {data.anomalyAiInput3Production}
                  </p>
                </li>
              </ul>
            </section>
          </section>

          {/* Chart area gradient */}
          <section
            aria-label="Production and weather chart"
            className="ProductionWeatherGraph w-full lg:w-2/3 min-h-[260px] lg:min-h-[300px] flex items-center"
          >
            <ChartAreaGradient />
          </section>
        </div>
      </div>
    </section>
  );
}

export default ProductionWeatherOverview;
