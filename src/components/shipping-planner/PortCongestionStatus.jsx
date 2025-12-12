import React, { useEffect, useState } from "react";
import { getPortCongestionStatus } from "../../services/shippingPlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function PortCongestionStatus() {
    const [data, setData] = useState(null);
    const filters = useFilterQuery();

    useEffect(() => {
        async function load() {
            try {
                const result = await getPortCongestionStatus(filters);
                setData(result);
            } catch (err) {
                console.error("Failed to load port congestion status:", err);
            }
        }
        load();
    }, [filters.location, filters.timePeriod, filters.shift]);

    const updatedText = data?.updatedText || "Updated...";
    const shipsLoading = data?.shipsLoading || [];
    const shipsWaiting = data?.shipsWaiting || [];
    const shipsCompletedText = data?.shipsCompletedText || "-";
    const congestionLevel = data?.congestionLevel || "-";
    const operationalNote = data?.operationalNote || "-";

    return (
        <section
            data-layer="port_congestion_status_card"
            className="PortCongestionStatusCard w-full p-6 bg-white rounded-3xl flex flex-col items-center gap-2.5 h-full"
        >
            <div
                data-layer="card_container"
                className="CardContainer self-stretch flex flex-col justify-start items-start gap-6"
            >
                <header
                    data-layer="header_left_group"
                    className="HeaderLeftGroup flex flex-col justify-start items-start gap-2.5"
                >
                    <div className="IconWrapper inline-flex justify-start items-center gap-3">
                        <figure
                            data-layer="icon_background_container"
                            className="IconBackgroundContainer size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center"
                        >
                            <img
                                className="IconActivity size-[22px]"
                                src="/icons/icon_activity.png"
                                alt="Activity icon"
                            />
                        </figure>

                        <h2
                            data-layer="port_congestion_title"
                            className="PortCongestionTitle text-black text-sm font-semibold"
                        >
                            Port Congestion Status
                        </h2>
                    </div>
                </header>

                <p
                    data-layer="updated_timestamp_text"
                    className="UpdatedTimestampText self-stretch text-[#666666] text-sm"
                >
                    {updatedText}
                </p>

                <article
                    data-layer="content_container"
                    className="ContentContainer self-stretch px-[19px] py-5 bg-[#efefef] rounded-[20px] flex flex-col justify-center items-center gap-2.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                    <div
                        data-layer="activity_card_container"
                        className="ActivityCardContainer w-full flex flex-col justify-start items-start gap-[17px]"
                    >
                        <header
                            data-layer="activity_header_container"
                            className="ActivityHeaderContainer self-stretch flex flex-col justify-start items-start gap-3"
                        >
                            <h3 className="ActivityHeaderTitle text-black text-xs font-semibold">
                                Current Activity
                            </h3>
                            <hr className="ActivityHeaderDivider self-stretch h-0 outline outline-[0.50px] outline-black/25" />
                        </header>

                        <div
                            data-layer="activity_content_container"
                            className="ActivityContentContainer self-stretch flex flex-col justify-start items-start gap-6"
                        >
                            <section className="ShipsLoadingWaitingGroup self-stretch flex justify-between items-start">
                                <div className="ShipsLoadingGroup w-[233px] flex flex-col gap-1.5">
                                    <h4 className="ShipsLoadingLabel text-black text-sm font-semibold">
                                        Ships Loading:
                                    </h4>

                                    <ul className="ShipsLoadingValue text-black text-sm">
                                        {shipsLoading.length > 0 ? (
                                            shipsLoading.map((ship, index) => (
                                                <li key={ship.id || index}>{ship.name || "-"}</li>
                                            ))
                                        ) : (
                                            <li>(No active loading)</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="ShipsWaitingGroup w-[234px] flex flex-col gap-1.5">
                                    <h4 className="ShipsWaitingLabel text-black text-sm font-semibold">
                                        Ships Waiting:
                                    </h4>

                                    <ul className="ShipsWaitingValue text-black text-sm">
                                        {shipsWaiting.length > 0 ? (
                                            shipsWaiting.map((ship, index) => (
                                                <li key={ship.id || index}>
                                                    {ship.name || "-"} — ETA: {ship.eta || "-"}
                                                </li>
                                            ))
                                        ) : (
                                            <li>(No ships waiting)</li>
                                        )}
                                    </ul>
                                </div>
                            </section>

                            <section className="ShipsCompletedGroup flex flex-col gap-1.5">
                                <dl className="flex gap-2 items-center">
                                    <dt className="ShipsCompletedLabel text-black text-sm font-semibold">
                                        Ships Completed:
                                    </dt>
                                    <dd className="ShipsCompletedValue text-black text-sm">
                                        {shipsCompletedText}
                                    </dd>
                                </dl>
                            </section>

                            <section className="CongestionLevelGroup flex gap-2">
                                <dt className="CongestionLevelLabel text-black text-sm font-semibold">
                                    Congestion Level:
                                </dt>
                                <dd className="CongestionLevelValue text-[#c30012] text-sm font-semibold">
                                    {congestionLevel}
                                </dd>
                            </section>

                            <section className="OperationalNoteGroup flex flex-col gap-1">
                                <dt className="OperationalNoteLabel text-black text-sm font-semibold">
                                    Operational Note:
                                </dt>
                                <dd className="OperationalNoteText text-black text-sm w-full md:w-[513px]">
                                    {operationalNote}
                                </dd>
                            </section>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
}

export default PortCongestionStatus;