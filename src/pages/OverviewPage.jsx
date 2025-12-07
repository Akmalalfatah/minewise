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
  const { location, timePeriod, shift } = useGlobalFilter();

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
      {/* wrapper lebar 1440px seperti Dashboard */}
      <div className="w-full max-w-[1440px] py-8 px-10 flex flex-col gap-6">
        {/* PAGE TITLE */}
        <header
          aria-label="Overview introduction"
          className="flex flex-col gap-1"
        >
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Overview</h1>
          <p className="text-gray-600 mt-1 text-sm max-w-[640px]">
            Ringkasan overview tambang atau pelabuhan berdasarkan filter
            global.
          </p>
        </header>

        {/* GLOBAL FILTER + TOGGLE VIEW */}
        <section
          aria-label="Global filters and overview view switcher"
          className="flex justify-between items-center gap-4"
        >
          <GlobalFilterBar />

          <nav
            aria-label="Planner view toggle"
            className="inline-flex bg-white rounded-full p-1 shadow-sm"
          >
            <button
              type="button"
              onClick={() => setActiveView("mine")}
              className={`px-6 py-2 rounded-full text-xs font-semibold transition ${
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
              className={`px-6 py-2 rounded-full text-xs font-semibold transition ${
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

        {/* CONTENT */}
        {activeView === "mine" ? (
          <section
            aria-label="Mine planner overview"
            className="flex flex-col gap-5"
          >
            {/* SUB-HEADER */}
            <header
              aria-label="Mine planner description"
              className="flex flex-col gap-1"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Mine Planner View
              </h2>
              <p className="text-sm text-gray-600 max-w-[680px]">
                Pantau kondisi lingkungan pit, rekomendasi AI, kondisi jalan,
                dan status alat untuk mendukung keputusan perencanaan tambang.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Current filter:&nbsp;
                <span className="font-medium text-gray-700">{location}</span>
                {" · "}
                <span className="font-medium text-gray-700">{timePeriod}</span>
                {" · "}
                <span className="font-medium text-gray-700">{shift}</span>
              </p>
            </header>

            {/* ROW 1: Environment + AI Recommendation */}
            <section
              aria-label="Environment conditions and AI recommendations"
              className="flex flex-col lg:flex-row gap-6 items-stretch"
            >
              <EnvironmentConditionTable />
              <AIRecommendationCard />
            </section>

            {/* ROW 2: Mine Road & Site Conditions + Equipment Status */}
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
            {/* SUB-HEADER */}
            <header
              aria-label="Shipping planner description"
              className="flex flex-col gap-1"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Shipping Planner View
              </h2>
              <p className="text-sm text-gray-600 max-w-[720px]">
                Monitor kondisi cuaca pelabuhan, jadwal kapal, volume batubara
                siap dikirim, progres loading, serta tingkat kemacetan port.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Current filter:&nbsp;
                <span className="font-medium text-gray-700">{location}</span>
                {" · "}
                <span className="font-medium text-gray-700">{timePeriod}</span>
                {" · "}
                <span className="font-medium text-gray-700">{shift}</span>
              </p>
            </header>

            {/* ROW 1: Port Weather + AI Recommendation */}
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

            {/* ROW 2: Vessel Schedule + Coal Volume */}
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

            {/* ROW 3: Loading Progress + Port Congestion Status */}
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
