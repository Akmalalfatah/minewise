function ExportTemplatesCard({
template1Name,
template2Name,
template3Name,
}) {
return (
<div className="w-96 h-96 p-6 bg-white/70 rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
    <div className="self-stretch h-72 flex flex-col justify-start items-start gap-5">

    <div className="inline-flex justify-start items-center gap-3">
        <div
        data-layer="icon_wrapper"
        className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center"
        >
        <img
            data-layer="icon_export"
            className="w-4 h-4"
            src="src/icons/icon_export.png"
        />
        </div>
        <div className="text-black text-sm font-semibold font-['Inter']">
        Export Templates
        </div>
    </div>

    <div className="self-stretch flex flex-col justify-center items-start gap-4">
        <div className="text-black/60 text-sm font-normal font-['Inter']">
        Quick access to pre-configured reports
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-3.5">

        <div className="self-stretch h-14 px-6 py-4 bg-white rounded-xl outline outline-1 outline-slate-300 flex flex-col justify-center">
            <div className="inline-flex justify-start items-center gap-3">
            <img
                data-layer="file_icon"
                className="w-4 h-4"
                src="src/icons/file_icon.png"
            />
            <div className="text-black text-sm font-semibold font-['Inter']">
                {template1Name}
            </div>
            </div>
        </div>

        <div className="self-stretch h-14 px-6 py-4 bg-white rounded-xl outline outline-1 outline-slate-300 flex flex-col justify-center">
            <div className="inline-flex justify-start items-center gap-3">
            <img
                data-layer="file_icon"
                className="w-4 h-4"
                src="src/icons/file_icon.png"
            />
            <div className="text-black text-sm font-semibold font-['Inter']">
                {template2Name}
            </div>
            </div>
        </div>

        <div className="self-stretch h-14 px-6 py-4 bg-white rounded-xl outline outline-1 outline-slate-300 flex flex-col justify-center">
            <div className="inline-flex justify-start items-center gap-3">
            <img
                data-layer="file_icon"
                className="w-4 h-4"
                src="src/icons/file_icon.png"
            />
            <div className="text-black text-sm font-semibold font-['Inter']">
                {template3Name}
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
