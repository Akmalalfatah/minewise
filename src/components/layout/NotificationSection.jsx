import React from "react";
import { notificationStore } from "../../store/notificationStore";

function NotificationSection({ onClick }) {
  const unreadCount = notificationStore((state) => state.unreadCount);

  const iconSrc =
    unreadCount > 0
      ? "/icons/icon_bell_active.png"
      : "/icons/icon_bell_non_active.png";

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center justify-center w-11 h-11 bg-white rounded-full shadow-sm hover:bg-gray-50 transition"
    >
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <img src={iconSrc} alt="notification" className="w-4 h-4" />
      </div>
    </button>
  );
}

export default NotificationSection;
