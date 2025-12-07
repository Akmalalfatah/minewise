import React, { useEffect, useState } from "react";
import { getAISummary } from "../../services/dashboardService";

function AISummaryInformationCard() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const result = await getAISummary();

        let normalized = [];

        if (Array.isArray(result)) {
          normalized = result;
        } else if (typeof result === "string") {
          normalized = [result];
        } else if (result && typeof result === "object") {
          normalized = Object.values(result);
        }

        setSummary(normalized);
      } catch (err) {
        console.error("Failed to load AI summary:", err);
        setSummary(["AI summary unavailable."]);
      }
    }

    load();
  }, []);

  if (!summary || summary.length === 0) return null;

  const aiSummaryInput = summary.join("\n");

  return (
    <section
      data-layer="ai_summary_information_card"
      aria-label="AI summary information"
      className="AiSummaryInformationCard w-full h-full p-6 bg-white rounded-3xl flex flex-col gap-6"
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
              data-layer="icon_robot"
              className="IconRobot size-[18px]"
              src="/icons/icon_robot.png"
              alt="AI Robot Icon"
            />
          </div>

          <h2
            data-layer="ai_summary_title"
            className="AiSummaryTitle text-black text-sm font-semibold"
          >
            AI Summary Information
          </h2>
        </header>

        {/* Summary Content */}
        <article
          data-layer="ai_summary_section"
          className="AiSummarySection self-stretch min-h-[180px] px-[21px] py-7 bg-[#efefef] rounded-[10px] inline-flex justify-start items-start"
        >
          <p
            data-layer="ai_summary_input"
            className="AiSummaryInput w-full text-black text-base font-normal whitespace-pre-wrap"
          >
            {aiSummaryInput}
          </p>
        </article>
      </div>
    </section>
  );
}

export default AISummaryInformationCard;
