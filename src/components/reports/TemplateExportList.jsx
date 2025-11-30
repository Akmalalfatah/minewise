function ExportTemplatesCard() {
    return (
        <div className="w-96 h-96 p-6 bg-white/70 rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
            <div className="self-stretch h-72 flex flex-col justify-start items-start gap-5">

                <div className="inline-flex justify-start items-center gap-3">
                    <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center gap-2.5">
                        <img className="w-4 h-4" src="https://placehold.co/18x18" />
                    </div>
                    <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                        Export Templates
                    </div>
                </div>

                <div className="self-stretch flex flex-col justify-center items-start gap-4">

                    <div className="self-stretch justify-start text-black/60 text-sm font-normal font-['Inter']">
                        Quick access to pre-configured reports
                    </div>

                    <div className="self-stretch flex flex-col justify-start items-start gap-3.5">

                        <div className="self-stretch h-14 px-6 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                            <div className="inline-flex justify-start items-center gap-3">
                                <div className="justify-start text-black text-base font-normal font-['Font_Awesome_5_Free']">
                                    file
                                </div>
                                <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                                    Executive Briefing
                                </div>
                            </div>
                        </div>

                        <div className="self-stretch h-14 px-6 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                            <div className="inline-flex justify-start items-center gap-3">
                                <div className="justify-start text-black text-base font-normal font-['Font_Awesome_5_Free']">
                                    file
                                </div>
                                <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                                    Technical Analysis
                                </div>
                            </div>
                        </div>

                        <div className="self-stretch h-14 px-6 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                            <div className="inline-flex justify-start items-center gap-3">
                                <div className="justify-start text-black text-base font-normal font-['Font_Awesome_5_Free']">
                                    file
                                </div>
                                <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                                    Safety Report
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default ExportTemplatesCard;
