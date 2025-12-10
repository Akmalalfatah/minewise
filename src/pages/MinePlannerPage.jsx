import React from "react";
import { useGlobalFilter } from "../context/GlobalFilterContext";
import GlobalFilterBar from "../components/layout/GlobalFilterBar";
import EnvironmentConditionTable from "../components/mine-planner/EnvironmentConditionTable";
import AIRecommendationCard from "../components/mine-planner/AIRecommendationCard";
import MineRoadSegmentTable from "../components/mine-planner/MineRoadSegmentTable";
import EquipmentStatusTable from "../components/mine-planner/EquipmentStatusTable";

function MinePlannerPage() {
  const { location, timePeriod, shift } = useGlobalFilter();

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-8 py-6">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        <header
          aria-label="Mine planner introduction and current filters"
          className="flex justify-between items-start gap-4"
        >
        </header>

        {/* GLOBAL FILTER BAR + TOGGLE VIEW */}
        <section
          aria-label="Mine and shipping view filters"
          className="flex justify-between items-center gap-4"
        >
          <GlobalFilterBar />

          <nav
            aria-label="Planner view switcher"
            className="inline-flex bg-white rounded-full p-1 shadow-sm"
          >
            <button
              type="button"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1c2534] text-white"
              aria-current="page"
            >
              Mine Planner View
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Shipping Planner View
            </button>
          </nav>
        </section>

        {/* MAIN GRID: Environment + AI Recommendation */}
        <section
          aria-label="Environment conditions and AI recommendation"
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {/* Environment Conditions */}
          <section className="lg:col-span-1">
            <EnvironmentConditionTable />
          </section>

          {/* AI Recommendation */}
          <section className="lg:col-span-2">
            <AIRecommendationCard />
          </section>
        </section>

        {/* SECOND GRID: Road & Equipment */}
        <section
          aria-label="Mine road conditions and equipment status"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {/* Mine Road & Site Conditions */}
          <section>
            <MineRoadSegmentTable />
          </section>

          {/* Equipment Status */}
          <section>
            <EquipmentStatusTable />
          </section>
        </section>
      </div>
    </main>
  );
}

export default MinePlannerPage;
