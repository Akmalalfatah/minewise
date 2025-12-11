import React from "react";
import AnimatedNumber from "../animation/AnimatedNumber";
import KpiCardWrapper from "../animation/KpiCardWrapper";

function EfficiencyProductionCard({ data }) {
  if (!data) return null;

  const getDecimals = (val) => {
    if (val === null || val === undefined) return 0;
    const str = String(val);
    const idx = str.indexOf(".");
    if (idx === -1) return 0;
    return str.length - idx - 1;
  };

  const effectiveHours = Number(data.effective_hours) || 0;
  const maintenanceHours = Number(data.maintenance_hours) || 0;
  const efficiencyRate = Number(data.efficiency_rate) || 0;

  const effectiveDecimals = getDecimals(data.effective_hours);
  const maintenanceDecimals = getDecimals(data.maintenance_hours);
  const efficiencyDecimals = getDecimals(data.efficiency_rate);

  return (
    <KpiCardWrapper
      className="EfficiencyProductionCardJsx w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <section
        data-layer="efficiency_production_card"
        aria-label="Efficiency production information"
        className="w-full h-full"
      >
        <div className="HeaderContainer size- flex flex-col justify-center items-start gap-[18px]">
          <header className="HeaderLeftGroup size- rounded-3xl inline-flex justify-center items-center gap-3">
            <div className="IconWrapper size-8 px-[7px] py-2 bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
              <img
                className="IconPerformance size-[18px]"
                src="/icons/icon_performance.png"
                alt=""
              />
            </div>

            <h2 className="text-black text-sm font-semibold">
              Efisiensi Produksi
            </h2>
          </header>

          <section className="ContantContainer size- flex flex-col justify-start items-start gap-[18px]">
            <div className="InfoRows w-[205px] h-[92px] inline-flex justify-between items-center">
              <div className="LabelContainer w-[117px] inline-flex flex-col gap-5">
                <span className="text-black text-sm">Jam efektif</span>
                <span className="text-black text-sm">Jam maintanance</span>
                <span className="text-black text-sm">Efficiency Rate</span>
              </div>

              <div className="ValueContainer inline-flex flex-col justify-center items-end gap-5">
                <p className="text-black text-sm font-semibold">
                  <AnimatedNumber
                    value={effectiveHours}
                    decimals={effectiveDecimals}
                  />
                </p>
                <p className="text-black text-sm font-semibold">
                  <AnimatedNumber
                    value={maintenanceHours}
                    decimals={maintenanceDecimals}
                  />
                </p>
                <p className="text-[#4caf50] text-sm font-semibold">
                  <AnimatedNumber
                    value={efficiencyRate}
                    decimals={efficiencyDecimals}
                  />
                  %
                </p>
              </div>
            </div>

            <div className="Divider w-[205px] h-0 outline outline-[0.50px] outline-[#bdbdbd]" />

            <footer className="FooterContainer w-[205px] inline-flex justify-between items-center ">
              <span className="text-black/60 text-sm">Lokasi Source</span>
              <span className="text-[#666] text-sm font-semibold">
                {data.source_location}
              </span>
            </footer>
          </section>
        </div>
      </section>
    </KpiCardWrapper>
  );
}

export default EfficiencyProductionCard;
