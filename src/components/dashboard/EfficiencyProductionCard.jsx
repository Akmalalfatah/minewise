import React, { useEffect, useState } from "react";
import { getProductionEfficiency } from "../../services/dashboardService";

function EfficiencyProductionCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getProductionEfficiency();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  return (
    <section
      data-layer="efficiency_production_card"
      aria-label="Efficiency production information"
      className="EfficiencyProductionCardJsx w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="header_container"
        className="HeaderContainer size- flex flex-col justify-center items-start gap-[18px]"
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
              data-layer="icon_performance"
              className="IconPerformance size-[18px]"
              src="/icons/icon_performance.png"
              alt="Performance Icon"
            />
          </div>

          <h2
            data-layer="efficiency_production_title"
            className="EfficiencyProductionTitle justify-start text-black text-sm font-semibold"
          >
            Efisiensi Produksi
          </h2>
        </header>

        {/* Content */}
        <section
          data-layer="content_container"
          className="ContantContainer size- flex flex-col justify-start items-start gap-[18px]"
        >
          {/* Info rows */}
          <div
            data-layer="info_rows"
            className="InfoRows w-[205px] h-[92px] inline-flex justify-between items-center"
          >
            {/* Labels */}
            <div
              data-layer="label_container"
              className="LabelContainer w-[117px] inline-flex flex-col justify-center items-start gap-5"
            >
              <span
                data-layer="effective_hours_title"
                className="EffectiveHoursTitle text-black text-sm font-normal"
              >
                Jam efektif
              </span>
              <span
                data-layer="maintanance_hours_title"
                className="MaintananceHoursTitle text-black text-sm font-normal"
              >
                Jam maintanance
              </span>
              <span
                data-layer="efficiency_rate_title"
                className="EfficiencyRateTitle text-black text-sm font-normal"
              >
                Efficiency Rate
              </span>
            </div>

            {/* Values */}
            <div
              data-layer="value_container"
              className="ValueContainer w-[9px] h-[75px] inline-flex flex-col justify-center items-end gap-5"
            >
              <p
                data-layer="effective_hours"
                className="EffectiveHours text-right text-black text-sm font-semibold"
              >
                {data.effectiveHours}
              </p>
              <p
                data-layer="maintanance_hours"
                className="MaintananceHours text-right text-black text-sm font-semibold"
              >
                {data.maintananceHours}
              </p>
              <p
                data-layer="efficiency_rate"
                className="EfficiencyRate text-right text-[#4caf50] text-sm font-semibold"
              >
                {data.efficiencyRate}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            data-layer="divider"
            className="Divider w-[205px] h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
          ></div>

          {/* Footer summary */}
          <footer
            data-layer="footer_container"
            className="FooterContainer w-[205px] h-[17px] inline-flex justify-between items-center"
          >
            <span
              data-layer="source_location_title"
              className="SourceLocationTitle text-black/60 text-sm font-normal"
            >
              Lokasi Source
            </span>
            <span
              data-layer="source_location"
              className="SourceLocation text-right text-[#666666] text-sm font-semibold"
            >
              {data.sourceLocation}
            </span>
          </footer>
        </section>
      </div>
    </section>
  );
}

export default EfficiencyProductionCard;
