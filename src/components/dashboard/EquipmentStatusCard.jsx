import React, { useEffect, useState } from "react";
import { getEquipmentStatus } from "../../services/dashboardService";

function EquipmentStatusCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getEquipmentStatus();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  return (
    <section
      data-layer="equipment_status_card"
      aria-label="Equipment status summary"
      className="EquipmentStatusCard w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="header_container"
        className="HeaderContainer w-[205px] h-[204px] flex flex-col justify-center items-start gap-3"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup size- rounded-3xl inline-flex justify-center items-center gap-3"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper size-8 px-[7px] py-2 bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
          >
            <img
              data-layer="icon_tools"
              className="IconTools size-[18px]"
              src="/icons/icon_tools.png"
              alt="Equipment tools icon"
            />
          </div>

          <h2
            data-layer="equipment_status_title"
            className="EquipmentStatusTitle text-black text-sm font-semibold"
          >
            Status Alat
          </h2>
        </header>

        {/* Content */}
        <section
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-[11px]"
        >
          {/* Rows */}
          <div
            data-layer="info_rows"
            className="InfoRows self-stretch inline-flex justify-between items-center"
          >
            {/* Labels */}
            <div
              data-layer="label_container"
              className="LabelContainer w-[133px] inline-flex flex-col justify-start items-start gap-4"
            >
              <span
                data-layer="equipment_active_title"
                className="EquipmentActiveTitle text-black text-sm font-normal"
              >
                Active Operating
              </span>
              <span
                data-layer="equipment_standby_title"
                className="EquipmentStandbyTitle text-black text-sm font-normal"
              >
                Standby
              </span>
              <span
                data-layer="equipment_under_repair_title"
                className="EquipmentUnderRepairTitle text-black text-sm font-normal"
              >
                Under Repair
              </span>
              <span
                data-layer="equipment-maintanance_title"
                className="EquipmentMaintananceTitle text-black text-sm font-normal"
              >
                Maintanance
              </span>
            </div>

            {/* Values */}
            <div
              data-layer="value_container"
              className="ValueContainer w-[9px] inline-flex flex-col justify-start items-end gap-4"
            >
              <p
                data-layer="equipment_active"
                className="EquipmentActive text-black text-sm font-semibold text-right"
              >
                {data.equipmentActive}
              </p>
              <p
                data-layer="equipment_standby"
                className="EquipmentStandby text-black text-sm font-semibold text-right"
              >
                {data.equipmentStandby}
              </p>
              <p
                data-layer="equipment_under_repair"
                className="EquipmentUnderRepair text-black text-sm font-semibold text-right"
              >
                {data.equipmentUnderRepair}
              </p>
              <p
                data-layer="equipment-maintanance"
                className="EquipmentMaintanance text-black text-sm font-semibold text-right"
              >
                {data.equipmentMaintanance}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            data-layer="divider"
            className="Divider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
          />

          {/* Footer */}
          <footer
            data-layer="footer_container"
            className="FooterContainer self-stretch inline-flex justify-between items-center"
          >
            <span
              data-layer="source_location_title"
              className="SourceLocationTitle text-black/60 text-sm font-normal"
            >
              Lokasi Source
            </span>
            <span
              data-layer="source_location"
              className="SourceLocation text-black/60 text-sm font-semibold text-right"
            >
              {data.sourceLocation}
            </span>
          </footer>
        </section>
      </div>
    </section>
  );
}

export default EquipmentStatusCard;
