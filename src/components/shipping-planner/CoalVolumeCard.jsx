import React, { useEffect, useState } from "react";
import { getCoalVolumeReadyToShip } from "../../services/shippingPlannerService";

function CoalVolumeCard({ onSeeMore }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getCoalVolumeReadyToShip();
      setData(result);
    }
    load();
  }, []);

  const stockpiles = data?.stockpiles || [];

  return (
    <div
      data-layer="coal_volume_card"
      className="CoalVolumeCard w-[668px] h-[336px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="coal_volume_container"
        className="CoalVolumeContainer self-stretch h-[290px] flex flex-col justify-start items-start gap-6"
      >

        <div
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
            <div
              data-layer="header_title"
              className="HeaderTitle text-black text-base font-semibold"
            >
              Coal Volume Ready to Ship
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
              data-layer="see_more_icon"
              className="SeeMoreIcon size-6 relative"
            >
              <div
                data-layer="see_more_icon_vector"
                className="SeeMoreIconVector w-1.5 h-3 left-[15px] top-[18px] absolute origin-top-left rotate-180 border-2 border-black"
              />
            </div>
          </button>
        </div>

        <div
          data-layer="coal_cards_container"
          className="CoalCardsContainer w-[620px] h-[234px] inline-flex justify-start items-center gap-3"
        >
          {(stockpiles.length > 0 ? stockpiles.slice(0, 2) : [1, 2]).map(
            (sp, idx) => (
              <div
                key={sp?.id || idx}
                data-layer="coal_card_container"
                className="CoalCardContainer w-[304px] h-[234px] px-[18px] py-5 bg-[#efefef] rounded-[20px] inline-flex flex-col justify-center items-center gap-2.5"
              >
                <div
                  data-layer="coal_card_header_wrapper"
                  className="CoalCardHeaderWrapper self-stretch h-[196px] flex flex-col justify-center items-start gap-3"
                >

                  <div
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

                    <div
                      data-layer="coal_card_title"
                      className="CoalCardTitle text-black text-sm font-semibold"
                    >
                      {sp?.name || "Loading..."}
                    </div>
                  </div>

                  <div
                    data-layer="coal_card_content_container"
                    className="CoalCardContentContainer self-stretch h-[152px] flex flex-col justify-center items-start gap-3"
                  >
                    <div
                      data-layer="coal_card_volume_group"
                      className="CoalCardVolumeGroup self-stretch inline-flex justify-between items-center"
                    >
                      <div className="VolumeLabel text-black text-sm">
                        Volume
                      </div>
                      <div className="VolumeValue text-black text-sm font-semibold">
                        {sp?.volume || "-"}
                      </div>
                    </div>

                    <div
                      data-layer="coal_card_cv_group"
                      className="CoalCardCvGroup self-stretch inline-flex justify-between items-center"
                    >
                      <div className="CvLabel text-black text-sm">CV</div>
                      <div className="CvValue text-right text-black text-sm font-semibold">
                        {sp?.cv || "-"}
                      </div>
                    </div>

                    <div
                      data-layer="coal_card_moisture_group"
                      className="CoalCardMoistureGroup self-stretch inline-flex justify-between items-center"
                    >
                      <div className="MoistureLabel text-black text-sm">
                        Moisture
                      </div>
                      <div className="MoistureValue text-right text-black text-sm font-semibold">
                        {sp?.moisture || "-"}
                      </div>
                    </div>

                    <div
                      data-layer="coal_card_status_group"
                      className="CoalCardStatusGroup self-stretch h-[19px] py-[7px] inline-flex justify-between items-center"
                    >
                      <div className="StatusLabel text-black text-sm">
                        Status
                      </div>
                      <div
                        data-layer="coal_card_status_value_wrapper"
                        className="CoalCardStatusValueWrapper w-[87px] h-5 px-4 bg-[#e6bb30] rounded-[7px] flex justify-center items-center"
                      >
                        <div className="StatusValue text-white text-xs font-semibold">
                          {sp?.status || "-"}
                        </div>
                      </div>
                    </div>

                    <div
                      data-layer="coal_card_schedule_group"
                      className="CoalCardScheduleGroup self-stretch inline-flex justify-start items-center gap-[26px]"
                    >
                      <div className="EtaValue text-black text-sm">
                        ETA: {sp?.eta || "-"}
                      </div>
                      <div className="EtdValue text-black text-sm">
                        ETD: {sp?.etd || "-"}
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

export default CoalVolumeCard;
