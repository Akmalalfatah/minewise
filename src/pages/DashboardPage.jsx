import React, { useEffect } from "react";
import { useGlobalFilter } from "../context/GlobalFilterContext";
import GlobalFilterBar from "../components/layout/GlobalFilterBar";
import NotificationSection from "../components/layout/NotificationSection";
import ProfileSection from "../components/layout/ProfileSection";
import AISummaryInformationCard from "../components/dashboard/AISummaryInformationCard";
import CausesOfDowntimeCard from "../components/dashboard/CausesOfDowntimeCard";
import DecisionImpactAnalysisCard from "../components/dashboard/DecisionImpactAnalysisCard";
import EfficiencyProductionCard from "../components/dashboard/EfficiencyProductionCard";
import EquipmentStatusCard from "../components/dashboard/EquipmentStatusCard";
import ProductionWeatherOverviewCard from "../components/dashboard/ProductionWeatherOverviewCard";
import RoadConditionOverviewCard from "../components/dashboard/RoadConditionOverviewCard";
import TotalProductionCard from "../components/dashboard/TotalProductionCard";
import VesselStatusCard from "../components/dashboard/VesselStatusCard";
import WeatherConditionCard from "../components/dashboard/WeatherConditionCard";

function DashboardPage() {
  const { location, timePeriod, shift } = useGlobalFilter();

  useEffect(() => {
    console.log("Dashboard filters changed:", { location, timePeriod, shift });
  }, [location, timePeriod, shift]);

  return (
    <main className="min-h-screen bg-[#f5f5f7] flex justify-center">
      {/* Wrapper sesuai Figma width 1440px */}
      <div className="w-full max-w-[1440px] px-10 py-8 flex flex-col gap-10">

        {/* TOP BAR */}
        <header className="w-full flex justify-between items-center">
          <GlobalFilterBar />

          <div className="flex items-center gap-4">
            <NotificationSection />
            <ProfileSection />
          </div>
        </header>

        {/* DASHBOARD TITLE */}
        <section aria-label="Dashboard introduction">
          <h1 className="text-[28px] font-semibold text-[#1a1a1a]">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1 max-w-[600px]">
            Ringkasan produksi, kondisi alat, cuaca, dan operasional tambang berdasarkan lokasi,
            periode waktu, dan shift yang dipilih.
          </p>
        </section>

        {/* SUMMARY CARDS (ROW 1) */}
        <section
          aria-label="Summary cards"
          className="grid grid-cols-5 gap-5"
        >
          <TotalProductionCard />
          <WeatherConditionCard />
          <EfficiencyProductionCard />
          <EquipmentStatusCard />
          <VesselStatusCard />
        </section>

        {/* ROW 2: CHART + ROAD */}
        <section
          aria-label="Production and road condition overview"
          className="grid grid-cols-3 gap-5"
        >
          <div className="col-span-2">
            <ProductionWeatherOverviewCard />
          </div>

          <div className="col-span-1">
            <RoadConditionOverviewCard />
          </div>
        </section>

        {/* ROW 3: DOWNTIME + DECISION */}
        <section
          aria-label="Downtime and decision analysis"
          className="grid grid-cols-3 gap-5"
        >
          <div className="col-span-2">
            <CausesOfDowntimeCard />
          </div>

          <div className="col-span-1">
            <DecisionImpactAnalysisCard />
          </div>
        </section>

        {/* ROW 4: AI SUMMARY */}
        <section aria-label="AI Summary Information" className="w-full">
          <AISummaryInformationCard />
        </section>

      </div>
    </main>
  );
}

export default DashboardPage;
