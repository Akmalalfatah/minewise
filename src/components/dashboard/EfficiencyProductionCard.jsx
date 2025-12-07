import React from "react";

function EfficiencyProductionCard({ data }) {
  if (!data) return null;

  return (
    <section
      data-layer="efficiency_production_card"
      aria-label="Efficiency production information"
      className="EfficiencyProductionCardJsx w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div className="HeaderContainer size- flex flex-col justify-center items-start gap-[18px]">
        <header className="HeaderLeftGroup size- rounded-3xl inline-flex justify-center items-center gap-3">
          <div className="IconWrapper size-8 px-[7px] py-2 bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
            <img className="IconPerformance size-[18px]" src="/icons/icon_performance.png" alt="" />
          </div>

          <h2 className="text-black text-sm font-semibold">Efisiensi Produksi</h2>
        </header>

        <section className="ContantContainer size- flex flex-col justify-start items-start gap-[18px]">
          <div className="InfoRows w-[205px] h-[92px] inline-flex justify-between items-center">
            <div className="LabelContainer w-[117px] inline-flex flex-col gap-5">
              <span className="text-black text-sm">Jam efektif</span>
              <span className="text-black text-sm">Jam maintanance</span>
              <span className="text-black text-sm">Efficiency Rate</span>
            </div>

            <div className="ValueContainer inline-flex flex-col justify-center items-end gap-5">
              <p className="text-black text-sm font-semibold">{data.effective_hours}</p>
              <p className="text-black text-sm font-semibold">{data.maintenance_hours}</p>
              <p className="text-[#4caf50] text-sm font-semibold">{data.efficiency_rate}%</p>
            </div>
          </div>

          <div className="Divider w-[205px] h-0 outline outline-[0.50px] outline-[#bdbdbd]" />

          <footer className="FooterContainer w-[205px] inline-flex justify-between items-center ">
            <span className="text-black/60 text-sm">Lokasi Source</span>
            <span className="text-[#666] text-sm font-semibold">{data.source_location}</span>
          </footer>
        </section>
      </div>
    </section>
  );
}

export default EfficiencyProductionCard;
