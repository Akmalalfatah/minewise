import React, { useEffect, useState } from "react";
import { getCoalVolumeReady } from "../../services/shippingPlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function CoalVolumeCard({ onSeeMore }) {
  const [data, setData] = useState(null);
  const { location, timePeriod, shift } = useFilterQuery();

  useEffect(() => {
    async function load() {
      try {
        const filters = { location, timePeriod, shift };
        const result = await getCoalVolumeReady(filters);
        setData(result);
      } catch (err) {
        console.error("Failed to load coal volume:", err);
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
      <div
        data-layer="coal_volume_container"
        className="CoalVolumeContainer self-stretch flex flex-col justify-start items-start gap-6"
      >
        <header
          data-layer="header_container"
          className="HeaderContainer self-stretch inline-flex justify-between items-center"
        >
          <div
            data-layer="header_left_group"
            className="HeaderLeftGroup w-[252px] flex justify-start items-center gap-3"
          >
            <div
              data-layer="icon_wrapper"
              className="IconWrapper size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center"
            >
              <div
                data-layer="icon_coal_wagon"
                className="IconCoalWagon size-5 relative overflow-hidden"
              >
                <img
                  data-layer="icon_vector"
                  className="IconVector w-[18.05px] h-[16.52px] left-[0.98px] top-[2.50px] absolute"
                  src="/icons/icon_coal_wagon.png"
                  alt="Coal wagon icon"
                />
              </div>
            </div>

            <h2
              id="coal-volume-title"
              data-layer="header_title"
              className="HeaderTitle text-black text-base font-semibold"
            >
              Coal Volume Ready to Ship
            </h2>
          </div>

          <button
            type="button"
            onClick={onSeeMore}
            data-layer="see_more_container"
            className="SeeMoreContainer inline-flex justify-start items-center gap-1"
          >
            <span
              data-layer="see_more_label"
              className="SeeMoreLabel text-black text-xs font-semibold"
            >
              See More
            </span>
            <div
              data-layer="see_more_icon"
              className="SeeMoreIcon size-6 relative"
            >
              <div
                data-layer="see_more_icon_vector"
                className="SeeMoreIconVector w-1.5 h-3 left-[15px] top-[18px] absolute origin-top-left rotate-180 border-2 border-black"
              />
            </div>
          </button>
        </header>

        <div
          data-layer="coal_cards_container"
          className="CoalCardsContainer w-full inline-flex justify-start items-center gap-3"
        >
          {(stockpiles.length > 0 ? stockpiles.slice(0, 2) : [1, 2]).map(
            (sp, idx) => (
              <article
                key={sp?.id || idx}
                aria-label={`Coal stockpile ${sp?.name || "Loading..."}`}
                data-layer="coal_card_container"
                className="CoalCardContainer flex-1 min-w-[280px] h-[234px] px-[18px] py-5 bg-[#efefef] rounded-[20px] inline-flex flex-col justify-center items-center gap-2.5"
              >
                <div
                  data-layer="coal_card_header_wrapper"
                  className="CoalCardHeaderWrapper self-stretch h-[196px] flex flex-col justify-center items-start gap-3"
                >
                  <header
                    data-layer="coal_card_header_container"
                    className="CoalCardHeaderContainer self-stretch inline-flex justify-start items-center gap-3"
                  >
                    <div
                      data-layer="coal_card_icon_wrapper"
                      className="CoalCardIconWrapper size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center"
                    >
                      <div
                        data-layer="coal_card_icon"
                        className="CoalCardIcon size-5 relative overflow-hidden"
                      >
                        <img
                          data-layer="coal_card_icon_vector"
                          className="CoalCardIconVector w-[18.05px] h-[16.52px] left-[0.98px] top-[2.50px] absolute"
                          src="/icons/icon_coal_wagon.png"
                          alt="Coal icon"
                        />
                      </div>
                    </div>

                    <h3
                      data-layer="coal_card_title"
                      className="CoalCardTitle text-black text-sm font-semibold"
                    >
                      {sp?.name || "Loading..."}
                    </h3>
                  </header>

                  <section
                    data-layer="coal_card_content_container"
                    className="CoalCardContentContainer self-stretch h-[152px] flex flex-col justify-center items-start gap-3"
                  >
                    <dl className="w-full space-y-3">
                      <div
                        data-layer="coal_card_volume_group"
                        className="CoalCardVolumeGroup self-stretch inline-flex justify-between items-center"
                      >
                        <dt className="VolumeLabel text-black text-sm">
                          Volume
                        </dt>
                        <dd className="VolumeValue text-black text-sm font-semibold">
                          {sp?.volume || "-"}
                        </dd>
                      </div>

                      <div
                        data-layer="coal_card_cv_group"
                        className="CoalCardCvGroup self-stretch inline-flex justify-between items-center"
                      >
                        <dt className="CvLabel text-black text-sm">CV</dt>
                        <dd className="CvValue text-right text-black text-sm font-semibold">
                          {sp?.cv || "-"}
                        </dd>
                      </div>

                      <div
                        data-layer="coal_card_moisture_group"
                        className="CoalCardMoistureGroup self-stretch inline-flex justify-between items-center"
                      >
                        <dt className="MoistureLabel text-black text-sm">
                          Moisture
                        </dt>
                        <dd className="MoistureValue text-right text-black text-sm font-semibold">
                          {sp?.moisture || "-"}
                        </dd>
                      </div>

                      <div
                        data-layer="coal_card_status_group"
                        className="CoalCardStatusGroup self-stretch h-[19px] py-[7px] inline-flex justify-between items-center"
                      >
                        <dt className="StatusLabel text-black text-sm">
                          Status
                        </dt>
                        <dd
                          data-layer="coal_card_status_value_wrapper"
                          className="CoalCardStatusValueWrapper w-[87px] h-5 px-4 bg-[#e6bb30] rounded-[7px] flex justify-center items-center"
                        >
                          <span className="StatusValue text-white text-xs font-semibold">
                            {sp?.status || "-"}
                          </span>
                        </dd>
                      </div>

                      <div
                        data-layer="coal_card_schedule_group"
                        className="CoalCardScheduleGroup self-stretch inline-flex justify-start items-center gap-[26px]"
                      >
                        <dt className="EtaValue text-black text-sm">
                          ETA: {sp?.eta || "-"}
                        </dt>
                        <dd className="EtdValue text-black text-sm">
                          ETD: {sp?.etd || "-"}
                        </dd>
                      </div>
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
