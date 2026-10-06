import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../components/posts/postSlice";
import userReducer from "../components/users/userSlice";
import notificationReducer from "../components/notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    posts: postReducer,
    users: userReducer,
    notifications: notificationReducer,
  },
});