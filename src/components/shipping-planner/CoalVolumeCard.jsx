import React, { useEffect, useState } from "react";
import { getCoalVolumeReady } from "../../services/shippingPlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function CoalVolumeCard() {
  const [data, setData] = useState(null);
  const { location, timePeriod, shift } = useFilterQuery();

  useEffect(() => {
    async function load() {
      try {
        const result = await getCoalVolumeReady({
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

  const stockpiles = data?.stockpiles || [];

  return (
    <section
      data-layer="coal_volume_card"
      aria-labelledby="coal-volume-title"
      className="CoalVolumeCard w-full p-6 bg-white rounded-3xl flex flex-col justify-center items-center gap-2.5 h-full"
    >
      <div className="CoalVolumeContainer self-stretch flex flex-col justify-start items-start gap-6">
        <header className="HeaderContainer self-stretch inline-flex justify-between items-center">
          <div className="HeaderLeftGroup flex items-center gap-3 w-full whitespace-nowrap">
            <div className="IconWrapper size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center">
              <div className="IconCoalWagon size-5 relative overflow-hidden">
                <img
                  className="IconVector w-[18.05px] h-[16.52px] left-[0.98px] top-[2.50px] absolute"
                  src="/icons/icon_coal_wagon.png"
                  alt="Coal wagon icon"
                />
              </div>
            </div>

            <h2
              id="coal-volume-title"
              className="HeaderTitle text-black text-base font-semibold"
            >
              Coal Volume Ready to Ship
            </h2>
          </div>
        </header>

        <div className="CoalCardsContainer w-full flex flex-wrap justify-start items-center gap-3">
          {(stockpiles.length > 0 ? stockpiles.slice(0, 2) : [1, 2]).map(
            (sp, idx) => (
              <article
                key={sp?.id || idx}
                aria-label={`Coal stockpile ${sp?.name || "Loading..."}`}
                className="CoalCardContainer flex-1 min-w-[280px] h-[260px] px-[18px] py-5 bg-[#efefef] rounded-[20px] inline-flex flex-col justify-center items-center gap-2.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="CoalCardHeaderWrapper self-stretch h-[196px] flex flex-col justify-center items-start gap-7">
                  <header className="CoalCardHeaderContainer self-stretch inline-flex justify-start items-center gap-3">
                    <div className="CoalCardIconWrapper size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center">
                      <div className="CoalCardIcon size-5 relative overflow-hidden">
                        <img
                          className="CoalCardIconVector w-[18.05px] h-[16.52px] left-[0.98px] top-[2.50px] absolute"
                          src="/icons/icon_coal_wagon.png"
                          alt="Coal icon"
                        />
                      </div>
                    </div>

                    <h3 className="CoalCardTitle text-black text-sm font-semibold">
                      {sp?.name || "Loading..."}
                    </h3>
                  </header>

                  <section className="CoalCardContentContainer self-stretch h-[152px] flex flex-col justify-center items-start gap-3">
                    <dl className="w-full grid grid-cols-2 gap-y-3">
                      <dt className="text-black text-sm">Volume</dt>
                      <dd className="text-right text-black text-sm font-semibold">
                        {sp?.volume || "-"}
                      </dd>

                      <dt className="text-black text-sm">CV</dt>
                      <dd className="text-right text-black text-sm font-semibold">
                        {sp?.cv || "-"}
                      </dd>

                      <dt className="text-black text-sm">Moisture</dt>
                      <dd className="text-right text-black text-sm font-semibold">
                        {sp?.moisture || "-"}
                      </dd>

                      <dt className="text-black text-sm">Status</dt>
                      <dd className="flex justify-end">
                        <div className="w-[87px] h-5 px-4 bg-[#e6bb30] rounded-[7px] flex justify-center items-center">
                          <span className="text-white text-xs font-semibold">
                            {sp?.status || "-"}
                          </span>
                        </div>
                      </dd>

                      <dt className="text-black text-sm">ETA</dt>
                      <dd className="text-right text-black text-sm">
                        {sp?.eta || "-"}
                      </dd>

                      <dt className="text-black text-sm">ETD</dt>
                      <dd className="text-right text-black text-sm">
                        {sp?.etd || "-"}
                      </dd>
                    </dl>
                  </section>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default CoalVolumeCard;
