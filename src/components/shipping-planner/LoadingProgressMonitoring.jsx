import React, { useEffect, useState } from "react";
import { getLoadingProgress } from "../../services/shippingPlannerService";

function LoadingProgressMonitoring({ onSeeMore }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getLoadingProgress();
      setData(result);
    }
    load();
  }, []);

  const shipments = data?.shipments || [];

  return (
    <div
      data-layer="loading_progress_card"
      className="LoadingProgressCard w-[505px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-6"
    >
      <div
        data-layer="loading_progress_container"
        className="LoadingProgressContainer w-[463px] flex flex-col justify-start items-start gap-6"
      >

        <div
          data-layer="header_container"
          className="HeaderContainer self-stretch inline-flex justify-between items-center"
        >
          <div
            data-layer="header_left_group"
            className="HeaderLeftGroup inline-flex justify-start items-center gap-3"
          >
            <div
              data-layer="icon_wrapper"
              className="IconWrapper size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center"
            >
              <div className="IconProgress size-[18px] relative overflow-hidden">
                <img
                  className="IconVector w-[18px] h-[9px] left-0 top-[4.50px] absolute"
                  src="/icons/icon_progress.png"
                  alt="Progress icon"
                />
              </div>
            </div>
            <div className="HeaderTitle text-black text-sm font-semibold">
              Loading Progress Monitoring
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
            <div className="SeeMoreIcon size-6 relative">
              <div className="SeeMoreIconVector w-1.5 h-3 left-[15px] top-[18px] absolute origin-top-left rotate-180 border-2 border-black" />
            </div>
          </button>
        </div>

        <div
          data-layer="loading_progress_cards_container"
          className="LoadingProgressCardsContainer self-stretch flex flex-col gap-2.5"
        >
          {(shipments.length > 0 ? shipments : [1, 2]).map((ship, idx) => (
            <div
              key={ship?.id || idx}
              className="ProgressCardContainer px-3.5 py-[19px] bg-[#efefef] rounded-[20px] flex flex-col justify-start items-start gap-3"
            >
              <div className="ProgressCardHeaderContainer inline-flex justify-start items-center gap-3">
                <div className="ProgressCardIconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
                  <img
                    className="IconCargoShip size-[18px]"
                    src="/icons/icon_cargo_ship.png"
                    alt="Vessel icon"
                  />
                </div>
                <div className="ProgressCardTitle text-black text-sm font-semibold">
                  {ship?.name || "Loading..."}
                </div>
              </div>

              <div className="ProgressCardContentContainer self-stretch flex flex-col justify-start items-start gap-3">
                <div className="ProgressCardProgressGroup self-stretch inline-flex justify-between items-center">
                  <div className="ProgressLabel text-black text-sm">Progress</div>
                  <div className="ProgressValue text-black text-sm font-semibold">
                    {ship?.progress || "-"}
                  </div>
                </div>

                <div className="ProgressCardLoadedGroup self-stretch inline-flex justify-between items-center">
                  <div className="LoadedLabel text-black text-sm">Loaded</div>
                  <div className="LoadedValue text-right text-black text-sm font-semibold">
                    {ship?.loaded || "-"}
                  </div>
                </div>

                <div className="ProgressCardStatusGroup self-stretch inline-flex justify-between items-start">
                  <div className="StatusLabel text-black text-sm">Status:</div>
                  <div className="ProgressCardStatusValueWrapper w-[87px] h-5 px-4 bg-[#e6bb30] rounded-[7px] flex justify-center items-center">
                    <div className="StatusValue text-white text-xs font-semibold">
                      {ship?.status || "-"}
                    </div>
                  </div>
                </div>

                <div className="ProgressCardScheduleGroup self-stretch flex flex-col justify-start items-start gap-[13px]">
                  <div className="ProgressCardScheduleDetailWrapper self-stretch inline-flex justify-between items-center">
                    <div className="EtaValue text-black text-sm">
                      ETA: {ship?.eta || "-"}
                    </div>
                    <div className="EtdValue text-black text-sm">
                      ETD: {ship?.etd || "-"}
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

export default LoadingProgressMonitoring;
