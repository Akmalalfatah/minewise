import React, { useEffect, useState } from "react";
import { getEquipmentStatusMine } from "../../services/minePlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function EquipmentStatusTable() {
  const [data, setData] = useState(null);
  const { location, timePeriod, shift } = useFilterQuery();

  useEffect(() => {
    async function load() {
      try {
        const result = await getEquipmentStatusMine({
          location,
          timePeriod,
          shift,
        });
        setData(result);
      } catch (error) {
        console.error("Failed to load equipment status (mine planner):", error);
        setData(null);
      }
    }

    load();
  }, [location, timePeriod, shift]);

  if (!data) return null;

  const summary = data.summary || {};
  const summaryExcellent = summary.excellent ?? 0;
  const summaryGood = summary.good ?? 0;
  const summaryMaintenanceRequired = summary.maintenanceRequired ?? 0;
  const summarySlightlyDamaged = summary.slightlyDamaged ?? 0;
  const summarySeverelyDamaged = summary.severelyDamaged ?? 0;

  const equipments = Array.isArray(data.equipments) ? data.equipments : [];
  const fleetOverview = Array.isArray(data.fleet_overview)
    ? data.fleet_overview
    : [];

  return (
    <div data-layer="equipment_status_card" className="EquipmentStatusCard w-[851px] h-[553px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
      <div data-layer="equipment_status_container" className="EquipmentStatusContainer w-[803.01px] flex flex-col justify-start items-start gap-[18px]">

        <div data-layer="header_container" className="HeaderContainer w-[787px] h-8 inline-flex justify-between items-center">
          <div data-layer="header_left_group" className="HeaderLeftGroup w-[165px] flex justify-start items-center gap-3">
            <div data-layer="icon_wrapper" className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
              <img data-layer="icon_equipment_status" className="IconEquipmentStatus size-[18px]" src="/icons/icon_warning.png" />
            </div>
            <div data-layer="equipment_status_title" className="EquipmentStatusTitle justify-start text-black text-sm font-semibold">
              Equipment Status
            </div>
          </div>
        </div>

        <div data-layer="divider_top" className="DividerTop self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#d9d9d9]"></div>

        <div data-layer="status_summary_section" className="StatusSummarySection self-stretch flex flex-col justify-start items-start gap-3">
          <div data-layer="status_summary_container" className="StatusSummaryContainer self-stretch inline-flex justify-center items-center gap-[18px]">

            <div className="ExcellentStatusCardContainer w-[110px] h-14 px-[13px] py-1 bg-[#4caf50] rounded-[10px] inline-flex flex-col justify-center items-center">
              <div className="text-white text-[10px] font-bold">Excellent</div>
              <div className="text-white text-2xl font-semibold">{summaryExcellent}</div>
            </div>

            <div className="GoodStatusCardContainer w-[115px] h-14 px-[22px] py-1.5 bg-[#8fa90e] rounded-[10px] flex flex-col justify-center items-center">
              <div className="text-white text-[10px] font-bold">Good</div>
              <div className="text-white text-2xl font-semibold">{summaryGood}</div>
            </div>

            <div className="MaintenanceStatusCardContainer w-48 h-14 p-[7px] bg-[#e6bb30] rounded-[10px] flex flex-col justify-center items-center">
              <div className="text-white text-[10px] font-bold">Maintenance Required</div>
              <div className="text-white text-2xl font-semibold">{summaryMaintenanceRequired}</div>
            </div>

            <div className="SlightlyDamagedStatusCardContainer w-[153px] h-14 px-1.5 py-[7px] bg-[#ff7b54] rounded-[10px] flex flex-col justify-center items-center">
              <div className="text-white text-[10px] font-bold">Slightly Damaged</div>
              <div className="text-white text-2xl font-semibold">{summarySlightlyDamaged}</div>
            </div>

            <div className="SeverelyDamagedStatusCardContainer w-[161px] h-14 px-1.5 py-[7px] bg-[#c30012] rounded-[10px] flex flex-col justify-center items-center">
              <div className="text-white text-[10px] font-bold">Severely Damaged</div>
              <div className="text-white text-2xl font-semibold">{summarySeverelyDamaged}</div>
            </div>

          </div>
        </div>

        <div data-layer="equipment_table_section" className="EquipmentTableSection size- flex flex-col justify-start items-start gap-2.5">
          <div data-layer="equipment_table_container" className="EquipmentTableContainer w-[796px] inline-flex justify-start items-center gap-[15px]">

            <div className="EquipmentIdColumn w-[92px] inline-flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Equipment_ID</div>
              {equipments.map((eq, i) => <div key={i} className="text-black text-sm font-semibold">{eq.id}</div>)}
            </div>

            <div className="EquipmentTypeColumn w-[116px] inline-flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Equipment_Type</div>
              {equipments.map((eq, i) => <div key={i} className="text-black text-sm font-semibold">{eq.type}</div>)}
            </div>

            <div className="EquipmentModelColumn w-[124px] inline-flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Equipment_Model</div>
              {equipments.map((eq, i) => <div key={i} className="text-black text-sm font-semibold">{eq.model}</div>)}
            </div>

            <div className="ConditionColumn w-[126px] inline-flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Conditions</div>
              {equipments.map((eq, i) => <div key={i} className="text-black text-sm font-semibold">{eq.condition}</div>)}
            </div>

            <div className="OperationHoursColumn w-[125px] inline-flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Operating Hours (hrs)</div>
              {equipments.map((eq, i) => <div key={i} className="text-black text-sm font-semibold">{eq.operatingHours}</div>)}
            </div>

            <div className="MaintenanceHoursColumn w-[138px] inline-flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Maintenance (hrs)</div>
              {equipments.map((eq, i) => <div key={i} className="text-black text-sm font-semibold">{eq.maintenanceHours}</div>)}
            </div>

          </div>
        </div>

        <div data-layer="divider_bottom" className="DividerBottom w-[787.02px] h-0 outline outline-1 outline-offset-[-0.50px] outline-[#d9d9d9]"></div>

        <div data-layer="fleet_overview_section" className="FleetOverviewSection self-stretch h-[138px] flex flex-col justify-start items-start gap-[9px]">
          <div className="FleetOverviewTitle text-black text-sm font-semibold">Fleet Overview</div>

          <div className="FleetCardList inline-flex gap-[17px]">
            {fleetOverview.map((fleet, i) => (
              <div key={i} className="w-[146px] h-[111px] px-[17px] py-[13px] bg-white rounded-[10px] outline outline-1 outline-[#c1ccdd] flex flex-col gap-[7px]">
                <div className="text-black text-sm font-semibold">{fleet.equipmentType}</div>
                <div className="text-black text-xs">
                  {fleet.active} active<br />
                  {fleet.maintenance} maintenance<br />
                  {fleet.idle} idle
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );

}

export default EquipmentStatusTable;
