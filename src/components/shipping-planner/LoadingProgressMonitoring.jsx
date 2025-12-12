import React, { useEffect, useState } from "react";
import { getLoadingProgress } from "../../services/shippingPlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";
import AnimatedNumber from "../animation/AnimatedNumber";

function LoadingProgressMonitoring() {
    const [data, setData] = useState(null);
    const { location, timePeriod, shift } = useFilterQuery();

    useEffect(() => {
        async function load() {
            try {
                const result = await getLoadingProgress({
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

    const shipments = data?.shipments || [];

    const extractNumber = (text) => {
        if (!text) return 0;
        return Number(String(text).replace(/[^\d.-]/g, "")) || 0;
    };

    return (
        <section className="LoadingProgressCard w-full p-6 bg-white rounded-3xl flex flex-col items-center gap-6 h-full">
            <div className="LoadingProgressContainer w-full flex flex-col justify-start items-start gap-6">
                <header className="HeaderContainer self-stretch inline-flex justify-start items-center gap-3">
                    <figure className="IconWrapper size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center">
                        <img className="IconVector w-[18px] h-[9px]" src="/icons/icon_progress.png" alt="Progress icon" />
                    </figure>
                    <h2 className="HeaderTitle text-black text-sm font-semibold">
                        Loading Progress Monitoring
                    </h2>
                </header>

                <ul className="LoadingProgressCardsContainer self-stretch flex flex-col gap-2.5">
                    {(shipments.length > 0 ? shipments : [1, 2]).map((ship, idx) => {
                        const progressValue = extractNumber(ship?.progress);
                        const loadedValue = extractNumber(ship?.loaded);

                        return (
                            <li
                                key={ship?.id || idx}
                                className="ProgressCardContainer px-3.5 py-[19px] bg-[#efefef] rounded-[20px] flex flex-col justify-start items-start gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                            >
                                <header className="ProgressCardHeaderContainer inline-flex justify-start items-center gap-3">
                                    <figure className="ProgressCardIconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
                                        <img className="size-[18px]" src="/icons/icon_cargo_ship.png" alt="Vessel icon" />
                                    </figure>
                                    <h3 className="ProgressCardTitle text-black text-sm font-semibold">
                                        {ship?.name || "Loading..."}
                                    </h3>
                                </header>

                                <article className="ProgressCardContentContainer self-stretch flex flex-col justify-start items-start gap-3">
                                    <dl className="w-full flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <dt className="text-black text-sm">Progress</dt>
                                            <dd className="text-black text-sm font-semibold">
                                                <AnimatedNumber value={progressValue} decimals={0} />%
                                            </dd>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <dt className="text-black text-sm">Loaded</dt>
                                            <dd className="text-black text-sm font-semibold">
                                                <AnimatedNumber value={loadedValue} decimals={0} /> TON
                                            </dd>
                                        </div>

                                        <div className="flex justify-between items-start">
                                            <dt className="text-black text-sm">Status</dt>
                                            <dd className="w-[100px] h-5 px-4 bg-[#e6bb30] rounded-[7px] flex justify-center items-center">
                                                <span className="text-white text-xs font-semibold">
                                                    {ship?.status || "-"}
                                                </span>
                                            </dd>
                                        </div>

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
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}

export default LoadingProgressMonitoring;