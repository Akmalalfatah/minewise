import React, { useState, useEffect, useMemo } from "react";
import { userStore } from "../store/userStore";
import { useGlobalFilter } from "../context/GlobalFilterContext";
import GlobalFilterBar from "../components/layout/GlobalFilterBar";
import EnvironmentConditionTable from "../components/mine-planner/EnvironmentConditionTable";
import AIRecommendationCard from "../components/mine-planner/AIRecommendationCard";
import MineRoadSegmentTable from "../components/mine-planner/MineRoadSegmentTable";
import EquipmentStatusTable from "../components/mine-planner/EquipmentStatusTable";
import PortWeatherConditions from "../components/shipping-planner/PortWeatherConditions";
import AIShippingRecommendationCard from "../components/shipping-planner/AIShippingRecommendationCard";
import VesselScheduleOverview from "../components/shipping-planner/VesselScheduleOverview";
import CoalVolumeCard from "../components/shipping-planner/CoalVolumeCard";
import LoadingProgressMonitoring from "../components/shipping-planner/LoadingProgressMonitoring";
import PortCongestionStatus from "../components/shipping-planner/PortCongestionStatus";

function OverviewPage() {
  const user = userStore((state) => state.user);
  const { location } = useGlobalFilter();

  const defaultView = useMemo(() => {
    if (user?.role === "mine_planner") return "mine";
    if (user?.role === "shipping_planner") return "shipping";
    return "mine";
  }, [user]);

  const [activeView, setActiveView] = useState(defaultView);

  useEffect(() => {
    setActiveView(defaultView);
  }, [defaultView]);

  return (
    <main className="min-h-screen bg-[#f5f5f7] flex justify-center">
      <div className="w-full max-w-[1440px] py-8 px-10 flex flex-col gap-6">
        <section
          aria-label="Global filters and overview view switcher"
          className="flex justify-between items-center gap-4"
        >
          <GlobalFilterBar
            locationType={activeView === "mine" ? "pit" : "port"}
          />

          <nav
            aria-label="Planner view toggle"
            className="inline-flex bg-white rounded-full p-1 h-[71px]"
          >
            <button
              type="button"
              onClick={() => setActiveView("mine")}
              className={`px-6 py-2 rounded-full text-base font-semibold transition ${
                activeView === "mine"
                  ? "bg-[#1c2534] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-current={activeView === "mine" ? "page" : undefined}
            >
              Mine Planner View
            </button>

            <button
              type="button"
              onClick={() => setActiveView("shipping")}
              className={`px-6 py-2 rounded-full text-base font-semibold transition ${
                activeView === "shipping"
                  ? "bg-[#1c2534] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-current={activeView === "shipping" ? "page" : undefined}
            >
              Shipping Planner View
            </button>
          </nav>
        </section>

        {activeView === "mine" ? (
          <section
            aria-label="Mine planner overview"
            className="flex flex-col gap-5"
          >
            <section
              aria-label="Environment conditions and AI recommendations"
              className="flex flex-col lg:flex-row gap-6 items-stretch"
            >
              <EnvironmentConditionTable />
              <AIRecommendationCard />
            </section>

            <section
              aria-label="Mine road conditions and equipment status"
              className="flex flex-col lg:flex-row gap-6 items-stretch"
            >
              <MineRoadSegmentTable />
              <EquipmentStatusTable />
            </section>
          </section>
        ) : (
          <section
            aria-label="Shipping planner overview"
            className="flex flex-col gap-5"
          >
            <header
              aria-label="Shipping planner description"
              className="flex flex-col gap-1"
            >
              <p className="text-xs text-gray-500 mt-1">
                Current location:{" "}
                <span className="font-medium text-gray-700">{location}</span>
              </p>
            </header>

            <section
              aria-label="Port weather conditions and AI shipping recommendations"
              className="flex flex-col lg:flex-row gap-6 items-stretch"
            >
              <section className="lg:w-[360px] flex-shrink-0">
                <PortWeatherConditions />
              </section>
              <section className="flex-1">
                <AIShippingRecommendationCard />
              </section>
            </section>

            <section
              aria-label="Vessel schedule and coal volume"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
            >
              <section className="flex flex-col h-full">
                <VesselScheduleOverview />
              </section>
              <section className="flex flex-col h-full">
                <CoalVolumeCard />
              </section>
            </section>

            <section
              aria-label="Loading progress and port congestion status"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
            >
              <section className="flex flex-col h-full">
                <LoadingProgressMonitoring />
              </section>
              <section className="flex flex-col h-full">
                <PortCongestionStatus />
              </section>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}

export default OverviewPage;
