import { create } from "zustand";

export const notificationStore = create((set) => ({
  notifications: JSON.parse(localStorage.getItem("notifications")) || [],
  unreadCount: JSON.parse(localStorage.getItem("unreadCount")) || 0,

  addNotification: (notif) =>
    set((state) => {
      const updated = [notif, ...state.notifications];
      const unread = state.unreadCount + 1;

      localStorage.setItem("notifications", JSON.stringify(updated));
      localStorage.setItem("unreadCount", unread);

      return {
        notifications: updated,
        unreadCount: unread,
      };
    }),

  markAllRead: () =>
    set(() => {
      localStorage.setItem("unreadCount", 0);
      return { unreadCount: 0 };
    }),

  clearNotifications: () => {
    localStorage.removeItem("notifications");
    localStorage.removeItem("unreadCount");
    set({ notifications: [], unreadCount: 0 });
  },
}));
