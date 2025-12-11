import React, { useState, useEffect } from "react";
import { notificationStore } from "../../store/notificationStore";
import { downloadRecentReport } from "../../services/reportService";

function formatTimeAgo(createdAt, now) {
  if (!createdAt) return "";
  const diffMs = now - createdAt;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

function NotificationCard({ notifications = [], onClearAll }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleCheck = async (notif) => {
    try {
      if (notif.reportUrl) {
        window.open(notif.reportUrl, "_blank");
      } else if (notif.reportId) {
        const newWindow = window.open("", "_blank");
        const { blob, filename } = await downloadRecentReport(notif.reportId);
        const url = window.URL.createObjectURL(blob);

        if (newWindow) {
          newWindow.location.href = url;
        } else {
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      }
    } catch (err) {
      console.error("Error opening report:", err);
    } finally {
      notificationStore.getState().removeNotification(notif.id);
    }
  };

  return (
    <section className="w-90 px-5 py-5 bg-white rounded-3xl shadow-[0px_0px_30px_rgba(0,0,0,0.10)] flex flex-col gap-4">
      <div className="flex items-center justify-between w-80">
        <h2 className="text-black text-sm font-semibold">Notification</h2>
        {notifications.length > 0 && (
          <button
            type="button"
            className="text-xs text-red-500 font-medium"
            onClick={onClearAll}
          >
            Clear All
          </button>
        )}
      </div>

      <hr className="w-80 outline outline-[0.5px] outline-stone-300" />

      {notifications.length === 0 && (
        <p className="text-gray-500 text-sm">No notifications yet.</p>
      )}

      {notifications.map((n, i) => {
        const displayName =
          n.senderName ||
          n.sender ||
          n.user ||
          n.actorName ||
          n.generatedBy ||
          "User";

        const timeText = formatTimeAgo(n.createdAt, now);

        return (
          <div key={n.id ?? i} className="flex flex-col gap-4 w-80">
            <button
              type="button"
              onClick={() => handleToggle(i)}
              className="flex justify-between items-start w-full"
            >
              <p className="text-black text-sm leading-[18px] text-left mr-3">
                <span className="font-semibold">{displayName} </span>
                {n.message || "has generated a new report! Check it out."}
              </p>

              <img
                src="/icons/icon_expand_down.png"
                alt=""
                className={`w-2.5 h-2 flex-shrink-0 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>

            <time className="text-stone-500 text-xs">{timeText}</time>

            {openIndex === i && (
              <button
                type="button"
                onClick={() => handleCheck(n)}
                className="mt-1 w-16 h-6 px-2 py-1 bg-zinc-100 rounded-md text-black text-sm"
             >
                Check
              </button>
            )}

            {i !== notifications.length - 1 && (
              <hr className="mt-2 w-80 outline outline-[0.5px] outline-stone-300" />
            )}
          </div>
        );
      })}
    </section>
  );
}

export default NotificationCard;
