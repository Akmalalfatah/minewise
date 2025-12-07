import React from "react";
import { ChartBarMultiple } from "../ui/ChartBarMultiple";

function DecisionImpactAnalysisCard({ data }) {
  if (!data) return null;

  return (
    <section
      data-layer="decision_impact_analysis_card"
      aria-label="Decision impact analysis"
      className="DecisionImpactAnalysisCard w-full h-full p-6 bg-white rounded-3xl flex flex-col gap-6"
    >
      <div className="CardContainer self-stretch flex flex-col gap-6">
        <header className="HeaderLeftGroup inline-flex items-center gap-3">
          <div className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
            <img className="IconDecision size-[18px]" src="/icons/icon_decision.png" alt="" />
          </div>
          <h2 className="text-black text-sm font-semibold">Decision Impact Analysis</h2>
        </header>

        <div className="ContentContainer self-stretch flex flex-col lg:flex-row gap-8 items-stretch">
          <section className="AnalysisSection w-full lg:w-1/3 flex flex-col gap-3">
            <h3 className="text-black text-xs font-semibold">Data Curah Hujan vs Produksi</h3>

            <div className="Divider h-px bg-black/25" />

            <article className="flex flex-col gap-2">
              <span className="text-[#666] text-xs">Hasil korelasi</span>
              <p className="text-black text-4xl font-semibold">
                {data.correlation?.rain_vs_production}
              </p>
            </article>
          </section>

          <section className="ChartSection flex-1">
            <ChartBarMultiple />
          </section>
        </div>
      </div>
    </section>
  );
}

export default DecisionImpactAnalysisCard;
