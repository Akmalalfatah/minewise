import React from "react";
import AnimatedNumber from "../animation/AnimatedNumber";
import KpiCardWrapper from "../animation/KpiCardWrapper";

function EquipmentStatusCard({ data }) {
  if (!data) return null;

  const active = Number(data.active) || 0;
  const standby = Number(data.standby) || 0;
  const underRepair = Number(data.under_repair) || 0;
  const maintenance = Number(data.maintenance) || 0;

  return (
    <KpiCardWrapper
      className="EquipmentStatusCard w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <section
        data-layer="equipment_status_card"
        aria-label="Equipment status summary"
        className="w-full h-full"
      >
        <div className="HeaderContainer w-[205px] h-[204px] flex flex-col justify-center items-start gap-3">
          <header className="HeaderLeftGroup size- rounded-3xl inline-flex justify-center items-center gap-3">
            <div className="IconWrapper size-8 px-[7px] py-2 bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
              <img
                className="IconTools size-[18px]"
                src="/icons/icon_tools.png"
                alt=""
              />
            </div>
            <h2 className="text-black text-sm font-semibold">Status Alat</h2>
          </header>

          <section className="ContentContainer self-stretch flex flex-col justify-start items-start gap-[11px]">
            <div className="InfoRows self-stretch inline-flex justify-between items-center">
              <div className="LabelContainer w-[133px] inline-flex flex-col gap-4">
                <span className="text-black text-sm">Active Operating</span>
                <span className="text-black text-sm">Standby</span>
                <span className="text-black text-sm">Under Repair</span>
                <span className="text-black text-sm">Maintenance</span>
              </div>

              <div className="ValueContainer inline-flex flex-col justify-start items-end gap-4">
                <p className="text-black text-sm font-semibold">
                  <AnimatedNumber value={active} decimals={0} />
                </p>
                <p className="text-black text-sm font-semibold">
                  <AnimatedNumber value={standby} decimals={0} />
                </p>
                <p className="text-black text-sm font-semibold">
                  <AnimatedNumber value={underRepair} decimals={0} />
                </p>
                <p className="text-black text-sm font-semibold">
                  <AnimatedNumber value={maintenance} decimals={0} />
                </p>
              </div>
            </div>

            <div className="Divider self-stretch h-0 outline outline-[0.50px] outline-[#bdbdbd]" />

            <footer className="FooterContainer self-stretch inline-flex justify-between items-center">
              <span className="text-black/60 text-sm">Lokasi Source</span>
              <span className="text-black/60 text-sm font-semibold">
                {data.source_location || "-"}
              </span>
            </footer>
          </section>
        </div>
      </section>
    </KpiCardWrapper>
  );
}

export default EquipmentStatusCard;
