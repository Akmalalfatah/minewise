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
    <section
      data-layer="loading_progress_card"
      className="LoadingProgressCard w-[505px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-6"
    >
      <div
        data-layer="loading_progress_container"
        className="LoadingProgressContainer w-[463px] flex flex-col justify-start items-start gap-6"
      >
        {/* Header */}
        <header
          data-layer="header_container"
          className="HeaderContainer self-stretch inline-flex justify-between items-center"
        >
          <div
            data-layer="header_left_group"
            className="HeaderLeftGroup inline-flex justify-start items-center gap-3"
          >
            <figure
              data-layer="icon_wrapper"
              className="IconWrapper size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center"
            >
              <img
                className="IconVector w-[18px] h-[9px]"
                src="/icons/icon_progress.png"
                alt="Progress icon"
              />
            </figure>

            <h2 className="HeaderTitle text-black text-sm font-semibold">
              Loading Progress Monitoring
            </h2>
          </div>

          <button
            type="button"
            onClick={onSeeMore}
            className="SeeMoreContainer inline-flex justify-start items-center gap-1"
          >
            <span className="SeeMoreLabel text-black text-xs font-semibold">
              See More
            </span>
            <span className="SeeMoreIcon size-6 relative inline-block">
              <span className="SeeMoreIconVector w-1.5 h-3 absolute rotate-180 border-2 border-black left-[15px] top-[18px]" />
            </span>
          </button>
        </header>

        {/* Progress List */}
        <ul
          data-layer="loading_progress_cards_container"
          className="LoadingProgressCardsContainer self-stretch flex flex-col gap-2.5"
        >
          {(shipments.length > 0 ? shipments : [1, 2]).map((ship, idx) => (
            <li
              key={ship?.id || idx}
              className="ProgressCardContainer px-3.5 py-[19px] bg-[#efefef] rounded-[20px] flex flex-col justify-start items-start gap-3"
            >
              {/* Card Header */}
              <header className="ProgressCardHeaderContainer inline-flex justify-start items-center gap-3">
                <figure className="ProgressCardIconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
                  <img
                    className="IconCargoShip size-[18px]"
                    src="/icons/icon_cargo_ship.png"
                    alt="Vessel icon"
                  />
                </figure>

                <h3 className="ProgressCardTitle text-black text-sm font-semibold">
                  {ship?.name || "Loading..."}
                </h3>
              </header>

              {/* Card Content */}
              <article className="ProgressCardContentContainer self-stretch flex flex-col justify-start items-start gap-3">

                <dl className="w-full flex flex-col gap-3">
                  {/* Progress */}
                  <div className="flex justify-between items-center">
                    <dt className="text-black text-sm">Progress</dt>
                    <dd className="text-black text-sm font-semibold">{ship?.progress || "-"}</dd>
                  </div>

                  {/* Loaded */}
                  <div className="flex justify-between items-center">
                    <dt className="text-black text-sm">Loaded</dt>
                    <dd className="text-black text-sm font-semibold">{ship?.loaded || "-"}</dd>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between items-start">
                    <dt className="text-black text-sm">Status:</dt>
                    <dd className="ProgressCardStatusValueWrapper w-[87px] h-5 px-4 bg-[#e6bb30] rounded-[7px] flex justify-center items-center">
                      <span className="StatusValue text-white text-xs font-semibold">
                        {ship?.status || "-"}
                      </span>
                    </dd>
                  </div>

                  {/* ETA + ETD */}
                  <div className="flex justify-between items-center">
                    <dt className="text-black text-sm">ETA</dt>
                    <dd className="text-black text-sm">{ship?.eta || "-"}</dd>
                  </div>

                  <div className="flex justify-between items-center">
                    <dt className="text-black text-sm">ETD</dt>
                    <dd className="text-black text-sm">{ship?.etd || "-"}</dd>
                  </div>
                </dl>

              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default LoadingProgressMonitoring;
