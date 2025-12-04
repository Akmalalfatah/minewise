function VesselScheduleOverview({ vessels, onSeeMore }) {
  return (
    <div
      data-layer="vessel_schedule_card"
      className="VesselScheduleCard w-[668px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="vessel_schedule_container"
        className="VesselScheduleContainer self-stretch flex flex-col justify-start items-start gap-6"
      >
        {/* Header */}
        <div
          data-layer="header_container"
          className="HeaderContainer w-[620px] h-8 inline-flex justify-between items-center"
        >
          <div
            data-layer="header_left_group"
            className="HeaderLeftGroup w-56 flex justify-start items-center gap-3"
          >
            <div
              data-layer="icon_wrapper"
              className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center"
            >
              <img
                data-layer="icon_cargo_ship"
                className="IconCargoShip size-[18px]"
                src="/icons/icon_cargo_ship.png"
                alt="Cargo ship icon"
              />
            </div>
            <div
              data-layer="header_title"
              className="HeaderTitle text-black text-sm font-semibold"
            >
              Vessel Schedule Overview
            </div>
          </div>

          <button
            type="button"
            onClick={onSeeMore}
            data-layer="see_more_container"
            className="SeeMoreContainer inline-flex justify-start items-center gap-1"
          >
            <div
              data-layer="see_more_label"
              className="SeeMoreLabel text-black text-xs font-semibold"
            >
              See More
            </div>
            <div
              data-layer="icon_expand_right"
              className="IconExpandRight size-6 relative"
            >
              <div
                data-layer="icon_vector"
                className="IconVector w-1.5 h-3 left-[15px] top-[18px] absolute origin-top-left rotate-180 border-2 border-black"
              />
            </div>
          </button>
        </div>

        {/* Vessel cards */}
        <div
          data-layer="vessel_cards_container"
          className="VesselCardsContainer w-[620px] inline-flex justify-start items-center gap-3"
        >
          {vessels?.map((vessel) => (
            <div
              key={vessel.id}
              data-layer="vessel_card_container"
              className="VesselCardContainer w-[304px] px-[18px] py-5 bg-[#efefef] rounded-[20px] inline-flex flex-col justify-center items-center gap-2.5"
            >
              <div
                data-layer="vessel_card_content"
                className="VesselCardContent self-stretch flex flex-col justify-start items-start gap-3"
              >
                {/* Header name + icon */}
                <div
                  data-layer="vessel_card_header_group"
                  className="VesselCardHeaderGroup self-stretch flex flex-col justify-start items-start gap-4"
                >
                  <div
                    data-layer="vessel_card_icon_wrapper"
                    className="VesselCardIconWrapper self-stretch h-8 relative"
                  >
                    <div
                      data-layer="vessel_card_name"
                      className="VesselCardName left-[44px] top-[7.50px] absolute text-black text-sm font-semibold"
                    >
                      {vessel.name}
                    </div>
                    <div
                      data-layer="vessel_card_icon_ship"
                      className="VesselCardIconShip size-8 p-[7px] left-0 top-0 absolute bg-[#1c2534] rounded-2xl inline-flex justify-center items-center"
                    >
                      <img
                        data-layer="icon_cargo_ship"
                        className="IconCargoShip size-[18px]"
                        src="/icons/icon_cargo_ship.png"
                        alt="Vessel icon"
                      />
                    </div>
                  </div>

                  <div
                    data-layer="vessel_card_info_container"
                    className="VesselCardInfoContainer self-stretch flex flex-col justify-start items-start gap-6"
                  >
                    <div
                      data-layer="vessel_card_info_group"
                      className="VesselCardInfoGroup self-stretch flex flex-col justify-center items-start gap-4"
                    >
                      {/* Destination */}
                      <div
                        data-layer="vessel_card_destination_group"
                        className="VesselCardDestinationGroup self-stretch inline-flex justify-start items-center gap-[54px]"
                      >
                        <div className="DestinationLabel text-black text-sm">
                          Destination
                        </div>
                        <div className="DestinationValue text-black text-sm font-semibold">
                          {vessel.destination}
                        </div>
                      </div>

                      {/* Planned load (+ optional loaded) */}
                      <div
                        data-layer="vessel_card_planned_load_group"
                        className="VesselCardPlannedLoadGroup self-stretch inline-flex justify-start items-center gap-[59px]"
                      >
                        <div className="PlannedLoadLabel text-black text-sm">
                          Planned Load
                        </div>
                        <div className="PlannedLoadValue text-right text-black text-sm font-semibold whitespace-pre-line">
                          {vessel.loaded
                            ? `${vessel.plannedLoad}\nLoaded: ${vessel.loaded}`
                            : vessel.plannedLoad}
                        </div>
                      </div>

                      {/* Status */}
                      <div
                        data-layer="vessel_card_status_group"
                        className="VesselCardStatusGroup self-stretch h-[19px] py-[7px] inline-flex justify-between items-center"
                      >
                        <div className="StatusLabel text-black text-sm">
                          Status
                        </div>
                        <div
                          data-layer="vessel_card_status_value_wrapper"
                          className="VesselCardStatusValueWrapper w-[87px] h-5 px-4 bg-[#e6bb30] rounded-[7px] flex justify-center items-center"
                        >
                          <div className="StatusValue text-white text-xs font-semibold">
                            {vessel.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ETA / ETD */}
                    <div
                      data-layer="vessel_card_schedule_group"
                      className="VesselCardScheduleGroup self-stretch inline-flex justify-start items-center gap-[26px]"
                    >
                      <div className="EtaValue text-black text-sm">
                        ETA: {vessel.eta}
                      </div>
                      <div className="EtdValue text-black text-sm">
                        ETD: {vessel.etd}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VesselScheduleOverview;
