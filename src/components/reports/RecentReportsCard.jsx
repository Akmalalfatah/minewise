import React, { useEffect, useState } from "react";
import { getRecentReports } from "../../services/reportsService";

function RecentReportsCard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function load() {
            const result = await getRecentReports();
            setData(result);
        }
        load();
    }, []);

    if (!data) return null;

    const r = data.reports;

    return (
        <div className="w-96 h-96 p-6 bg-white/70 rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
            <div className="self-stretch flex flex-col justify-start items-start gap-3.5">

                <div className="inline-flex justify-start items-center gap-3">
                    <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center">
                        <img className="w-4 h-4" src="src/icons/icon_replay.png" />
                    </div>
                    <div className="text-black text-sm font-semibold font-['Inter']">Recent Reports</div>
                </div>

                <div className="text-black/60 text-sm font-normal font-['Inter']">
                    Previously generated reports
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-3">

                    {r.slice(0, 3).map((item, index) => (
                        <div key={index} className="self-stretch h-24 px-2.5 py-2 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-center gap-2.5">
                            <div className="w-96 inline-flex justify-between items-start">
                                <div className="w-40 inline-flex flex-col justify-start items-start gap-3.5">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="text-black text-sm font-normal font-['Inter']">{item.title}</div>
                                        <div className="text-black/60 text-xs font-normal font-['Inter']">{item.date}</div>
                                    </div>

                                    <div className="inline-flex justify-start items-center gap-1.5">
                                        <div className="w-10 h-4 px-1.5 py-0.5 rounded-[5px] outline outline-1 outline-slate-300 flex justify-center items-center">
                                            <div className="text-black/60 text-[10px] font-semibold font-['Inter']">
                                                {item.frequency}
                                            </div>
                                        </div>
                                        <div className="w-16 h-4 px-2.5 py-0.5 bg-blue-950 rounded-[5px] flex justify-center items-center">
                                            <div className="text-white text-[10px] font-semibold font-['Inter']">
                                                Download
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-20 h-5 px-1.5 py-0.5 bg-green-500 rounded-[5px] flex justify-center items-center">
                                    <div className="text-white text-[10px] font-semibold font-['Inter']">
                                        {item.status}
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

export default RecentReportsCard;
