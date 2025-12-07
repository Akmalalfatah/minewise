import React, { useState } from "react";

function NotificationCard({ notifications = [], onCheck }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-96 px-5 py-5 bg-white rounded-3xl shadow-[0px_0px_30px_rgba(0,0,0,0.10)] flex flex-col gap-4">
      <h2 className="text-black text-sm font-semibold">Notification</h2>

      <hr className="w-80 outline outline-[0.5px] outline-stone-300" />

      {notifications.length === 0 && (
        <p className="text-gray-500 text-sm">No notifications yet.</p>
      )}

      {notifications.map((n, i) => (
        <div key={i} className="flex flex-col gap-2 w-80">
          <button
            type="button"
            onClick={() => handleToggle(i)}
            className="flex justify-between items-start w-full"
          >
            <p className="text-black text-sm leading-[18px] text-left mr-3">
              <span className="font-semibold">{n.senderName} </span>
              {n.message}
            </p>

            <img
              src="/icons/icon_expand_down.png"
              alt=""
              className={`w-2.5 h-2.5 flex-shrink-0 transition-transform ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>

          <time className="text-stone-500 text-xs">{n.timeAgo}</time>

          {openIndex === i && (
            <button
              type="button"
              onClick={() => onCheck && onCheck(n)}
              className="mt-1 w-16 h-6 px-2 py-1 bg-zinc-100 rounded-md text-black text-sm"
            >
              Check
            </button>
          )}

          {i !== notifications.length - 1 && (
            <hr className="mt-2 w-80 outline outline-[0.5px] outline-stone-300" />
          )}
        </div>
      ))}
    </section>
  );
}

export default NotificationCard;
