import React, { useEffect, useState } from "react";
import { getEquipmentStatusTable } from "../../services/minePlannerService";

function EquipmentStatusTable() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getEquipmentStatusTable();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  return (
    <div
      data-layer="equipment_status_card"
      className="EquipmentStatusCard w-[851px] h-[553px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="equipment_status_container"
        className="EquipmentStatusContainer w-[803.01px] flex flex-col justify-start items-start gap-[18px]"
      >

        {/* HEADER */}
        <div
          data-layer="header_container"
          className="HeaderContainer w-[787px] h-8 inline-flex justify-between items-center"
        >
          <div className="HeaderLeftGroup w-[165px] flex items-center gap-3">
            <div className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
              <img src="/icons/icon_equipment.png" className="size-[18px]" />
            </div>
            <div className="text-black text-sm font-semibold">Equipment Status</div>
          </div>
        </div>

        <div className="DividerTop self-stretch h-0 outline outline-1 outline-[#d9d9d9]" />

        {/* Summary Section */}
        <div className="StatusSummarySection self-stretch flex flex-col gap-3">
          <div className="StatusSummaryContainer self-stretch inline-flex gap-[18px]">

            {/* Excellent */}
            <div className="ExcellentStatusCardContainer w-[110px] h-14 px-[13px] py-1.5 bg-[#4caf50] rounded-[10px] flex flex-col items-center">
              <div className="text-white text-[10px] font-bold">Excellent</div>
              <div className="text-white text-2xl font-semibold">
                {data.summary.excellent}
              </div>
            </div>

            {/* Good */}
            <div className="GoodStatusCardContainer w-[115px] h-14 px-[22px] py-1.5 bg-[#8fa90e] rounded-[10px] flex flex-col items-center">
              <div className="text-white text-[10px] font-bold">Good</div>
              <div className="text-white text-2xl font-semibold">
                {data.summary.good}
              </div>
            </div>

            {/* Maintenance */}
            <div className="MaintenanceStatusCardContainer w-48 h-14 bg-[#e6bb30] rounded-[10px] flex flex-col items-center">
              <div className="text-white text-[10px] font-bold">Maintenance Required</div>
              <div className="text-white text-2xl font-semibold">
                {data.summary.maintenanceRequired}
              </div>
            </div>

            {/* Slightly Damaged */}
            <div className="SlightlyDamagedStatusCardContainer w-[153px] h-14 bg-[#ff7b54] rounded-[10px] flex flex-col items-center">
              <div className="text-white text-[10px] font-bold">Slightly Damaged</div>
              <div className="text-white text-2xl font-semibold">
                {data.summary.slightlyDamaged}
              </div>
            </div>

            {/* Severely Damaged */}
            <div className="SeverelyDamagedStatusCardContainer w-[161px] h-14 bg-[#c30012] rounded-[10px] flex flex-col items-center">
              <div className="text-white text-[10px] font-bold">Severely Damaged</div>
              <div className="text-white text-2xl font-semibold">
                {data.summary.severelyDamaged}
              </div>
            </div>

          </div>
        </div>

        {/* TABLE */}
        <div className="EquipmentTableSection flex flex-col gap-2.5">
          <div className="EquipmentTableContainer w-[796px] flex gap-[15px]">

            {/* Equipment ID */}
            <div className="EquipmentIdColumn w-[92px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Equipment_ID</div>
              {data.equipments.map((eq) => (
                <div key={eq.id} className="text-black text-sm font-semibold">{eq.id}</div>
              ))}
            </div>

            {/* Type */}
            <div className="EquipmentTypeColumn w-[116px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Equipment_Type</div>
              {data.equipments.map((eq) => (
                <div key={eq.id} className="text-black text-sm font-semibold">{eq.type}</div>
              ))}
            </div>

            {/* Model */}
            <div className="EquipmentModelColumn w-[124px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Equipment_Model</div>
              {data.equipments.map((eq) => (
                <div key={eq.id} className="text-black text-sm font-semibold">{eq.model}</div>
              ))}
            </div>

            {/* Condition */}
            <div className="ConditionColumn w-[126px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Conditions</div>
              {data.equipments.map((eq) => (
                <div key={eq.id} className="text-black text-sm font-semibold">{eq.condition}</div>
              ))}
            </div>

            {/* Operating Hours */}
            <div className="OperationHoursColumn w-[125px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Operating Hours (hrs)</div>
              {data.equipments.map((eq) => (
                <div key={eq.id} className="text-black text-sm font-semibold">{eq.operatingHours}</div>
              ))}
            </div>

            {/* Maintenance Hours */}
            <div className="MaintenanceHoursColumn w-[138px] flex flex-col gap-[17px]">
              <div className="text-[#666666] text-sm">Maintenance (hrs)</div>
              {data.equipments.map((eq) => (
                <div key={eq.id} className="text-black text-sm font-semibold">
                  {eq.maintenanceHours}
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="DividerBottom w-[787px] h-0 outline outline-1 outline-[#d9d9d9]" />

        {/* Fleet Overview */}
        <div className="FleetOverviewSection self-stretch flex flex-col gap-3">
          <div className="FleetOverviewTitle text-black text-sm font-semibold">
            Fleet Overview
          </div>

          <div className="FleetCardList flex gap-[17px]">
            {data.fleet_overview.map((fleet) => (
              <div
                key={fleet.id}
                className="FleetCardItem w-[146px] h-[111px] px-[17px] py-[13px] bg-white rounded-[10px] outline outline-1 outline-[#c1ccdd] flex flex-col gap-2.5"
              >
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
