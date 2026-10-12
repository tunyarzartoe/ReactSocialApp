import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

const GET_URL = "https://jsonplaceholder.typicode.com/users";

export const getAllUsers = createAsyncThunk("users/getAllUsers", async () => {
  const response = await axios.get(GET_URL);
  return response.data;
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.status = "success";
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message;
      });
  },
});

export const fetchAllUsers = (state) => state.users.users;
export const getUserById = (state, userId) =>
  state.users.users.find((user) => user.id === userId);
export const getUserStatus = (state) => state.users.status;
export const getUserError = (state) => state.users.error;

export default userSlice.reducer;
