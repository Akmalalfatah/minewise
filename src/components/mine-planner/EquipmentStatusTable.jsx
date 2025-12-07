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
    <section
      data-layer="equipment_status_card"
      aria-label="Equipment status and fleet overview"
      className="EquipmentStatusCard w-full min-h-[553px] p-6 bg-white rounded-3xl flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="equipment_status_container"
        className="EquipmentStatusContainer w-full flex flex-col justify-start items-start gap-[18px]"
      >
        <header
          data-layer="header_container"
          className="HeaderContainer w-full inline-flex justify-between items-center"
        >
          <div className="HeaderLeftGroup flex items-center gap-3">
            <div className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
              <img
                src="/icons/icon_equipment.png"
                className="size-[18px]"
                alt="Equipment status icon"
              />
            </div>
            <h2 className="text-black text-sm font-semibold">
              Equipment Status
            </h2>
          </div>
        </header>

        <hr className="DividerTop self-stretch h-0 outline outline-1 outline-[#d9d9d9]" />

        <section
          aria-label="Equipment condition summary"
          className="StatusSummarySection self-stretch flex flex-col gap-3"
        >
          <div className="StatusSummaryContainer self-stretch inline-flex gap-[18px] flex-wrap">
            <article
              aria-label="Excellent condition count"
              className="ExcellentStatusCardContainer w-[110px] h-14 px-[13px] py-1.5 bg-[#4caf50] rounded-[10px] flex flex-col items-center"
            >
              <h3 className="text-white text-[10px] font-bold">Excellent</h3>
              <p className="text-white text-2xl font-semibold">
                {summaryExcellent}
              </p>
            </article>

            <article
              aria-label="Good condition count"
              className="GoodStatusCardContainer w-[115px] h-14 px-[22px] py-1.5 bg-[#8fa90e] rounded-[10px] flex flex-col items-center"
            >
              <h3 className="text-white text-[10px] font-bold">Good</h3>
              <p className="text-white text-2xl font-semibold">
                {summaryGood}
              </p>
            </article>

            <article
              aria-label="Maintenance required count"
              className="MaintenanceStatusCardContainer w-48 h-14 bg-[#e6bb30] rounded-[10px] flex flex-col items-center justify-center"
            >
              <h3 className="text-white text-[10px] font-bold">
                Maintenance Required
              </h3>
              <p className="text-white text-2xl font-semibold">
                {summaryMaintenanceRequired}
              </p>
            </article>

            <article
              aria-label="Slightly damaged count"
              className="SlightlyDamagedStatusCardContainer w-[153px] h-14 bg-[#ff7b54] rounded-[10px] flex flex-col items-center justify-center"
            >
              <h3 className="text-white text-[10px] font-bold">
                Slightly Damaged
              </h3>
              <p className="text-white text-2xl font-semibold">
                {summarySlightlyDamaged}
              </p>
            </article>

            <article
              aria-label="Severely damaged count"
              className="SeverelyDamagedStatusCardContainer w-[161px] h-14 bg-[#c30012] rounded-[10px] flex flex-col items-center justify-center"
            >
              <h3 className="text-white text-[10px] font-bold">
                Severely Damaged
              </h3>
              <p className="text-white text-2xl font-semibold">
                {summarySeverelyDamaged}
              </p>
            </article>
          </div>
        </section>

        <section
          aria-label="Equipment details table"
          className="EquipmentTableSection flex flex-col gap-2.5"
        >
          <div className="EquipmentTableContainer w-full flex gap-[15px] overflow-x-auto">
            <div className="EquipmentIdColumn w-[92px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Equipment_ID</div>
              {equipments.map((eq, index) => (
                <div
                  key={`id-${eq.id ?? index}`}
                  className="text-black text-sm font-semibold"
                >
                  {eq.id ?? "-"}
                </div>
              ))}
            </div>

            <div className="EquipmentTypeColumn w-[116px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Equipment_Type</div>
              {equipments.map((eq, index) => (
                <div
                  key={`type-${eq.id ?? index}`}
                  className="text-black text-sm font-semibold"
                >
                  {eq.type ?? "-"}
                </div>
              ))}
            </div>

            <div className="EquipmentModelColumn w-[124px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Equipment_Model</div>
              {equipments.map((eq, index) => (
                <div
                  key={`model-${eq.id ?? index}`}
                  className="text-black text-sm font-semibold"
                >
                  {eq.model ?? "-"}
                </div>
              ))}
            </div>

            <div className="ConditionColumn w-[126px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Conditions</div>
              {equipments.map((eq, index) => (
                <div
                  key={`condition-${eq.id ?? index}`}
                  className="text-black text-sm font-semibold"
                >
                  {eq.condition ?? "-"
                  }
                </div>
              ))}
            </div>

            <div className="OperationHoursColumn w-[125px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">
                Operating Hours (hrs)
              </div>
              {equipments.map((eq, index) => (
                <div
                  key={`operating-${eq.id ?? index}`}
                  className="text-black text-sm font-semibold"
                >
                  {eq.operatingHours ?? "-"}
                </div>
              ))}
            </div>

            <div className="MaintenanceHoursColumn w-[138px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Maintenance (hrs)</div>
              {equipments.map((eq, index) => (
                <div
                  key={`maintenance-${eq.id ?? index}`}
                  className="text-black text-sm font-semibold"
                >
                  {eq.maintenanceHours ?? "-"}
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="DividerBottom self-stretch h-0 outline outline-1 outline-[#d9d9d9]" />

        <section
          aria-label="Fleet overview summary"
          className="FleetOverviewSection self-stretch flex flex-col gap-3"
        >
          <h3 className="FleetOverviewTitle text-black text-sm font-semibold">
            Fleet Overview
          </h3>

          <div className="FleetCardList flex gap-[17px] flex-wrap">
            {fleetOverview.map((fleet, index) => (
              <article
                key={fleet.id ?? index}
                className="FleetCardItem w-[146px] h-[111px] px-[17px] py-[13px] bg-white rounded-[10px] outline outline-1 outline-[#c1ccdd] flex flex-col gap-2.5"
              >
                <h4 className="text-black text-sm font-semibold">
                  {fleet.equipmentType ?? "Equipment"}
                </h4>
                <p className="text-black text-xs">
                  {(fleet.active ?? 0) + " active"}
                  <br />
                  {(fleet.maintenance ?? 0) + " maintenance"}
                  <br />
                  {(fleet.idle ?? 0) + " idle"}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default EquipmentStatusTable;
