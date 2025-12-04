import React from "react";
import { useGlobalFilter } from "../context/GlobalFilterContext";
import GlobalFilterBar from "../components/layout/GlobalFilterBar";
import NotificationSection from "../components/layout/NotificationSection";
import ProfileSection from "../components/layout/ProfileSection";
import PortWeatherConditions from "../components/shipping-planner/PortWeatherConditions";
import AIShippingRecommendationCard from "../components/shipping-planner/AIShippingRecommendationCard";
import VesselScheduleOverview from "../components/shipping-planner/VesselScheduleOverview";
import CoalVolumeCard from "../components/shipping-planner/CoalVolumeCard";
import LoadingProgressMonitoringCard from "../components/shipping-planner/LoadingProgressMonitoring";
import PortCongestionStatus from "../components/shipping-planner/PortCongestionStatus";

function ShippingPlannerPage() {
  const { location, timePeriod, shift } = useGlobalFilter();

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* TOP BAR */}
        <div className="flex justify-between items-start gap-4">
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

          <div className="flex items-center gap-4">
            <NotificationSection />
            <ProfileSection />
          </div>
        </div>

        {/* GLOBAL FILTER BAR + VIEW TOGGLE */}
        <div className="flex justify-between items-center gap-4">
          <GlobalFilterBar />

          <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
            <button
              type="button"
              className="px-4 py-2 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Mine Planner View
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1c2534] text-white"
            >
              Shipping Planner View
            </button>
          </div>
        </div>

        {/* ROW 1: Weather + AI Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className="lg:col-span-1">
            <PortWeatherConditions />
          </section>

          <section className="lg:col-span-2">
            <AIShippingRecommendationCard />
          </section>
        </div>

        {/* ROW 2: Vessel Schedule + Coal Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section>
            <VesselScheduleOverview />
          </section>

          <section>
            <CoalVolumeCard />
          </section>
        </div>

        {/* ROW 3: Loading Progress + Port Congestion Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section>
            <LoadingProgressMonitoring />
          </section>

          <section>
            <PortCongestionStatus />
          </section>
        </div>
      </div>
    </div>
  );
}

export default ShippingPlannerPage;
