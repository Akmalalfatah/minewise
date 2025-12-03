import React from "react";

function NotificationCard({ notifications = [], checkLabel = "Check" }) {
return (
<div
    data-layer="notification_card"
    className="NotificationCard w-96 h-56 px-5 py-5 bg-white rounded-3xl shadow-[0px_0px_30px_0px_rgba(0,0,0,0.10)] inline-flex flex-col justify-between items-start"
>
    <div className="text-black text-sm font-semibold font-['Inter']">
    Notification
    </div>

    <div className="w-80 h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-stone-300" />

    <div className="w-80 flex flex-col justify-start items-start gap-2.5">
    {notifications[0] && (
        <>
        <div className="self-stretch inline-flex justify-start items-center gap-5">
            <div className="w-72 inline-flex flex-col justify-start items-start gap-2">
            <div className="text-black text-sm font-normal font-['Inter']">
                <span className="font-semibold">
                {notifications[0].senderName}{" "}
                </span>
                {notifications[0].message}
            </div>
            <div className="text-stone-500 text-xs font-normal font-['Inter']">
                {notifications[0].timeAgo}
            </div>
            </div>

            <img
            data-layer="icon_expand_down"
            className="w-1.5 h-3 origin-top-left rotate-90"
            src="src/icons/icon_expand_down.png"
            alt="expand"
            />
        </div>

        <div className="w-16 h-6 px-2 py-1 bg-zinc-100 rounded-[5px] inline-flex justify-center items-center">
            <div className="text-black text-sm font-normal font-['Inter']">
            {checkLabel}
            </div>
        </div>
        </>
    )}
    </div>

    <div className="w-80 h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-stone-300" />

    {notifications[1] && (
    <div className="w-80 h-10 inline-flex justify-start items-center gap-5">
        <div className="w-72 inline-flex flex-col justify-start items-start gap-2">
        <div className="text-black text-sm font-normal font-['Inter']">
            <span className="font-semibold">
            {notifications[1].senderName}{" "}
            </span>
            {notifications[1].message}
        </div>
        <div className="text-stone-500 text-xs font-normal font-['Inter']">
            {notifications[1].timeAgo}
        </div>
        </div>

        <img
        data-layer="icon_expand_down"
        className="w-1.5 h-3 origin-top-left -rotate-90"
        src="src/icons/icon_expand_down.png"
        alt="expand"
        />
    </div>
    )}
</div>
);
}

<<<<<<< HEAD
export default NotificationCard;
=======
export default NotificationCard;
>>>>>>> athira-febe
