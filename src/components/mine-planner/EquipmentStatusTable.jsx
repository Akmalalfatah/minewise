function EquipmentStatusTable({ summary, equipments, fleetOverview }) {
  return (
    <div
      data-layer="equipment_status_card"
      className="EquipmentStatusCard w-[851px] h-[553px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="equipment_status_container"
        className="EquipmentStatusContainer w-[803.01px] flex flex-col justify-start items-start gap-[18px]"
      >
        {/* Header */}
        <div
          data-layer="header_container"
          className="HeaderContainer w-[787px] h-8 inline-flex justify-between items-center"
        >
          <div
            data-layer="header_left_group"
            className="HeaderLeftGroup w-[165px] flex justify-start items-center gap-3"
          >
            <div
              data-layer="icon_wrapper"
              className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
            >
              <img
                data-layer="icon_equipment_status"
                className="IconEquipmentStatus size-[18px]"
                src="/icons/icon_equipment.png"
                alt="Equipment status icon"
              />
            </div>
            <div
              data-layer="equipment_status_title"
              className="EquipmentStatusTitle text-black text-sm font-semibold"
            >
              Equipment Status
            </div>
          </div>
        </div>

        <div
          data-layer="divider_top"
          className="DividerTop self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#d9d9d9]"
        />

        {/* Status summary cards */}
        <div
          data-layer="status_summary_section"
          className="StatusSummarySection self-stretch flex flex-col justify-start items-start gap-3"
        >
          <div
            data-layer="status_summary_container"
            className="StatusSummaryContainer self-stretch inline-flex justify-center items-center gap-[18px]"
          >
            {/* Excellent */}
            <div
              data-layer="excellent_status_card_container"
              className="ExcellentStatusCardContainer w-[110px] h-14 px-[13px] py-1.5 bg-[#4caf50] rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5"
            >
              <div
                data-layer="excellent_status_card_block"
                className="ExcellentStatusCardBlock w-[46px] flex flex-col justify-start items-center gap-0.5"
              >
                <div
                  data-layer="excellent_status_label"
                  className="ExcellentStatusLabel self-stretch text-white text-[10px] font-bold"
                >
                  Excellent
                </div>
                <div
                  data-layer="excellent_status_value"
                  className="ExcellentStatusValue self-stretch text-center text-white text-2xl font-semibold"
                >
                  {summary?.excellent}
                </div>
              </div>
            </div>

            {/* Good */}
            <div
              data-layer="good_status_card_container"
              className="GoodStatusCardContainer w-[115px] h-14 px-[22px] py-1.5 bg-[#8fa90e] rounded-[10px] flex justify-center items-center gap-2.5"
            >
              <div
                data-layer="good_status_card_block"
                className="GoodStatusCardBlock w-[30px] inline-flex flex-col justify-start items-center gap-0.5"
              >
                <div
                  data-layer="good_status_label"
                  className="GoodStatusLabel self-stretch text-white text-[10px] font-bold"
                >
                  Good
                </div>
                <div
                  data-layer="good_status_value"
                  className="GoodStatusValue self-stretch text-white text-2xl font-semibold"
                >
                  {summary?.good}
                </div>
              </div>
            </div>

            {/* Maintenance required */}
            <div
              data-layer="maintenance_status_card_container"
              className="MaintenanceStatusCardContainer w-48 h-14 p-[7px] bg-[#e6bb30] rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5"
            >
              <div
                data-layer="maintenance_status_card_block"
                className="MaintenanceStatusCardBlock w-[110px] flex flex-col justify-start items-center gap-px"
              >
                <div
                  data-layer="maintenance_required_label"
                  className="MaintenanceRequiredLabel self-stretch text-white text-[10px] font-bold"
                >
                  Maintenance Required
                </div>
                <div
                  data-layer="maintenance_required_value"
                  className="MaintenanceRequiredValue self-stretch text-center text-white text-2xl font-semibold"
                >
                  {summary?.maintenanceRequired}
                </div>
              </div>
            </div>

            {/* Slightly damaged */}
            <div
              data-layer="slightly_damaged_status_card_container"
              className="SlightlyDamagedStatusCardContainer w-[153px] h-14 px-1.5 py-[7px] bg-[#ff7b54] rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5"
            >
              <div
                data-layer="slightly_damaged_status_card_block"
                className="SlightlyDamagedStatusCardBlock w-[87px] flex flex-col justify-start items-center gap-px"
              >
                <div
                  data-layer="slightly_damaged_label"
                  className="SlightlyDamagedLabel self-stretch text-white text-[10px] font-bold"
                >
                  Slightly Damaged
                </div>
                <div
                  data-layer="slightly_damaged_value"
                  className="SlightlyDamagedValue self-stretch text-center text-white text-2xl font-semibold"
                >
                  {summary?.slightlyDamaged}
                </div>
              </div>
            </div>

            {/* Severely damaged */}
            <div
              data-layer="severely_damaged_status_card_container"
              className="SeverelyDamagedStatusCardContainer w-[161px] h-14 px-1.5 py-[7px] bg-[#c30012] rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5"
            >
              <div
                data-layer="severely_damaged_status_card_block"
                className="SeverelyDamagedStatusCardBlock w-[92px] flex flex-col justify-start items-center gap-px"
              >
                <div
                  data-layer="severely_damaged_label"
                  className="SeverelyDamagedLabel self-stretch text-white text-[10px] font-bold"
                >
                  Severely Damaged
                </div>
                <div
                  data-layer="severely_damaged_value"
                  className="SeverelyDamagedValue self-stretch text-center text-white text-2xl font-semibold"
                >
                  {summary?.severelyDamaged}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment table */}
        <div
          data-layer="equipment_table_section"
          className="EquipmentTableSection size- flex flex-col justify-start items-start gap-2.5"
        >
          <div
            data-layer="equipment_table_container"
            className="EquipmentTableContainer w-[796px] inline-flex justify-start items-center gap-[15px]"
          >
            {/* Equipment_ID column */}
            <div
              data-layer="equipment_id_column"
              className="EquipmentIdColumn w-[92px] h-[188px] inline-flex flex-col justify-start items-start gap-[17px]"
            >
              <div
                data-layer="equipment_id_header"
                className="EquipmentIdHeader text-center text-[#666666] text-sm"
              >
                Equipment_ID
              </div>
              {equipments?.map((eq) => (
                <div
                  key={eq.id}
                  data-layer="equipment_id_row"
                  className="EquipmentIdRow text-center text-black text-sm font-semibold"
                >
                  {eq.id}
                </div>
              ))}
            </div>

            {/* Equipment_Type column */}
            <div
              data-layer="equipment_type_column"
              className="EquipmentTypeColumn w-[116px] inline-flex flex-col justify-start items-start gap-[17px]"
            >
              <div
                data-layer="equipment_type_header"
                className="EquipmentTypeHeader self-stretch text-[#666666] text-sm"
              >
                Equipment_Type
              </div>
              {equipments?.map((eq) => (
                <div
                  key={eq.id}
                  data-layer="equipment_type_row"
                  className="EquipmentTypeRow self-stretch text-center text-black text-sm font-semibold"
                >
                  {eq.type}
                </div>
              ))}
            </div>

            {/* Equipment_Model column */}
            <div
              data-layer="equipment_model_column"
              className="EquipmentModelColumn w-[124px] inline-flex flex-col justify-start items-start gap-[17px]"
            >
              <div
                data-layer="equipment_model_header"
                className="EquipmentModelHeader self-stretch text-center text-[#666666] text-sm"
              >
                Equipment_Model
              </div>
              {equipments?.map((eq) => (
                <div
                  key={eq.id}
                  data-layer="equipment_model_row"
                  className="EquipmentModelRow self-stretch text-center text-black text-sm font-semibold"
                >
                  {eq.model}
                </div>
              ))}
            </div>

            {/* Condition column */}
            <div
              data-layer="condition_column"
              className="ConditionColumn w-[126px] inline-flex flex-col justify-start items-start gap-[17px]"
            >
              <div
                data-layer="condition_header"
                className="ConditionHeader self-stretch text-center text-[#666666] text-sm"
              >
                Conditions
              </div>
              {equipments?.map((eq) => (
                <div
                  key={eq.id}
                  data-layer="condition_row"
                  className="ConditionRow self-stretch text-center text-black text-sm font-semibold"
                >
                  {eq.condition}
                </div>
              ))}
            </div>

            {/* Operating hours column */}
            <div
              data-layer="operation_hours_column"
              className="OperationHoursColumn w-[125px] inline-flex flex-col justify-start items-start gap-3.5"
            >
              <div
                data-layer="operating_hours_header"
                className="OperatingHoursHeader self-stretch text-center text-[#666666] text-sm"
              >
                Operating Hours (hrs)
              </div>
              {equipments?.map((eq) => (
                <div
                  key={eq.id}
                  data-layer="operating_hours_row"
                  className="OperatingHoursRow self-stretch text-center text-black text-sm font-semibold"
                >
                  {eq.operatingHours}
                </div>
              ))}
            </div>

            {/* Maintenance hours column */}
            <div
              data-layer="maintenance_hours_column"
              className="MaintenanceHoursColumn w-[138px] h-[189px] inline-flex flex-col justify-start items-start gap-[17px]"
            >
              <div
                data-layer="maintenance_hours_header"
                className="MaintenanceHoursHeader self-stretch text-center text-[#666666] text-sm"
              >
                Maintenance (hrs)
              </div>
              {equipments?.map((eq) => (
                <div
                  key={eq.id}
                  data-layer="maintenance_hours_row"
                  className="MaintenanceHoursRow self-stretch text-center text-black text-sm font-semibold"
                >
                  {eq.maintenanceHours}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          data-layer="divider_bottom"
          className="DividerBottom w-[787.02px] h-0 outline outline-1 outline-offset-[-0.50px] outline-[#d9d9d9]"
        />

        {/* Fleet overview */}
        <div
          data-layer="fleet_overview_section"
          className="FleetOverviewSection self-stretch h-[138px] flex flex-col justify-start items-start gap-[9px]"
        >
          <div
            data-layer="fleet_overview_container"
            className="FleetOverviewContainer self-stretch h-[137px] flex flex-col justify-start items-start gap-3"
          >
            <div
              data-layer="fleet_overview_title"
              className="FleetOverviewTitle self-stretch text-black text-sm font-semibold"
            >
              Fleet Overview
            </div>

            <div
              data-layer="fleet_card_list"
              className="FleetCardList self-stretch inline-flex justify-start items-center gap-[17px]"
            >
              {fleetOverview?.map((fleet) => (
                <div
                  key={fleet.id}
                  data-layer="fleet_card_item"
                  className="FleetCardItem w-[146px] h-[111px] px-[17px] py-[13px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] inline-flex flex-col justify-center items-center gap-2.5"
                >
                  <div
                    data-layer="fleet_card_content"
                    className="FleetCardContent self-stretch flex flex-col justify-start items-start gap-[7px]"
                  >
                    <div
                      data-layer="fleet_card_equipment_type"
                      className="FleetCardEquipmentType text-black text-sm font-semibold"
                    >
                      {fleet.equipmentType}
                    </div>
                    <div
                      data-layer="fleet_card_summary"
                      className="FleetCardSummary w-[120px] text-black text-xs"
                    >
                      {fleet.active} active
                      <br />
                      {fleet.maintenance} maintenance
                      <br />
                      {fleet.idle} idle
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentStatusTable;
