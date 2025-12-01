import React, { useEffect, useState } from "react";
import { getPortCongestionStatus } from "../../services/shippingPlannerService";

function PortCongestionStatus() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getPortCongestionStatus();
      setData(result);
    }
    load();
  }, []);

  const updatedText = data?.updatedText || "Updated...";
  const shipsLoading = data?.shipsLoading || [];
  const shipsWaiting = data?.shipsWaiting || [];
  const shipsCompletedText = data?.shipsCompletedText || "-";
  const congestionLevel = data?.congestionLevel || "-";
  const operationalNote = data?.operationalNote || "-";

  return (
    <div
      data-layer="port_congestion_status_card"
      className="PortCongestionStatusCard w-[827px] h-[506px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="card_container"
        className="CardContainer self-stretch h-[457px] flex flex-col justify-start items-start gap-6"
      >

        <div
          data-layer="header_left_group"
          className="HeaderLeftGroup flex flex-col justify-start items-start gap-2.5"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper inline-flex justify-start items-center gap-3"
          >
            <div
              data-layer="icon_background_container"
              className="IconBackgroundContainer size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center"
            >
              <div className="IconActivityGroup size-8 flex justify-center items-center overflow-hidden">
                <img
                  className="IconActivity size-[22px]"
                  src="/icons/icon_activity.png"
                  alt="Activity icon"
                />
              </div>
            </div>
            <div
              data-layer="port_congestion_title"
              className="PortCongestionTitle text-black text-sm font-semibold"
            >
              Port Congestion Status
            </div>
          </div>
        </div>

        <div
          data-layer="updated_timestamp_text"
          className="UpdatedTimestampText self-stretch text-[#666666] text-sm"
        >
          {updatedText}
        </div>

        <div
          data-layer="content_container"
          className="ContentContainer self-stretch h-[360px] px-[19px] py-2.5 bg-[#efefef] rounded-[20px] flex flex-col justify-center items-center gap-2.5"
        >
          <div
            data-layer="activity_card_container"
            className="ActivityCardContainer w-[743px] h-[321px] flex flex-col justify-start items-start gap-[17px]"
          >

            <div
              data-layer="activity_header_container"
              className="ActivityHeaderContainer self-stretch flex flex-col justify-start items-start gap-3"
            >
              <div className="ActivityHeaderTitle self-stretch text-black text-xs font-semibold">
                Current Activity
              </div>
              <div className="ActivityHeaderDivider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-black/25" />
            </div>

            <div
              data-layer="activity_content_container"
              className="ActivityContentContainer self-stretch flex flex-col justify-start items-start gap-6"
            >

              <div className="ShipsLoadingWaitingGroup self-stretch inline-flex justify-between items-start">

                <div className="ShipsLoadingGroup w-[233px] inline-flex flex-col justify-start items-start gap-1.5">
                  <div className="ShipsLoadingLabel text-black text-sm font-semibold">
                    Ships Loading:
                  </div>
                  <div className="ShipsLoadingValue self-stretch text-black text-sm">
                    {shipsLoading.length > 0
                      ? shipsLoading.map((ship, index) => (
                        <div key={ship.id || index}>{ship.name || "-"}</div>
                      ))
                      : "(No active loading)"}
                  </div>
                </div>

                <div className="ShipsWaitingGroup w-[234px] inline-flex flex-col justify-start items-start gap-1.5">
                  <div className="ShipsWaitingLabel text-black text-sm font-semibold">
                    Ships Waiting:
                  </div>
                  <div className="ShipsWaitingValue self-stretch text-black text-sm">
                    {shipsWaiting.length > 0
                      ? shipsWaiting.map((ship, index) => (
                        <div key={ship.id || index}>
                          {ship.name || "-"} — ETA: {ship.eta || "-"}
                        </div>
                      ))
                      : "(No ships waiting)"}
                  </div>
                </div>
              </div>

              <div className="ShipsCompletedGroup w-[152px] flex flex-col justify-start items-start gap-1.5">
                <div className="ShipsCompletedInnerGroup inline-flex justify-start items-center gap-[5px]">
                  <div className="ShipsCompletedLabel text-black text-sm font-semibold">
                    Ships Completed:
                  </div>
                  <div className="ShipsCompletedValue w-[152px] text-black text-sm">
                    {shipsCompletedText}
                  </div>
                </div>
              </div>

              <div className="CongestionLevelGroup inline-flex justify-start items-center gap-[3px]">
                <div className="CongestionLevelLabel text-black text-sm font-semibold">
                  Congestion Level:
                </div>
                <div className="CongestionLevelValue">
                  <span className="text-[#c30012] text-sm font-semibold">
                    {congestionLevel}
                  </span>
                </div>
              </div>

              <div className="OperationalNoteGroup self-stretch inline-flex justify-start items-start gap-[5px]">
                <div className="OperationalNoteLabel text-black text-sm font-semibold">
                  Operational Note:
                </div>
                <div className="OperationalNoteText w-[513px] text-black text-sm">
                  {operationalNote}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PortCongestionStatus;
