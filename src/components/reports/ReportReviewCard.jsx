import React, { useEffect, useState } from "react";
import { getReviewPanelData } from "../../services/reportsService";

function ReportReviewCard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function load() {
            const result = await getReviewPanelData();
            setData(result);
        }
        load();
    }, []);

    if (!data) return null;

    return (
        <div className="w-[1360px] h-[535px] px-6 py-8 bg-gradient-to-br from-slate-700 to-blue-950 rounded-[20px] inline-flex flex-col justify-center items-center gap-2.5">
            <div className="self-stretch h-[471px] flex flex-col justify-start items-start gap-6">

                <div className="w-72 inline-flex justify-start items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex justify-center items-center">
                        <img className="w-4 h-4" src="src/icons/report_review_icon.png" />
                    </div>
                    <div className="w-60 text-white text-sm font-semibold font-['Inter']">Report Review</div>
                </div>

                <div className="self-stretch h-96 inline-flex justify-center items-center gap-6 flex-wrap content-center">

                    <div className="w-[646px] h-48 p-6 bg-white/20 rounded-[20px] outline outline-1 outline-stone-500 flex flex-col gap-3">
                        <div className="w-[581px] flex flex-col gap-3">
                            <div className="text-white text-sm font-semibold font-['Inter']">Executive Summary</div>
                            <div className="text-white text-xs font-normal font-['Inter']">{data.executive_summary}</div>
                        </div>
                    </div>

                    <div className="w-[636px] h-48 p-6 bg-white/20 rounded-[20px] outline outline-1 outline-stone-500 flex flex-col gap-3">
                        <div className="w-[581px] flex flex-col gap-3">
                            <div className="text-white text-sm font-semibold font-['Inter']">AI Recommendations</div>
                            <div className="text-white text-xs font-normal font-['Inter']">{data.ai_recommendations}</div>
                        </div>
                    </div>

                    <div className="w-[646px] h-48 p-6 bg-white/20 rounded-[20px] outline outline-1 outline-stone-500 flex flex-col gap-3">
                        <div className="w-[581px] flex flex-col gap-3">
                            <div className="text-white text-sm font-semibold font-['Inter']">Operational Overview</div>
                            <div className="text-white text-xs font-normal font-['Inter']">{data.operational_overview}</div>
                        </div>
                    </div>

                    <div className="w-[636px] h-48 p-6 bg-white/20 rounded-[20px] outline outline-1 outline-stone-500 flex flex-col gap-3">
                        <div className="w-[581px] flex flex-col gap-3">
                            <div className="text-white text-sm font-semibold font-['Inter']">Cost Analysis</div>
                            <div className="text-white text-xs font-normal font-['Inter']">{data.cost_analysis}</div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default ReportReviewCard;
