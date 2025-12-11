function EquipmentStatusCard({
    equipmentActive,
    equipmentStandby,
    equipmentUnderRepair,
    equipmentMaintanance,
    sourceLocation,
}) {
    return (
        <div data-layer="equipment_status_card" className="EquipmentStatusCard w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
            <div data-layer="header_container" className="HeaderContainer w-[205px] h-[204px] flex flex-col justify-center items-start gap-3">
                <div data-layer="header_left_group" className="HeaderLeftGroup size- rounded-3xl inline-flex justify-center items-center gap-3">
                    <div data-layer="icon_wrapper" className="IconWrapper size-8 px-[7px] py-2 bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
                        <img data-layer="icon_tools" className="IconTools size-[18px]" src="/icons/icon_tools.png" />
                    </div>
                    <div data-layer="equipment_status_title" className="EquipmentStatusTitle justify-start text-black text-sm font-semibold">Status Alat</div>
                </div>
                <div data-layer="content_container" className="ContentContainer self-stretch flex flex-col justify-start items-start gap-[11px]">
                    <div data-layer="info_rows" className="InfoRows self-stretch inline-flex justify-between items-center">
                        <div data-layer="label_container" className="LabelContainer w-[133px] inline-flex flex-col justify-start items-start gap-4">
                            <div data-layer="equipment_active_title" className="EquipmentActiveTitle justify-start text-black text-sm font-normal">Active Operating</div>
                            <div data-layer="equipment_standby_title" className="EquipmentStandbyTitle self-stretch justify-start text-black text-sm font-normal">Standby</div>
                            <div data-layer="equipment_under_repair_title" className="EquipmentUnderRepairTitle justify-start text-black text-sm font-normal">Under Repair</div>
                            <div data-layer="equipment-maintanance_title" className="EquipmentMaintananceTitle justify-start text-black text-sm font-normal">Maintanance</div>
                        </div>
                        <div data-layer="value_container" className="ValueContainer w-[9px] inline-flex flex-col justify-start items-end gap-4">
                            <div data-layer="equipment_active" className="EquipmentActive text-right justify-start text-black text-sm font-semibold">{equipmentActive}</div>
                            <div data-layer="equipment_standby" className="EquipmentStandby text-right justify-start text-black text-sm font-semibold">{equipmentStandby}</div>
                            <div data-layer="equipment_under_repair" className="EquipmentUnderRepair text-right justify-start text-black text-sm font-semibold">{equipmentUnderRepair}</div>
                            <div data-layer="equipment-maintanance" className="EquipmentMaintanance text-right justify-start text-black text-sm font-semibold">{equipmentMaintanance}</div>
                        </div>
                    </div>
                    <div data-layer="divider" className="Divider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"></div>
                    <div data-layer="footer_container" className="FooterContainer self-stretch inline-flex justify-between items-center">
                        <div data-layer="source_location_title" className="SourceLocationTitle justify-start text-black/60 text-sm font-normal">Lokasi Source</div>
                        <div data-layer="source_location" className="SourceLocation text-right justify-start text-black/60 text-sm font-semibold">{sourceLocation}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EquipmentStatusCard;