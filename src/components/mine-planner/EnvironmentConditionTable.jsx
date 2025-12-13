import React, { useEffect, useState } from "react";
import { getEnvironmentConditions } from "../../services/minePlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";
import AnimatedNumber from "../animation/AnimatedNumber";

function EnvironmentConditionTable() {
    const [data, setData] = useState(null);
    const { location, timePeriod, shift } = useFilterQuery();

    useEffect(() => {
        async function load() {
            try {
                const result = await getEnvironmentConditions({
                    location,
                    timePeriod,
                    shift,
                });
                setData(result);
            } catch (error) {
                console.error("Failed to load environment conditions:", error);
                setData(null);
            }
        }

        load();
    }, [location, timePeriod, shift]);
    const sourceLoc = data?.source_location ?? null;
    const area = data?.area ?? sourceLoc ?? "-";
    const loc = data?.location ?? sourceLoc ?? "-";
    const rainfall = data?.rainfall ?? "-";
    const temperature = data?.temperature ?? "-";
    const humidity = data?.humidity ?? "-";
    const wind = data?.wind ?? "-";
    const pressure = data?.pressure ?? "-";
    const visibility = data?.visibility ?? "-";
    const lightning =
        typeof data?.lightning === "boolean"
            ? data.lightning
                ? "Detected"
                : "0"
            : data?.lightning ?? "-";
    const updated = data?.updated ?? "-";

    const risk = data?.risk || {
        score: "-",
        title: "No risk data available",
        subtitle: "AI risk analysis is not available for the current filter.",
    };

    const hasNumericRiskScore = typeof risk.score === "number";

    return (
        <section
            data-layer="environment_condition_card"
            aria-label="Environment conditions and weather-based risk"
            className="EnvironmentConditionCard w-full max-w-[360px] min-h-[492px] p-6 bg-white rounded-3xl flex flex-col justify-center items-center gap-2.5"
        >
            <div
                data-layer="environment_condition_container"
                className="EnvironmentConditionContainer self-stretch inline-flex flex-col justify-center items-center gap-[7px]"
            >
                <div
                    data-layer="content_container"
                    className="ContentContainer self-stretch flex flex-col justify-start items-start gap-3"
                >
                    <header
                        data-layer="header_container"
                        className="HeaderContainer self-stretch flex flex-col justify-start items-start gap-2.5"
                    >
                        <div
                            data-layer="header_left_group"
                            className="HeaderLeftGroup relative inline-flex justify-between items-center gap-3"
                        >
                            <div className="inline-flex items-center gap-3">
                                <div
                                    data-layer="icon_wrapper"
                                    className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center"
                                >
                                    <img
                                        data-layer="icon_environment"
                                        className="IconEnvironment size-[18px]"
                                        src="/icons/icon_environment.png"
                                        alt="Environment icon"
                                    />
                                </div>
                                <h2
                                    data-layer="environment_condition_title"
                                    className="EnvironmentConditionTitle text-black text-sm font-semibold"
                                >
                                    Environment Conditions
                                </h2>
                            </div>
                        </div>
                    </header>

                    {/* AREA ROW */}
                    <section
                        data-layer="area_row_container"
                        aria-label="Environment area"
                        className="AreaRowContainer self-stretch inline-flex justify-between items-center"
                    >
                        <span
                            data-layer="area_label"
                            className="AreaLabel text-black text-xs font-semibold"
                        >
                            Area:
                        </span>
                        <span
                            data-layer="area_value"
                            className="AreaValue text-right text-black text-xs font-semibold"
                        >
                            {area}
                        </span>
                    </section>

                    <hr
                        data-layer="divider_top"
                        className="DividerTop self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
                    />

                    {/* INFO ROWS */}
                    <section
                        data-layer="info_rows_container"
                        aria-label="Environment condition details"
                        className="InfoRowsContainer self-stretch inline-flex justify-between items-start gap-6"
                    >
                        <div
                            data-layer="label_column"
                            className="LabelColumn inline-flex flex-col justify-start items-start gap-3 text-black text-sm font-semibold"
                        >
                            <span>Location</span>
                            <span>Rainfall</span>
                            <span>Temperature</span>
                            <span>Humidity</span>
                            <span>Wind</span>
                            <span>Pressure</span>
                            <span>Visibility</span>
                            <span>Lightning</span>
                            <span>Updated</span>
                        </div>

                        <div
                            data-layer="value_column"
                            className="ValueColumn inline-flex flex-col justify-start items-end gap-3 text-black text-sm font-semibold"
                        >
                            <span>{loc}</span>
                            <span>{rainfall}</span>
                            <span>{temperature}</span>
                            <span>{humidity}</span>
                            <span>{wind}</span>
                            <span>{pressure}</span>
                            <span>{visibility}</span>
                            <span>{lightning}</span>
                            <span>{updated}</span>
                        </div>
                    </section>
                </div>
            </div>

            <hr
                data-layer="divider_bottom"
                className="DividerBottom self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
            />

            {/* RISK SECTION */}
            <section
                data-layer="risk_section_container"
                aria-label="Weather-based risk"
                className="RiskSectionContainer self-stretch flex flex-col justify-start items-start gap-2.5"
            >
                <h3
                    data-layer="risk_section_title"
                    className="RiskSectionTitle text-black text-sm font-semibold"
                >
                    Weather-Based Risk
                </h3>

                <div
                    data-layer="risk_content_container"
                    className="RiskContentContainer self-stretch inline-flex justify-start items-center gap-[18px]"
                >
                    <div
                        data-layer="risk_score_container"
                        className="RiskScoreContainer w-[105px] h-14 px-2.5 py-[13px] bg-[#ffedef] rounded-[10px] outline outline-[#ffd4c7]"
                    >
                        <p className="RiskScoreValue text-[#8f0b09] text-2xl font-semibold">
                            {hasNumericRiskScore ? (
                                <>
                                    <AnimatedNumber value={risk.score} decimals={0} />
                                    <span>/100</span>
                                </>
                            ) : (
                                <>{risk.score}</>
                            )}
                        </p>
                    </div>

                    <div
                        data-layer="risk_description_container"
                        className="RiskDescriptionContainer flex-1 flex flex-col gap-0.5"
                    >
                        <p className="RiskDescriptionMain text-black text-xs font-semibold">
                            {risk.title}
                        </p>
                        <p className="RiskDescriptionSub text-black/60 text-xs">
                            {risk.subtitle}
                        </p>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default EnvironmentConditionTable;