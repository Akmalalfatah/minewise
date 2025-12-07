import React from "react";

function NotificationSection({ hasUnread = true, onClick }) {
  return (
    <button
      type="button"
      data-layer="notification_section"
      className="NotificationSection w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
      onClick={onClick}
    >
      <div className="relative w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
        <img
          data-layer="icon_notification"
          className="w-4 h-4"
          src="/icons/icon_notification.png"
          alt="notification"
        />
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
        )}
      </div>
    </button>
  );
}

export default NotificationSection;
