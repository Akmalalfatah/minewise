function ScheduledReportsCard() {
    return (
        <div className="w-96 h-96 p-6 bg-gradient-to-br from-slate-700 to-blue-950 rounded-3xl inline-flex flex-col justify-center items-start gap-2.5">
            <div className="w-96 h-80 flex flex-col justify-center items-start gap-3">

                <div className="inline-flex justify-start items-center gap-3">
                    <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center gap-2.5">
                        <img className="w-4 h-4" src="https://placehold.co/18x18" />
                    </div>
                    <div className="justify-start text-white text-sm font-semibold font-['Inter']">
                        Scheduled Reports
                    </div>
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-6">

                    <div className="self-stretch justify-start text-white text-sm font-normal font-['Inter']">
                        Automate report generation and distribution
                    </div>

                    <div className="self-stretch flex flex-col justify-center items-center gap-6">

                        <div className="self-stretch flex flex-col justify-start items-start gap-3.5">

                            <div className="self-stretch h-20 px-2.5 py-2 bg-white/20 rounded-[10px] flex flex-col justify-center items-center gap-2.5">
                                <div className="w-96 h-14 inline-flex justify-between items-center">
                                    <div className="w-32 inline-flex flex-col justify-start items-start gap-0.5">
                                        <div className="self-stretch justify-start text-white text-sm font-semibold font-['Inter']">
                                            Daily Operations
                                        </div>
                                        <div className="self-stretch h-3.5 justify-start text-white text-xs font-normal font-['Inter']">
                                            Every day at 6:00 AM
                                        </div>
                                    </div>
                                    <div className="w-12 h-5 px-1 py-0.5 bg-green-500 rounded-[5px] flex justify-center items-center gap-2.5">
                                        <div className="justify-start text-white text-[10px] font-semibold font-['Inter']">
                                            Active
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="self-stretch h-20 px-2.5 py-2 bg-white/20 rounded-[10px] flex flex-col justify-center items-center gap-2.5">
                                <div className="w-96 inline-flex justify-between items-center">
                                    <div className="w-40 inline-flex flex-col justify-start items-start gap-[3px]">
                                        <div className="self-stretch h-4 justify-start text-white text-sm font-semibold font-['Inter']">
                                            Weekly Summary
                                        </div>
                                        <div className="self-stretch h-3.5 justify-start text-white/60 text-xs font-normal font-['Inter']">
                                            Every Monday at 6:00 AM
                                        </div>
                                    </div>
                                    <div className="w-12 h-5 px-1 py-0.5 bg-green-500 rounded-[5px] flex justify-center items-center gap-2.5">
                                        <div className="justify-start text-white text-[10px] font-semibold font-['Inter']">
                                            Active
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="self-stretch h-9 px-4 py-2 bg-gray-100 rounded-[10px] flex flex-col justify-center items-center gap-2.5">
                            <div className="inline-flex justify-center items-center gap-3">
                                <div className="justify-start text-black text-sm font-normal font-['Font_Awesome_5_Free']">
                                    calendar
                                </div>
                                <div className="justify-start text-gray-800 text-sm font-semibold font-['Inter']">
                                    Manage Schedules
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default ScheduledReportsCard;
