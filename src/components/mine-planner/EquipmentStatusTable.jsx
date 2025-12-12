// src/components/mine-planner/EquipmentStatusTable.jsx
import React, { useEffect, useState } from "react";
import { getEquipmentStatusMine } from "../../services/minePlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";
import AnimatedNumber from "../animation/AnimatedNumber";
import KpiCardWrapper from "../animation/KpiCardWrapper";

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

  const summary = data?.summary || {};
  const summaryExcellent = summary.excellent ?? 0;
  const summaryGood = summary.good ?? 0;
  const summaryMaintenanceRequired = summary.maintenanceRequired ?? 0;
  const summarySlightlyDamaged = summary.slightlyDamaged ?? 0;
  const summarySeverelyDamaged = summary.severelyDamaged ?? 0;

  const equipments = Array.isArray(data?.equipments) ? data.equipments : [];
  const fleetOverview = Array.isArray(data?.fleet_overview)
    ? data.fleet_overview
    : [];

  return (
    <section
      data-layer="equipment_status_card"
      className="EquipmentStatusCard w-full h-full p-6 bg-white rounded-3xl flex flex-col justify-center items-center gap-2.5"
      aria-labelledby="equipment-status-title"
    >
      <div
        data-layer="equipment_status_container"
        className="EquipmentStatusContainer w-full flex flex-col justify-start items-start gap-[18px]"
      >
        <header
          data-layer="header_container"
          className="HeaderContainer w-full inline-flex justify-between items-center"
        >
          <div
            data-layer="header_left_group"
            className="HeaderLeftGroup flex justify-start items-center gap-3"
          >
            <div
              data-layer="icon_wrapper"
              className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
            >
              <img
                data-layer="icon_equipment_status"
                className="IconEquipmentStatus size-[18px]"
                src="/icons/icon_warning.png"
                alt="Equipment status icon"
              />
            </div>
            <h2
              id="equipment-status-title"
              data-layer="equipment_status_title"
              className="EquipmentStatusTitle text-black text-sm font-semibold"
            >
              Equipment Status
            </h2>
          </div>
        </header>

        <hr
          data-layer="divider_top"
          className="DividerTop self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
        />

        {/* SUMMARY STATUS PILLS */}
        <section
          aria-label="Equipment condition summary"
          data-layer="status_summary_section"
          className="StatusSummarySection self-stretch flex flex-col justify-start items-start gap-3"
        >
          <ul
            data-layer="status_summary_container"
            className="StatusSummaryContainer self-stretch inline-flex justify-center items-center gap-[18px] flex-wrap"
          >
            <li>
              <KpiCardWrapper className="ExcellentStatusCardContainer w-[110px] h-14 px-[13px] py-1 bg-[#4caf50] rounded-[10px] inline-flex flex-col justify-center items-center">
                <p className="text-white text-[10px] font-bold">Excellent</p>
                <AnimatedNumber
                  value={summaryExcellent}
                  decimals={0}
                  className="text-white text-2xl font-semibold"
                />
              </KpiCardWrapper>
            </li>

            <li>
              <KpiCardWrapper className="GoodStatusCardContainer w-[115px] h-14 px-[22px] py-1.5 bg-[#8fa90e] rounded-[10px] flex flex-col justify-center items-center">
                <p className="text-white text-[10px] font-bold">Good</p>
                <AnimatedNumber
                  value={summaryGood}
                  decimals={0}
                  className="text-white text-2xl font-semibold"
                />
              </KpiCardWrapper>
            </li>

            <li>
              <KpiCardWrapper className="MaintenanceStatusCardContainer w-48 h-14 p-[7px] bg-[#e6bb30] rounded-[10px] flex flex-col justify-center items-center">
                <p className="text-white text-[10px] font-bold">
                  Maintenance Required
                </p>
                <AnimatedNumber
                  value={summaryMaintenanceRequired}
                  decimals={0}
                  className="text-white text-2xl font-semibold"
                />
              </KpiCardWrapper>
            </li>

            <li>
              <KpiCardWrapper className="SlightlyDamagedStatusCardContainer w-[153px] h-14 px-1.5 py-[7px] bg-[#ff7b54] rounded-[10px] flex flex-col justify-center items-center">
                <p className="text-white text-[10px] font-bold">
                  Slightly Damaged
                </p>
                <AnimatedNumber
                  value={summarySlightlyDamaged}
                  decimals={0}
                  className="text-white text-2xl font-semibold"
                />
              </KpiCardWrapper>
            </li>

            <li>
              <KpiCardWrapper
                isAlert={summarySeverelyDamaged > 0}
                className="SeverelyDamagedStatusCardContainer w-[150px] h-14 px-1.5 py-[7px] bg-[#c30012] rounded-[10px] flex flex-col justify-center items-center"
              >
                <p className="text-white text-[10px] font-bold">
                  Severely Damaged
                </p>
                <AnimatedNumber
                  value={summarySeverelyDamaged}
                  decimals={0}
                  className="text-white text-2xl font-semibold"
                />
              </KpiCardWrapper>
            </li>
          </ul>
        </section>

        {/* TABLE SECTION */}
        <section
          aria-label="Equipment details table"
          data-layer="equipment_table_section"
          className="EquipmentTableSection w-full flex flex-col justify-start items-start gap-2.5"
        >
          {equipments.length === 0 ? (
            <p className="text-xs text-[#666666]">
              No equipment records available for the current filters.
            </p>
          ) : (
            <div className="EquipmentTableScrollArea w-full max-h-[260px] overflow-y-auto pr-2">
              <table className="EquipmentTableContainer w-full text-left text-sm min-w-max">
                <thead>
                  <tr className="text-[#666666]">
                    <th className="font-normal pr-4">Equipment_ID</th>
                    <th className="font-normal pr-4">Equipment_Type</th>
                    <th className="font-normal pr-4">Equipment_Model</th>
                    <th className="font-normal pr-4">Conditions</th>
                    <th className="font-normal pr-4">Operating Hours (hrs)</th>
                    <th className="font-normal pr-4">Maintenance (hrs)</th>
                  </tr>
                </thead>
                <tbody>
                  {equipments.map((eq, i) => (
                    <tr key={`${eq.id}-row-${i}`} className="align-top">
                      <td className="text-black font-semibold pr-4 pt-[17px]">
                        {eq.id}
                      </td>
                      <td className="text-black font-semibold pr-4 pt-[17px]">
                        {eq.type}
                      </td>
                      <td className="text-black font-semibold pr-4 pt-[17px]">
                        {eq.model}
                      </td>
                      <td className="text-black font-semibold pr-4 pt-[17px]">
                        {eq.condition}
                      </td>
                      <td className="text-black font-semibold pr-4 pt-[17px]">
                        {eq.operatingHours}
                      </td>
                      <td className="text-black font-semibold pr-4 pt-[17px]">
                        {eq.maintenanceHours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {equipments.length > 0 && (
            <p className="text-[11px] text-[#888888]">
              Showing {equipments.length} equipment records
            </p>
          )}
        </section>

        <hr
          data-layer="divider_bottom"
          className="DividerBottom self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
        />

        {/* FLEET OVERVIEW */}
        <section
          aria-label="Fleet overview"
          data-layer="fleet_overview_section"
          className="FleetOverviewSection self-stretch flex flex-col justify-start items-start gap-[20px]"
        >
          <h3 className="FleetOverviewTitle text-black text-sm font-semibold">
            Fleet Overview
          </h3>

          <ul className="FleetCardList inline-flex gap-[17px] flex-wrap">
            {fleetOverview.map((fleet, i) => (
              <li key={`${fleet.equipmentType}-${i}`}>
                <article className="w-[140px] h-[111px] px-[17px] py-[13px] bg-white rounded-[10px] outline outline-1 outline-[#c1ccdd] flex flex-col gap-[7px]">
                  <h4 className="text-black text-sm font-semibold">
                    {fleet.equipmentType}
                  </h4>
                  <p className="text-black text-xs">
                    <AnimatedNumber value={fleet.active ?? 0} decimals={0} />{" "}
                    active
                    <br />
                    <AnimatedNumber
                      value={fleet.maintenance ?? 0}
                      decimals={0}
                    />{" "}
                    maintenance
                    <br />
                    <AnimatedNumber value={fleet.idle ?? 0} decimals={0} /> idle
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

export default EquipmentStatusTable;
