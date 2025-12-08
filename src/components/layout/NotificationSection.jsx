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
      data-layer="notification_section"
      onClick={onClick}
      className="NotificationSection w-12 h-12 bg-white rounded-full flex items-center justify-center"
    >
      <div className="relative w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">
        <img
          data-layer="icon_notification"
          className="w-5 h-5"
          src={iconSrc}
          alt="notification bell"
        />
      </div>
    </button>
  );
}

export default NotificationSection;
