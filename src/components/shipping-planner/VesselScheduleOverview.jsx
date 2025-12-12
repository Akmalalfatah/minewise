import React, { useEffect, useState } from "react";
import { getVesselSchedule } from "../../services/shippingPlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";
import AnimatedNumber from "../animation/AnimatedNumber";

function VesselScheduleOverview() {
  const [data, setData] = useState(null);
  const { location, timePeriod, shift } = useFilterQuery();

  useEffect(() => {
    async function load() {
      try {
        const result = await getVesselSchedule({
          location,
          timePeriod,
          shift,
        });
        setData(result);
      } catch {
        setData(null);
      }
    }
    load();
  }, [location, timePeriod, shift]);

  const vessels = data?.vessels || [];

  const extractNumber = (text) => {
    if (!text) return 0;
    return Number(String(text).replace(/[^\d.-]/g, "")) || 0;
  };

  return (
    <section className="VesselScheduleCard w-full p-6 bg-white rounded-3xl flex flex-col justify-center items-center gap-2.5 h-full">
      <div className="VesselScheduleContainer self-stretch flex flex-col justify-start items-start gap-6">
        <header className="HeaderContainer w-full h-8 inline-flex justify-start items-center gap-3">
          <figure className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
            <img className="size-[18px]" src="/icons/icon_cargo_ship.png" alt="Cargo ship icon" />
          </figure>
          <h2 className="HeaderTitle text-black text-sm font-semibold">
            Vessel Schedule Overview
          </h2>
        </header>

        <section className="VesselCardsContainer w-full inline-flex justify-start items-center gap-3 flex-wrap">
          {(vessels.length > 0 ? vessels.slice(0, 2) : [1, 2]).map((vessel, idx) => {
            const plannedLoad = extractNumber(vessel?.plannedLoad);
            const loaded = extractNumber(vessel?.loaded);

            return (
              <article
                key={vessel?.id || idx}
                className="VesselCardContainer flex-1 min-w-[260px] px-[18px] py-5 bg-[#efefef] rounded-[20px] inline-flex flex-col justify-center items-center gap-2.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="VesselCardContent self-stretch flex flex-col justify-start items-start gap-3">
                  <header className="flex items-center gap-3">
                    <figure className="size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
                      <img className="size-[18px]" src="/icons/icon_cargo_ship.png" alt="Vessel icon" />
                    </figure>
                    <h3 className="text-black text-sm font-semibold leading-tight">
                      {vessel?.name || "Loading..."}
                    </h3>
                  </header>

                  <div className="VesselCardInfoContainer self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="inline-flex justify-between items-center self-stretch">
                      <span className="text-black text-sm">Destination</span>
                      <span className="text-black text-sm font-semibold">
                        {vessel?.destination || "-"}
                      </span>
                    </div>

                    <div className="inline-flex justify-between items-center self-stretch">
                      <span className="text-black text-sm">Planned Load</span>
                      <span className="text-right text-black text-sm font-semibold whitespace-pre-line">
                        {vessel?.loaded ? (
                          <>
                            <AnimatedNumber value={plannedLoad} decimals={0} /> TON{"\n"}
                            Loaded: <AnimatedNumber value={loaded} decimals={0} /> TON
                          </>
                        ) : (
                          <>
                            <AnimatedNumber value={plannedLoad} decimals={0} /> TON
                          </>
                        )}
                      </span>
                    </div>

                    <div className="inline-flex justify-between items-center self-stretch py-[7px]">
                      <span className="text-black text-sm">Status</span>
                      <div className="w-[87px] h-5 px-4 bg-[#e6bb30] rounded-[7px] flex justify-center items-center">
                        <span className="text-white text-xs font-semibold">
                          {vessel?.status || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex justify-start items-center gap-[26px]">
                      <span className="text-black text-sm">ETA: {vessel?.eta || "-"}</span>
                      <span className="text-black text-sm">ETD: {vessel?.etd || "-"}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </section>
  );
}

export default VesselScheduleOverview;
