function PortCongestionStatus({
  updatedText,
  shipsLoading,
  shipsWaiting,
  shipsCompletedText,
  congestionLevel,
  operationalNote,
}) {
  return (
    <div
      data-layer="port_congestion_status_card"
      className="PortCongestionStatusCard w-[827px] h-[506px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="card_container"
        className="CardContainer self-stretch h-[457px] flex flex-col justify-start items-start gap-6"
      >
        {/* Header */}
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
              <div
                data-layer="icon_activity_group"
                className="IconActivityGroup size-8 flex justify-center items-center overflow-hidden"
              >
                <img
                  data-layer="icon_activity"
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

        {/* Updated timestamp */}
        <div
          data-layer="updated_timestamp_text"
          className="UpdatedTimestampText self-stretch text-[#666666] text-sm"
        >
          {updatedText}
        </div>

        {/* Content */}
        <div
          data-layer="content_container"
          className="ContentContainer self-stretch h-[360px] px-[19px] py-2.5 bg-[#efefef] rounded-[20px] flex flex-col justify-center items-center gap-2.5"
        >
          <div
            data-layer="activity_card_container"
            className="ActivityCardContainer w-[743px] h-[321px] flex flex-col justify-start items-start gap-[17px]"
          >
            {/* Section header */}
            <div
              data-layer="activity_header_container"
              className="ActivityHeaderContainer self-stretch flex flex-col justify-start items-start gap-3"
            >
              <div
                data-layer="activity_header_title"
                className="ActivityHeaderTitle self-stretch text-black text-xs font-semibold"
              >
                Current Activity
              </div>
              <div
                data-layer="activity_header_divider"
                className="ActivityHeaderDivider self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-black/25"
              />
            </div>

            <div
              data-layer="activity_content_container"
              className="ActivityContentContainer self-stretch flex flex-col justify-start items-start gap-6"
            >
              {/* Ships loading & waiting */}
              <div
                data-layer="ships_loading_waiting_group"
                className="ShipsLoadingWaitingGroup self-stretch inline-flex justify-between items-start"
              >
                {/* Ships loading */}
                <div
                  data-layer="ships_loading_group"
                  className="ShipsLoadingGroup w-[233px] inline-flex flex-col justify-start items-start gap-1.5"
                >
                  <div
                    data-layer="ships_loading_label"
                    className="ShipsLoadingLabel text-black text-sm font-semibold"
                  >
                    Ships Loading:
                  </div>
                  <div
                    data-layer="ships_loading_value"
                    className="ShipsLoadingValue self-stretch text-black text-sm"
                  >
                    {shipsLoading && shipsLoading.length > 0
                      ? shipsLoading.map((ship, index) => (
                          <div key={ship.id || index}>{ship.name || ship}</div>
                        ))
                      : "(No active loading)"}
                  </div>
                </div>

                {/* Ships waiting */}
                <div
                  data-layer="ships_waiting_group"
                  className="ShipsWaitingGroup w-[234px] inline-flex flex-col justify-start items-start gap-1.5"
                >
                  <div
                    data-layer="ships_waiting_label"
                    className="ShipsWaitingLabel text-black text-sm font-semibold"
                  >
                    Ships Waiting:
                  </div>
                  <div
                    data-layer="ships_waiting_value"
                    className="ShipsWaitingValue self-stretch text-black text-sm"
                  >
                    {shipsWaiting && shipsWaiting.length > 0
                      ? shipsWaiting.map((ship, index) => (
                          <div key={ship.id || index}>
                            {ship.name} — ETA: {ship.eta}
                          </div>
                        ))
                      : "(No ships waiting)"}
                  </div>
                </div>
              </div>

              {/* Ships completed */}
              <div
                data-layer="ships_completed_group"
                className="ShipsCompletedGroup w-[152px] flex flex-col justify-start items-start gap-1.5"
              >
                <div
                  data-layer="ships_completed_inner_group"
                  className="ShipsCompletedInnerGroup inline-flex justify-start items-center gap-[5px]"
                >
                  <div
                    data-layer="ships_completed_label"
                    className="ShipsCompletedLabel text-black text-sm font-semibold"
                  >
                    Ships Completed:
                  </div>
                  <div
                    data-layer="ships_completed_value"
                    className="ShipsCompletedValue w-[152px] text-black text-sm"
                  >
                    {shipsCompletedText}
                  </div>
                </div>
              </div>

              {/* Congestion level */}
              <div
                data-layer="congestion_level_group"
                className="CongestionLevelGroup inline-flex justify-start items-center gap-[3px]"
              >
                <div
                  data-layer="congestion_level_label"
                  className="CongestionLevelLabel text-black text-sm font-semibold"
                >
                  Congestion Level:
                </div>
                <div
                  data-layer="congestion_level_value"
                  className="CongestionLevelValue"
                >
                  <span className="text-[#c30012] text-sm font-semibold">
                    {congestionLevel}
                  </span>
                </div>
              </div>

              {/* Operational note */}
              <div
                data-layer="operational_note_group"
                className="OperationalNoteGroup self-stretch inline-flex justify-start items-start gap-[5px]"
              >
                <div
                  data-layer="operational_note_label"
                  className="OperationalNoteLabel text-black text-sm font-semibold"
                >
                  Operational Note:
                </div>
                <div
                  data-layer="operational_note_text"
                  className="OperationalNoteText w-[513px] text-black text-sm"
                >
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
