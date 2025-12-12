import React from "react";
import KpiCardWrapper from "../animation/KpiCardWrapper";

function AISummaryInformationCard({ data }) {
  if (!data) return null;

  const lines = Array.isArray(data.summary_points) ? data.summary_points : [];

  return (
    <KpiCardWrapper className="w-full h-full">
      <section
        data-layer="ai_summary_information_card"
        aria-label="AI summary information"
        className="AiSummaryInformationCard w-full h-full p-6 bg-[#101828] rounded-3xl flex flex-col gap-6"
      >
        <div className="CardContainer self-stretch flex flex-col gap-6">
          <header className="HeaderLeftGroup inline-flex items-center gap-3">
            <div className="IconWrapper size-8 px-[7px] bg-white rounded-2xl flex justify-center items-center">
              <img
                className="IconRobot size-[18px]"
                src="/icons/icon_robot_black.png"
                alt=""
              />
            </div>

            <h2 className="AiSummaryTitle text-white text-sm font-semibold">
              AI Summary Information
            </h2>
          </header>

          <article className="AiSummarySection self-stretch min-h-[280px] px-[21px] py-7 bg-white/5 rounded-[10px] inline-flex">
            <p className="AiSummaryInput w-full text-white text-base whitespace-pre-wrap">
              {lines.join("\n")}
            </p>
          </article>
        </div>
      </section>
    </KpiCardWrapper>
  );
}

export default AISummaryInformationCard;
