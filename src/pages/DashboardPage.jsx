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
    <div className="min-h-screen bg-[#f5f5f7] px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* TOP BAR: Filter + Notification + Profile */}
        <div className="w-full flex justify-between items-center">
          <GlobalFilterBar />

          <div className="flex items-center gap-4">
            <NotificationSection />
            <ProfileSection />
          </div>
        </div>

        {/* TITLE + DESCRIPTION */}
        <header>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Ringkasan produksi, kondisi alat, cuaca, dan operasional tambang
            berdasarkan lokasi, periode waktu, dan shift yang dipilih.
          </p>
        </header>

        {/* ROW 1 — 5 summary cards (Total, Cuaca, Efisiensi, Status Alat, Kapal) */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <TotalProductionCard />
          <WeatherConditionCard />
          <EfficiencyProductionCard />
          <EquipmentStatusCard />
          <VesselStatusCard />
        </section>

        {/* ROW 2 — Production & Weather Overview (besar kiri) + Road Condition Overview (kanan) */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <ProductionWeatherOverviewCard />
          </div>
          <div className="xl:col-span-1">
            <RoadConditionOverviewCard />
          </div>
        </section>

        {/* ROW 3 — Causes of Downtime (besar kiri) + Decision Impact Analysis (kanan) */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <CausesOfDowntimeCard />
          </div>
          <div className="xl:col-span-1">
            <DecisionImpactAnalysisCard />
          </div>
        </section>

        {/* ROW 4 — AI Summary Information full width di bawah */}
        <section>
          <AISummaryInformationCard />
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
