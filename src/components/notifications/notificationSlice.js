import { createSlice } from "@reduxjs/toolkit";
import sub from "date-fns/sub";

const initialNotifications = [
  {
    id: "n1",
    userId: 2,
    userName: "Ervin Howell",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    action: "liked your post",
    target: "Building Scalable Web Applications with React & Redux",
    postId: 1,
    time: sub(new Date(), { minutes: 12 }).toISOString(),
    read: false,
    type: "like",
  },
  {
    id: "n2",
    userId: 3,
    userName: "Clementine Bauch",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    action: "started following you",
    target: null,
    postId: null,
    time: sub(new Date(), { hours: 2 }).toISOString(),
    read: false,
    type: "follow",
  },
  {
    id: "n3",
    userId: 4,
    userName: "Patricia Lebsack",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    action: "commented on",
    target: "Modern UI trends & Glassmorphism Design",
    postId: 2,
    time: sub(new Date(), { hours: 5 }).toISOString(),
    read: true,
    type: "comment",
  },
  {
    id: "n4",
    userId: 5,
    userName: "Chelsey Dietrich",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    action: "reacted 🚀 to your post",
    target: "Optimizing Web Performance & Core Web Vitals",
    postId: 3,
    time: sub(new Date(), { days: 1 }).toISOString(),
    read: true,
    type: "reaction",
  },
];

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: initialNotifications,
    unreadCount: 2,
  },
  reducers: {
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: `n_${Date.now()}`,
        time: new Date().toISOString(),
        read: false,
        ...action.payload,
      });
      state.unreadCount += 1;
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const selectAllNotifications = (state) =>
  state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;

export const {
  markAsRead,
  markAllAsRead,
  addNotification,
  clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
