import { create } from "zustand";
import { userStore } from "./userStore";

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
      const currentUserState = userStore.getState();
      const currentUser = currentUserState.user || currentUserState.profile;

      const senderName =
        notif.senderName ||
        currentUser?.full_name ||
        currentUser?.fullName ||
        currentUser?.name ||
        currentUser?.username ||
        "User";

      const item = {
        ...notif,
        id: notif.id ?? now,
        createdAt: notif.createdAt ?? now,
        senderName,
        message: notif.message || "has generated a new report! Check it out.",
      };

      const updated = [item, ...state.notifications];
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
      const unread = Math.max(0, state.unreadCount - 1);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(UNREAD_KEY, JSON.stringify(unread));

      return {
        notifications: updated,
        unreadCount: unread,
      };
    }),

  clearNotifications: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(UNREAD_KEY);
    set({ notifications: [], unreadCount: 0 });
  },
}));
