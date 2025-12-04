import React, { useEffect, useState } from "react";
import { getVesselSchedule } from "../../services/shippingPlannerService";

function VesselScheduleOverview({ onSeeMore }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getVesselSchedule();
      setData(result);
    }
    load();
  }, []);

  const vessels = data?.vessels || [];

  return (
    <div
      data-layer="vessel_schedule_card"
      className="VesselScheduleCard w-[668px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="vessel_schedule_container"
        className="VesselScheduleContainer self-stretch flex flex-col justify-start items-start gap-6"
      >

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
                className="IconCargoShip size-[18px]"
                src="/icons/icon_cargo_ship.png"
                alt="Cargo ship icon"
              />
            </div>
            <div className="HeaderTitle text-black text-sm font-semibold">
              Vessel Schedule Overview
            </div>
          </div>

          <button
            type="button"
            onClick={onSeeMore}
            className="SeeMoreContainer inline-flex justify-start items-center gap-1"
          >
            <div className="SeeMoreLabel text-black text-xs font-semibold">
              See More
            </div>
            <div className="IconExpandRight size-6 relative">
              <div className="IconVector w-1.5 h-3 left-[15px] top-[18px] absolute origin-top-left rotate-180 border-2 border-black" />
            </div>
          </button>
        </div>

        <div
          data-layer="vessel_cards_container"
          className="VesselCardsContainer w-[620px] inline-flex justify-start items-center gap-3"
        >
          {(vessels.length > 0 ? vessels.slice(0, 2) : [1, 2]).map(
            (vessel, idx) => (
              <div
                key={vessel?.id || idx}
                className="VesselCardContainer w-[304px] px-[18px] py-5 bg-[#efefef] rounded-[20px] inline-flex flex-col justify-center items-center gap-2.5"
              >
                <div className="VesselCardContent self-stretch flex flex-col justify-start items-start gap-3">

                  <div className="VesselCardHeaderGroup self-stretch flex flex-col justify-start items-start gap-4">

                    <div className="VesselCardIconWrapper self-stretch h-8 relative">
                      <div className="VesselCardName left-[44px] top-[7.50px] absolute text-black text-sm font-semibold">
                        {vessel?.name || "Loading..."}
                      </div>
                      <div className="VesselCardIconShip size-8 p-[7px] left-0 top-0 absolute bg-[#1c2534] rounded-2xl inline-flex justify-center items-center">
                        <img
                          className="IconCargoShip size-[18px]"
                          src="/icons/icon_cargo_ship.png"
                          alt="Vessel icon"
                        />
                      </div>
                    </div>

                    <div className="VesselCardInfoContainer self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="VesselCardInfoGroup self-stretch flex flex-col justify-center items-start gap-4">

                        <div className="VesselCardDestinationGroup self-stretch inline-flex justify-start items-center gap-[54px]">
                          <div className="DestinationLabel text-black text-sm">
                            Destination
                          </div>
                          <div className="DestinationValue text-black text-sm font-semibold">
                            {vessel?.destination || "-"}
                          </div>
                        </div>

                        <div className="VesselCardPlannedLoadGroup self-stretch inline-flex justify-start items-center gap-[59px]">
                          <div className="PlannedLoadLabel text-black text-sm">
                            Planned Load
                          </div>
                          <div className="PlannedLoadValue text-right text-black text-sm font-semibold whitespace-pre-line">
                            {vessel?.loaded
                              ? `${vessel?.plannedLoad}\nLoaded: ${vessel?.loaded}`
                              : vessel?.plannedLoad || "-"}
                          </div>
                        </div>

                        <div className="VesselCardStatusGroup self-stretch h-[19px] py-[7px] inline-flex justify-between items-center">
                          <div className="StatusLabel text-black text-sm">
                            Status
                          </div>
                          <div className="VesselCardStatusValueWrapper w-[87px] h-5 px-4 bg-[#e6bb30] rounded-[7px] flex justify-center items-center">
                            <div className="StatusValue text-white text-xs font-semibold">
                              {vessel?.status || "-"}
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="VesselCardScheduleGroup self-stretch inline-flex justify-start items-center gap-[26px]">
                        <div className="EtaValue text-black text-sm">
                          ETA: {vessel?.eta || "-"}
                        </div>
                        <div className="EtdValue text-black text-sm">
                          ETD: {vessel?.etd || "-"}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default VesselScheduleOverview;
