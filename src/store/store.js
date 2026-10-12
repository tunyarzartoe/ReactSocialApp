import { configureStore } from "@reduxjs/toolkit";
import postSlice from "../components/posts/postSlice";
import userSlice from "../components/users/userSlice";

export const store = configureStore({
    reducer:{
        posts:postSlice,
        users:userSlice
    }
})