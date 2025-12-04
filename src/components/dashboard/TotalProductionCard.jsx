import React, { useEffect, useState } from "react";
import { getTotalProduction } from "../../services/dashboardService";

function TotalProductionCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getTotalProduction();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  return (
    <section
      data-layer="total_production_card"
      aria-label="Total production summary"
      className="TotalProductionCard w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="header_container"
        className="HeaderContainer w-[205px] h-[199px] flex flex-col justify-center items-start gap-3"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup size- rounded-3xl inline-flex justify-start items-center gap-3"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
          >
            <img
              data-layer="icon_factory"
              className="IconFactory size-[18px]"
              src="/icons/icon_factory.png"
              alt="Factory icon"
            />
          </div>
          <h2
            data-layer="total_production_title"
            className="TotalProductionTitle justify-start text-black text-sm font-semibold"
          >
            Total Produksi
          </h2>
        </header>

        {/* Content */}
        <section
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-[15px]"
        >
          {/* Info rows */}
          <div
            data-layer="info_rows"
            className="InfoRows self-stretch inline-flex justify-between items-center"
          >
            {/* Labels */}
            <div
              data-layer="label_column"
              className="LabelColumn w-[120px] inline-flex flex-col justify-start items-start gap-3"
            >
              <span
                data-layer="produce_ton_title"
                className="ProduceTonTitle self-stretch justify-start text-black text-sm font-normal"
              >
                Produksi material
              </span>
              <span
                data-layer="target_ton_title"
                className="TargetTonTitle self-stretch justify-start text-black text-sm font-normal"
              >
                Target ton
              </span>
              <span
                data-layer="avg_production_per_day_title"
                className="AvgProductionPerDayTitle self-stretch justify-start text-black text-sm font-normal"
              >
                Rata-rata per hari
              </span>
              <span
                data-layer="deviation_pct_title"
                className="DeviationPctTitle self-stretch justify-start text-black text-sm font-normal"
              >
                Deviasi (%)
              </span>
            </div>

            {/* Values */}
            <div
              data-layer="value_column"
              className="ValueColumn w-[9px] inline-flex flex-col justify-start items-end gap-3"
            >
              <p
                data-layer="produce_ton"
                className="ProduceTon text-right justify-start text-black text-sm font-semibold"
              >
                {data.produceTon}
              </p>
              <p
                data-layer="target_ton"
                className="TargetTon text-right justify-start text-black text-sm font-semibold"
              >
                {data.targetTon}
              </p>
              <p
                data-layer="avg_production_per_day"
                className="AvgProductionPerDay text-right justify-start text-black text-sm font-semibold"
              >
                {data.avgProductionPerDay}
              </p>
              <p
                data-layer="deviation_pct"
                className="DeviationPct text-right justify-start text-black text-sm font-semibold"
              >
                {data.deviationPct}
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
            data-layer="footer__containter"
            className="FooterContainter self-stretch inline-flex justify-between items-center"
          >
            <span
              data-layer="source_location_title"
              className="SourceLocationTitle justify-start text-black/60 text-sm font-normal"
            >
              Lokasi Source
            </span>
            <span
              data-layer="source_location"
              className="SourceLocation text-right justify-start text-black/60 text-sm font-semibold"
            >
              {data.sourceLocation}
            </span>
          </footer>
        </section>
      </div>
    </section>
  );
}

export default TotalProductionCard;
