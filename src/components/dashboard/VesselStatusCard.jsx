import React from "react";

function VesselStatusCard({ data }) {
  if (!data) return null;

  return (
    <section
      data-layer="vessel_status_card"
      aria-label="Vessel status summary"
      className="VesselStatusCard w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div className="HeaderContainer size- flex flex-col justify-start items-start gap-[18px]">
        <header className="HeaderLeftGroup size- rounded-3xl inline-flex justify-center items-center gap-3">
          <div className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5">
            <img className="IconShip size-[18px]" src="/icons/icon_ship.png" alt="" />
          </div>
          <h2 className="text-black text-sm font-semibold">Kapal Aktif</h2>
        </header>

        <section className="ContentContainer size- flex flex-col justify-start items-start gap-[18px]">
          <div className="InfoRows w-[205px] h-[92px] inline-flex justify-between items-center">
            <div className="LabelContainer w-[117px] inline-flex flex-col gap-5">
              <span className="text-black text-sm">Kapal loading</span>
              <span className="text-black text-sm">Kapal menunggu</span>
              <span className="text-black text-sm">Non Delay Risk</span>
            </div>

            <div className="ValueContainer inline-flex flex-col justify-center items-end gap-5">
              <p className="text-black text-sm font-semibold">{data.loading}</p>
              <p className="text-black text-sm font-semibold">{data.waiting}</p>
              <p className="text-[#4caf50] text-sm font-semibold">{data.non_delay_risk ? "Ya" : "Tidak"}</p>
            </div>
          </div>

          <div className="Divider w-[205px] h-0 outline outline-[0.50px] outline-[#bdbdbd]" />

          <footer className="FooterContainer w-[205px] inline-flex justify-between items-center">
            <span className="text-black/60 text-sm">Nama Kapal</span>
            <span className="text-black/60 text-sm font-semibold">{data.vessel_name || "-"}</span>
          </footer>
        </section>
      </div>
    </section>
  );
}

export default VesselStatusCard;
