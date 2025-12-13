import React, { useEffect, useMemo, useState } from "react";
import { getEquipmentStatusMine } from "../../services/minePlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";
import AnimatedNumber from "../animation/AnimatedNumber";
import KpiCardWrapper from "../animation/KpiCardWrapper";

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
};

function EquipmentStatusTable() {
  const [data, setData] = useState(null);
  const { location, timePeriod, shift } = useFilterQuery();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await getEquipmentStatusMine({
          location,
          timePeriod,
          shift,
        });
        if (!mounted) return;
        setData(result);
      } catch (error) {
        console.error("Failed to load equipment status (mine planner):", error);
        if (!mounted) return;
        setData(null);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [location, timePeriod, shift]);

  const summary = data?.summary || data?.summary_status || {};

  const summaryExcellent = pick(summary, ["excellent"], 0);
  const summaryGood = pick(summary, ["good"], 0);
  const summaryMaintenanceRequired = pick(
    summary,
    ["maintenanceRequired", "maintenance_required"],
    0
  );
  const summarySlightlyDamaged = pick(
    summary,
    ["slightlyDamaged", "slightly_damaged"],
    0
  );
  const summarySeverelyDamaged = pick(
    summary,
    ["severelyDamaged", "severely_damaged"],
    0
  );

  const equipments = useMemo(() => {
    const raw = data?.equipments || data?.equipment || data?.items || [];
    if (!Array.isArray(raw)) return [];
    return raw.map((eq, i) => ({
      id: pick(eq, ["id", "equipment_id", "equipmentId", "Equipment_ID"], `EQ_${i + 1}`),
      type: pick(eq, ["type", "equipment_type", "equipmentType", "Equipment_Type"], "-"),
      model: pick(eq, ["model", "equipment_model", "equipmentModel", "Equipment_Model"], "-"),
      condition: pick(eq, ["condition", "conditions", "status", "Conditions"], "-"),
      operatingHours: pick(eq, ["operatingHours", "operating_hours", "OperatingHours", "operating_hours_hrs"], "-"),
      maintenanceHours: pick(eq, ["maintenanceHours", "maintenance_hours", "MaintenanceHours"], "-"),
    }));
  }, [data]);

  const fleetOverview = useMemo(() => {
    const raw = data?.fleet_overview || data?.fleetOverview || [];
    if (!Array.isArray(raw)) return [];
    return raw.map((f, i) => ({
      equipmentType: pick(f, ["equipmentType", "equipment_type", "type"], `Type ${i + 1}`),
      active: Number(pick(f, ["active"], 0)),
      maintenance: Number(pick(f, ["maintenance", "in_maintenance"], 0)),
      idle: Number(pick(f, ["idle"], 0)),
    }));
  }, [data]);

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

        <hr className="self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]" />

        {/* SUMMARY */}
        <section className="self-stretch flex flex-col justify-start items-start gap-3">
          <ul className="self-stretch inline-flex justify-center items-center gap-[18px] flex-wrap">
            <li>
              <KpiCardWrapper className="w-[133px] h-14 px-[13px] py-1 bg-[#4caf50] rounded-[10px] inline-flex flex-col justify-center items-center">
                <p className="text-white text-[10px] font-bold">Excellent</p>
                <AnimatedNumber value={summaryExcellent} decimals={0} className="text-white text-2xl font-semibold" />
              </KpiCardWrapper>
            </li>

            <li>
              <KpiCardWrapper className="w-[115px] h-14 px-[22px] py-1.5 bg-[#8fa90e] rounded-[10px] flex flex-col justify-center items-center">
                <p className="text-white text-[10px] font-bold">Good</p>
                <AnimatedNumber value={summaryGood} decimals={0} className="text-white text-2xl font-semibold" />
              </KpiCardWrapper>
            </li>

            <li>
              <KpiCardWrapper className="w-48 h-14 p-[7px] bg-[#e6bb30] rounded-[10px] flex flex-col justify-center items-center">
                <p className="text-white text-[10px] font-bold">Maintenance Required</p>
                <AnimatedNumber value={summaryMaintenanceRequired} decimals={0} className="text-white text-2xl font-semibold" />
              </KpiCardWrapper>
            </li>

            <li>
              <KpiCardWrapper className="w-[153px] h-14 px-1.5 py-[7px] bg-[#ff7b54] rounded-[10px] flex flex-col justify-center items-center">
                <p className="text-white text-[10px] font-bold">Slightly Damaged</p>
                <AnimatedNumber value={summarySlightlyDamaged} decimals={0} className="text-white text-2xl font-semibold" />
              </KpiCardWrapper>
            </li>

            <li>
              <KpiCardWrapper
                isAlert={summarySeverelyDamaged > 0}
                className="w-[120px] h-14 px-1.5 py-[7px] bg-[#c30012] rounded-[10px] flex flex-col justify-center items-center"
              >
                <p className="text-white text-[10px] font-bold">Severely Damaged</p>
                <AnimatedNumber value={summarySeverelyDamaged} decimals={0} className="text-white text-2xl font-semibold" />
              </KpiCardWrapper>
            </li>
          </ul>
        </section>

        {/* TABLE (✅ scroll vertikal, tampil semua alat) */}
        <section className="w-full flex flex-col justify-start items-start gap-2.5">
          {equipments.length === 0 ? (
            <p className="text-xs text-[#666666]">
              No equipment records available for the current filters.
            </p>
          ) : (
            <div className="w-full max-h-[260px] overflow-y-auto pr-2">
              <table className="w-full text-left text-sm min-w-max">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-[#666666]">
                    <th className="font-normal pr-4 py-2">Equipment_ID</th>
                    <th className="font-normal pr-4 py-2">Equipment_Type</th>
                    <th className="font-normal pr-4 py-2">Equipment_Model</th>
                    <th className="font-normal pr-4 py-2">Conditions</th>
                    <th className="font-normal pr-4 py-2">Operating Hours (hrs)</th>
                    <th className="font-normal pr-4 py-2">Maintenance (hrs)</th>
                  </tr>
                </thead>
                <tbody>
                  {equipments.map((eq, i) => (
                    <tr key={`${eq.id}-row-${i}`} className="align-top">
                      <td className="text-black font-semibold pr-4 pt-[17px]">{eq.id}</td>
                      <td className="text-black font-semibold pr-4 pt-[17px]">{eq.type}</td>
                      <td className="text-black font-semibold pr-4 pt-[17px]">{eq.model}</td>
                      <td className="text-black font-semibold pr-4 pt-[17px]">{eq.condition}</td>
                      <td className="text-black font-semibold pr-4 pt-[17px]">{eq.operatingHours}</td>
                      <td className="text-black font-semibold pr-4 pt-[17px]">{eq.maintenanceHours}</td>
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

        <hr className="self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]" />

        {/* FLEET OVERVIEW */}
        <section className="self-stretch flex flex-col justify-start items-start gap-[20px]">
          <h3 className="text-black text-sm font-semibold">Fleet Overview</h3>

          <ul className="inline-flex gap-[17px] flex-wrap">
            {fleetOverview.map((fleet, i) => (
              <li key={`${fleet.equipmentType}-${i}`}>
                <article className="w-[140px] h-[111px] px-[17px] py-[13px] bg-white rounded-[10px] outline outline-1 outline-[#c1ccdd] flex flex-col gap-[7px]">
                  <h4 className="text-black text-sm font-semibold">{fleet.equipmentType}</h4>
                  <p className="text-black text-xs">
                    <AnimatedNumber value={fleet.active ?? 0} decimals={0} /> active
                    <br />
                    <AnimatedNumber value={fleet.maintenance ?? 0} decimals={0} /> maintenance
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
