import React, { useEffect, useState } from "react";
import { getVesselSchedule } from "../../services/shippingPlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function VesselScheduleOverview() {
  const [data, setData] = useState(null);
  const { location, timePeriod, shift } = useFilterQuery();

  useEffect(() => {
    async function load() {
      try {
        const filters = { location, timePeriod, shift };
        const result = await getVesselSchedule(filters);
        setData(result);
      } catch (err) {
        console.error("Failed to load vessel schedule:", err);
        setData(null);
      }
    }
    load();
  }, [location, timePeriod, shift]);

  const vessels = data?.vessels || [];

  return (
    <section
      data-layer="vessel_schedule_card"
      className="VesselScheduleCard w-full p-6 bg-white rounded-3xl flex flex-col justify-center items-center gap-2.5 h-full"
    >
      <div
        data-layer="vessel_schedule_container"
        className="VesselScheduleContainer self-stretch flex flex-col justify-start items-start gap-6"
      >
        <header
          data-layer="header_container"
          className="HeaderContainer w-full h-8 inline-flex justify-between items-center"
        >
          <div
            data-layer="header_left_group"
            className="HeaderLeftGroup flex justify-start items-center gap-3"
          >
            <figure
              data-layer="icon_wrapper"
              className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center"
            >
              <img
                className="IconCargoShip size-[18px]"
                src="/icons/icon_cargo_ship.png"
                alt="Cargo ship icon"
              />
            </figure>
            <h2 className="HeaderTitle text-black text-sm font-semibold">
              Vessel Schedule Overview
            </h2>
          </div>
        </header>

        <section
          data-layer="vessel_cards_container"
          className="VesselCardsContainer w-full inline-flex justify-start items-center gap-3"
        >
          {(vessels.length > 0 ? vessels.slice(0, 2) : [1, 2]).map(
            (vessel, idx) => (
              <article
                key={vessel?.id || idx}
                className="VesselCardContainer flex-1 min-w-[280px] px-[18px] py-5 bg-[#efefef] rounded-[20px] inline-flex flex-col justify-center items-center gap-2.5"
              >
                <div className="VesselCardContent self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="VesselCardHeaderGroup self-stretch flex flex-col justify-start items-start gap-4">
                    <header className="VesselCardIconWrapper self-stretch h-8 relative">
                      <h3 className="VesselCardName left-[44px] top-[7.50px] absolute text-black text-sm font-semibold">
                        {vessel?.name || "Loading..."}
                      </h3>
                      <figure className="VesselCardIconShip size-8 p-[7px] left-0 top-0 absolute bg-[#1c2534] rounded-2xl inline-flex justify-center items-center">
                        <img
                          className="IconCargoShip size-[18px]"
                          src="/icons/icon_cargo_ship.png"
                          alt="Vessel icon"
                        />
                      </figure>
                    </header>

                    <div className="VesselCardInfoContainer self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="VesselCardInfoGroup self-stretch flex flex-col justify-center items-start gap-4">
                        <div className="VesselCardDestinationGroup self-stretch inline-flex justify-start items-center gap-[54px]">
                          <span className="DestinationLabel text-black text-sm">
                            Destination
                          </span>
                          <span className="DestinationValue text-black text-sm font-semibold">
                            {vessel?.destination || "-"}
                          </span>
                        </div>

                        <div className="VesselCardPlannedLoadGroup self-stretch inline-flex justify-start items-center gap-[59px]">
                          <span className="PlannedLoadLabel text-black text-sm">
                            Planned Load
                          </span>
                          <span className="PlannedLoadValue text-right text-black text-sm font-semibold whitespace-pre-line">
                            {vessel?.loaded
                              ? `${vessel?.plannedLoad}\nLoaded: ${vessel?.loaded}`
                              : vessel?.plannedLoad || "-"}
                          </span>
                        </div>

                        <div className="VesselCardStatusGroup self-stretch h-[19px] py-[7px] inline-flex justify-between items-center">
                          <span className="StatusLabel text-black text-sm">
                            Status
                          </span>
                          <div className="VesselCardStatusValueWrapper w-[87px] h-5 px-4 bg-[#e6bb30] rounded-[7px] flex justify-center items-center">
                            <span className="StatusValue text-white text-xs font-semibold">
                              {vessel?.status || "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="VesselCardScheduleGroup self-stretch inline-flex justify-start items-center gap-[26px]">
                        <span className="EtaValue text-black text-sm">
                          ETA: {vessel?.eta || "-"}
                        </span>
                        <span className="EtdValue text-black text-sm">
                          ETD: {vessel?.etd || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          )}
        </section>
      </div>
    </section>
  );
}

export default VesselScheduleOverview;
