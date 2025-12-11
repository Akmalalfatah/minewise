import React from "react";
import AnimatedNumber from "../animation/AnimatedNumber";
import KpiCardWrapper from "../animation/KpiCardWrapper";

function TotalProductionCard({ data }) {
  if (!data) return null;

  const produceTon = Number(data.produce_ton) || 0;
  const targetTon = Number(data.target_ton) || 0;
  const avgPerDay = Number(data.avg_production_per_day) || 0;
  const deviationPct = Number(data.deviation_pct) || 0;

  // contoh: kalau deviasi > 10% bisa dianggap alert (kalau mau dipulse)
  const isAlert = deviationPct > 10;

  return (
    <KpiCardWrapper
      isAlert={isAlert}
      className="TotalProductionCard w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <section
        data-layer="total_production_card"
        aria-label="Total production summary"
        className="w-full h-full"
      >
        <div
          data-layer="header_container"
          className="HeaderContainer w-[205px] h-[199px] flex flex-col justify-center items-start gap-3"
        >
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

          <section
            data-layer="content_container"
            className="ContentContainer self-stretch flex flex-col justify-start items-start gap-[15px]"
          >
            <div
              data-layer="info_rows"
              className="InfoRows self-stretch inline-flex justify-between items-center"
            >
              <div
                data-layer="label_column"
                className="LabelColumn w-[120px] inline-flex flex-col justify-start items-start gap-3"
              >
                <span className="ProduceTonTitle self-stretch justify-start text-black text-sm font-normal">
                  Produksi material
                </span>
                <span className="TargetTonTitle self-stretch justify-start text-black text-sm font-normal">
                  Target ton
                </span>
                <span className="AvgProductionPerDayTitle self-stretch justify-start text-black text-sm font-normal">
                  Rata-rata per hari
                </span>
                <span className="DeviationPctTitle self-stretch justify-start text-black text-sm font-normal">
                  Deviasi (%)
                </span>
              </div>

              <div
                data-layer="value_column"
                className="ValueColumn w-[9px] inline-flex flex-col justify-start items-end gap-3"
              >
                <p className="ProduceTon text-right justify-start text-black text-sm font-semibold">
                  <AnimatedNumber value={produceTon} decimals={0} />
                </p>
                <p className="TargetTon text-right justify-start text-black text-sm font-semibold">
                  <AnimatedNumber value={targetTon} decimals={0} />
                </p>
                <p className="AvgProductionPerDay text-right justify-start text-black text-sm font-semibold">
                  <AnimatedNumber value={avgPerDay} decimals={0} />
                </p>
                <p className="DeviationPct text-right justify-start text-black text-sm font-semibold">
                  <AnimatedNumber value={deviationPct} decimals={1} />
                </p>
              </div>
            </div>

            <div
              data-layer="divider"
              className="Divider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
            ></div>

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
    </KpiCardWrapper>
  );
}

export default TotalProductionCard;
