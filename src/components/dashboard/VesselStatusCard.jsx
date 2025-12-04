import React, { useEffect, useState } from "react";
import { getVesselStatus } from "../../services/dashboardService";

function VesselStatusCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getVesselStatus();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  return (
    <section
      data-layer="vessel_status_card"
      aria-label="Vessel status summary"
      className="VesselStatusCard w-[253px] h-[248px] p-[18px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="header_container"
        className="HeaderContainer size- flex flex-col justify-start items-start gap-[18px]"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup size- rounded-3xl inline-flex justify-center items-center gap-3"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
          >
            <img
              data-layer="icon_ship"
              className="IconShip size-[18px]"
              src="/icons/icon_ship.png"
              alt="Ship icon"
            />
          </div>
          <h2
            data-layer="vessel_status_title"
            className="VesselStatusTitle justify-start text-black text-sm font-semibold"
          >
            Kapal Aktif
          </h2>
        </header>

        {/* Content */}
        <section
          data-layer="content_container"
          className="ContentContainer size- flex flex-col justify-start items-start gap-[18px]"
        >
          {/* Info rows */}
          <div
            data-layer="info_rows"
            className="InfoRows w-[205px] h-[92px] inline-flex justify-between items-center"
          >
            {/* Labels */}
            <div
              data-layer="label_container"
              className="LabelContainer w-[117px] inline-flex flex-col justify-center items-start gap-5"
            >
              <span
                data-layer="vessels_loading_title"
                className="VesselsLoadingTitle self-stretch justify-start text-black text-sm font-normal"
              >
                Kapal loading
              </span>
              <span
                data-layer="vessels_waiting_title"
                className="VesselsWaitingTitle justify-start text-black text-sm font-normal"
              >
                Kapal menunggu
              </span>
              <span
                data-layer="vessels_non_delay_risk_title"
                className="VesselsNonDelayRiskTitle justify-start text-black text-sm font-normal"
              >
                Non Delay Risk
              </span>
            </div>

            {/* Values */}
            <div
              data-layer="value_container"
              className="ValueContainer w-[9px] h-[91px] inline-flex flex-col justify-center items-end gap-5"
            >
              <p
                data-layer="vessels_loading"
                className="VesselsLoading text-right justify-start text-black text-sm font-semibold"
              >
                {data.vesselsLoading}
              </p>
              <p
                data-layer="vessels_waiting"
                className="VesselsWaiting text-right justify-start text-black text-sm font-semibold"
              >
                {data.vesselsWaiting}
              </p>
              <p
                data-layer="vessels_non_delay_risk"
                className="VesselsNonDelayRisk text-right justify-start text-[#4caf50] text-sm font-semibold"
              >
                {data.vesselsNonDelayRisk}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            data-layer="divider"
            className="Divider w-[205px] h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
          ></div>

          {/* Footer */}
          <footer
            data-layer="footer_container"
            className="FooterContainer w-[205px] h-[17px] inline-flex justify-between items-start"
          >
            <span
              data-layer="vessel_title"
              className="VesselTitle justify-start text-black/60 text-sm font-normal"
            >
              Nama Kapal
            </span>
            <span
              data-layer="vessel_name"
              className="VesselName w-[118px] text-right justify-start text-black/60 text-sm font-semibold"
            >
              {data.vesselName}
            </span>
          </footer>
        </section>
      </div>
    </section>
  );
}

export default VesselStatusCard;
