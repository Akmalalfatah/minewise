import { create } from "zustand";

const STORAGE_KEY = "notifications";
const UNREAD_KEY = "unreadCount";

const loadNotifications = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const loadUnread = () => {
  try {
    return JSON.parse(localStorage.getItem(UNREAD_KEY) || "0");
  } catch {
    return 0;
  }
};

export const notificationStore = create((set) => ({
  notifications: loadNotifications(),
  unreadCount: loadUnread(),

  addNotification: (notif) =>
    set((state) => {
      const now = Date.now();
      const withMeta = {
        id: now,
        createdAt: now,
        ...notif,
      };

      const updated = [withMeta, ...state.notifications];
      const unread = state.unreadCount + 1;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(UNREAD_KEY, JSON.stringify(unread));

      return {
        notifications: updated,
        unreadCount: unread,
      };
    }),

  markAllRead: () =>
    set(() => {
      localStorage.setItem(UNREAD_KEY, JSON.stringify(0));
      return { unreadCount: 0 };
    }),

  removeNotification: (id) =>
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { notifications: updated };
    }),

  clearNotifications: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(UNREAD_KEY);
    set({ notifications: [], unreadCount: 0 });
  },
}));
