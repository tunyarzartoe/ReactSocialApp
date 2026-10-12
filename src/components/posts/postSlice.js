import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sub from "date-fns/sub";
import axios from "axios";

const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

const DEFAULT_REACTIONS = {
  thumbsUp: 0,
  wow: 0,
  heart: 0,
  rocket: 0,
  coffee: 0,
};

// ─── Thunks ───────────────────────────────────────────────────
export const getAllPosts = createAsyncThunk("posts/getAllPosts", async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (newPost) => {
    const response = await axios.post(BASE_URL, newPost);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (postData) => {
    const { id } = postData;
    const response = await axios.put(`${BASE_URL}/${id}`, postData);
    // JSONPlaceholder echoes the body; merge reactions from input
    return { ...response.data, reactions: postData.reactions };
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ id }) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    if (response.status === 200) return id;
    throw new Error(`Delete failed with status ${response.status}`);
  }
);

// ─── Slice ────────────────────────────────────────────────────
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addReaction(state, action) {
      const { postId, reaction } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post && post.reactions) {
        post.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      // getAllPosts
      .addCase(getAllPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        let min = 1;
        const mapped = action.payload.map((post) => ({
          id: post.id,
          title: post.title,
          body: post.body,
          userId: post.userId,
          date: sub(new Date(), { minutes: min++ }).toISOString(),
          reactions: { ...DEFAULT_REACTIONS },
        }));
        state.posts = mapped;
        state.status = "success";
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message;
      })

      // addNewPost
      .addCase(addNewPost.fulfilled, (state, action) => {
        const payload = action.payload;
        state.posts.unshift({
          id: payload.id,
          title: payload.title,
          body: payload.body,
          userId: Number(payload.userId),
          date: new Date().toISOString(),
          reactions: { ...DEFAULT_REACTIONS },
        });
      })

      // updatePost
      .addCase(updatePost.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated?.id) return;
        const idx = state.posts.findIndex((p) => p.id === updated.id);
        if (idx !== -1) {
          state.posts[idx] = {
            ...state.posts[idx],
            title: updated.title,
            body: updated.body,
            userId: Number(updated.userId),
            reactions: updated.reactions || state.posts[idx].reactions,
            date: new Date().toISOString(),
          };
        }
      })

      // deletePost
      .addCase(deletePost.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.posts = state.posts.filter((p) => p.id !== deletedId);
      });
  },
});

// ─── Selectors ────────────────────────────────────────────────
export const fetchAllPosts = (state) => state.posts.posts;
export const getPostById = (state, postId) =>
  state.posts.posts.find((p) => p.id === postId);
export const getPostStatus = (state) => state.posts.status;
export const getPostError = (state) => state.posts.error;

export const { addReaction } = postSlice.actions;
export default postSlice.reducer;
