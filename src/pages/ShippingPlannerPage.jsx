import React from "react";
import { useGlobalFilter } from "../context/GlobalFilterContext";
import GlobalFilterBar from "../components/layout/GlobalFilterBar";
import PortWeatherConditions from "../components/shipping-planner/PortWeatherConditions";
import AIShippingRecommendationCard from "../components/shipping-planner/AIShippingRecommendationCard";
import VesselScheduleOverview from "../components/shipping-planner/VesselScheduleOverview";
import CoalVolumeCard from "../components/shipping-planner/CoalVolumeCard";
import LoadingProgressMonitoring from "../components/shipping-planner/LoadingProgressMonitoring";
import PortCongestionStatus from "../components/shipping-planner/PortCongestionStatus";

function ShippingPlannerPage() {
  const { location, timePeriod, shift } = useGlobalFilter();

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* HEADER */}
        <header
          aria-label="Shipping planner introduction and current filters"
          className="flex justify-between items-start gap-4"
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              Shipping Planner View
            </h1>
            <p className="text-sm text-gray-600">
              Monitor kondisi cuaca pelabuhan, jadwal kapal, volume batubara
              siap dikirim, progres loading, serta tingkat kemacetan port.
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Current filter:&nbsp;
              <span className="font-medium text-gray-700">
                {location}
              </span>{" "}
              ·{" "}
              <span className="font-medium text-gray-700">
                {timePeriod}
              </span>{" "}
              ·{" "}
              <span className="font-medium text-gray-700">
                {shift}
              </span>
            </p>
          </div>
        </header>

        {/* GLOBAL FILTER BAR + VIEW TOGGLE */}
        <section
          aria-label="Global filters and view toggle"
          className="flex justify-between items-center gap-4"
        >
          <GlobalFilterBar />

          <nav
            aria-label="Planner view switcher"
            className="inline-flex bg-white rounded-full p-1 shadow-sm"
          >
            <button
              type="button"
              className="px-4 py-2 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Mine Planner View
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1c2534] text-white"
              aria-current="page"
            >
              Shipping Planner View
            </button>
          </nav>
        </section>

        {/* ROW 1: Weather + AI Recommendation */}
        <section
          aria-label="Port weather and AI shipping recommendations"
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          <div className="lg:col-span-1">
            <PortWeatherConditions />
          </div>

          <div className="lg:col-span-2">
            <AIShippingRecommendationCard />
          </div>
        </section>

        {/* ROW 2: Vessel Schedule + Coal Volume */}
        <section
          aria-label="Vessel schedule and coal volume ready to ship"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <div>
            <VesselScheduleOverview />
          </div>

          <div>
            <CoalVolumeCard />
          </div>
        </section>

        {/* ROW 3: Loading Progress + Port Congestion Status */}
        <section
          aria-label="Loading progress monitoring and port congestion status"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <div>
            <LoadingProgressMonitoring />
          </div>

          <div>
            <PortCongestionStatus />
          </div>
        </section>
      </div>
    </main>
  );
}

export default ShippingPlannerPage;
