import React, { useEffect, useState } from "react";
import { getRoadConditionOverview } from "../../services/dashboardService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function RoadConditionOverviewCard() {
  const [data, setData] = useState(null);
  const filters = useFilterQuery();

  useEffect(() => {
    async function load() {
      try {
        const result = await getRoadConditionOverview(filters);
        setData(result);
      } catch (err) {
        console.error("Failed to load road condition overview:", err);
      }
    }

    load();
  }, [filters.location, filters.timePeriod, filters.shift]);

  const segments = data?.segments || data?.items || data || [];
  const safeSegments = Array.isArray(segments) ? segments : [];

  if (!data) {
    return null;
  }

  return (
    <section
      data-layer="road_condition_overview_card"
      className="RoadConditionOverviewCard w-[536px] h-[248px] p-4 bg-white rounded-3xl flex flex-col gap-3"
    >
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center">
          <img
            src="/icons/icon_road.png"
            alt="Road icon"
            className="size-[18px]"
          />
        </div>
        <h2 className="text-black text-sm font-semibold">
          Road Condition Overview
        </h2>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        {safeSegments.length === 0 ? (
          <p className="text-sm text-black/60">
            No road condition data available for current filter.
          </p>
        ) : (
          <ul className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
            {safeSegments.map((item, index) => (
              <li
                key={item.id || item.segment || index}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-black font-medium">
                  {item.segment || item.name || `Segment ${index + 1}`}
                </span>
                <span className="text-black/80">
                  {item.condition || item.status || "-"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer opsional */}
      {data?.summary && (
        <footer className="pt-1 border-t border-[#bdbdbd]/60 text-xs text-black/70">
          {data.summary}
        </footer>
      )}
    </section>
  );
}

export default RoadConditionOverviewCard;
