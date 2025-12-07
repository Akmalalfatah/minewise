import React, { useEffect } from "react";
import { useGlobalFilter } from "../context/GlobalFilterContext";
import GlobalFilterBar from "../components/layout/GlobalFilterBar";
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
import { getDashboard } from "../services/dashboardService";

function DashboardPage() {
  const { location, timePeriod, shift } = useGlobalFilter();
  const [dashboardData, setDashboardData] = React.useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getDashboard();
      setDashboardData(data);
    }
    fetchData();
  }, [location, timePeriod, shift]);

  return (
    <main className="min-h-screen bg-[#eff1f6] px-[40px] py-10">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">

        <header aria-label="Global filters">
          <GlobalFilterBar />
        </header>

        <section aria-label="Summary cards" className="flex gap-6">
          <TotalProductionCard data={dashboardData?.total_production} />
          <WeatherConditionCard data={dashboardData?.weather_condition} />
          <EfficiencyProductionCard data={dashboardData?.production_efficiency} />
          <EquipmentStatusCard data={dashboardData?.equipment_status} />
          <VesselStatusCard data={dashboardData?.vessel_status} />
        </section>

        <section aria-label="Production, downtime, and road condition" className="flex gap-6">
          <div className="flex flex-col gap-6">
            <ProductionWeatherOverviewCard data={dashboardData?.production_weather_overview} />
            <CausesOfDowntimeCard data={dashboardData?.causes_of_downtime} />
          </div>

          <div className="w-[530px]">
            <RoadConditionOverviewCard data={dashboardData?.road_condition_overview} />
          </div>
        </section>

        <section aria-label="Decision impact and AI summary" className="flex gap-6">
          <div className="flex-1">
            <DecisionImpactAnalysisCard data={dashboardData?.decision_impact} />
          </div>

          <div className="w-[604px]">
            <AISummaryInformationCard data={dashboardData?.ai_summary} />
          </div>
        </section>

      </div>
    </main>
  );
}

export default DashboardPage;
