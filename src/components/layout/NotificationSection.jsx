import React from "react";

function NotificationSection({ hasUnread = true, onClick }) {
  const iconSrc = hasUnread
    ? "/icons/icon_bell_active.png"
    : "/icons/icon_bell_non_active.png";

  return (
    <button
      type="button"
      data-layer="notification_section"
      onClick={onClick}
      className="NotificationSection w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
    >
      <div className="relative w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
        <img
          data-layer="icon_notification"
          className="w-5 h-5"
          src={iconSrc}
          alt="notification bell"
        />

        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
        )}
      </div>
    </button>
  );
}

export default NotificationSection;
