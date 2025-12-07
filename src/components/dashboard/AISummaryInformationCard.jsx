import React from "react";

function AISummaryInformationCard({ data }) {
  if (!data) return null;

  const lines = Array.isArray(data.summary_points) ? data.summary_points : [];

  return (
    <section
      data-layer="ai_summary_information_card"
      aria-label="AI summary information"
      className="AiSummaryInformationCard w-full h-full p-6 bg-white rounded-3xl flex flex-col gap-6"
    >
      <div className="CardContainer self-stretch flex flex-col gap-6">
        <header className="HeaderLeftGroup inline-flex items-center gap-3">
          <div className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
            <img className="IconRobot size-[18px]" src="/icons/icon_robot.png" alt="" />
          </div>

          <h2 className="AiSummaryTitle text-black text-sm font-semibold">AI Summary Information</h2>
        </header>

        <article className="AiSummarySection self-stretch min-h-[180px] px-[21px] py-7 bg-[#efefef] rounded-[10px] inline-flex">
          <p className="AiSummaryInput w-full text-black text-base whitespace-pre-wrap">
            {lines.join("\n")}
          </p>
        </article>
      </div>
    </section>
  );
}

export default AISummaryInformationCard;
