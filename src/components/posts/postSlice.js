import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sub from "date-fns/sub";
import axios from "axios";

const GET_URL = "https://jsonplaceholder.typicode.com/posts";

const sampleImages = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
  null,
  null,
];

const sampleCategories = [
  "Technology",
  "Design",
  "Development",
  "Artificial Intelligence",
  "Productivity",
  "Community",
  "Career",
];

export const getAllPosts = createAsyncThunk("posts/getAllPosts", async () => {
  const response = await axios.get(GET_URL);
  return [...response.data];
});

export const fetchCommentsForPost = createAsyncThunk(
  "posts/fetchCommentsForPost",
  async (postId) => {
    const response = await axios.get(`${GET_URL}/${postId}/comments`);
    return { postId, comments: response.data };
  }
);

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    try {
      const response = await axios.post(GET_URL, initialPost);
      return { ...initialPost, id: response.data.id || Date.now() };
    } catch (err) {
      return { ...initialPost, id: Date.now() };
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${GET_URL}/${id}`, initialPost);
      return { ...initialPost, ...response.data };
    } catch (err) {
      return initialPost;
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPostId) => {
    try {
      await axios.delete(`${GET_URL}/${initialPostId}`);
      return initialPostId;
    } catch (err) {
      return initialPostId;
    }
  }
);

const initialState = {
  posts: [],
  status: "idle",
  error: null,
  savedPostIds: [1, 3],
  userReactions: {}, // { [postId]: { thumbsUp: true, heart: false, ... } }
  comments: {}, // { [postId]: [ { id, name, email, body, date, likes, userLiked } ] }
  commentsLoading: {},
  // Filters & Search
  searchQuery: "",
  selectedCategory: "All",
  feedTab: "all", // 'all' | 'saved' | 'my-posts' | 'trending'
  sortBy: "newest", // 'newest' | 'oldest' | 'most-liked' | 'most-comments'
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    toggleReaction: (state, action) => {
      const { postId, reaction } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;

      if (!state.userReactions[postId]) {
        state.userReactions[postId] = {};
      }

      const hasReacted = state.userReactions[postId][reaction];
      if (hasReacted) {
        state.userReactions[postId][reaction] = false;
        post.reactions[reaction] = Math.max(0, (post.reactions[reaction] || 0) - 1);
      } else {
        state.userReactions[postId][reaction] = true;
        post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
      }
    },
    // Backwards compatibility
    addReaction: (state, action) => {
      const { postId, reaction } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        if (!state.userReactions[postId]) {
          state.userReactions[postId] = {};
        }
        const hasReacted = state.userReactions[postId][reaction];
        if (hasReacted) {
          state.userReactions[postId][reaction] = false;
          post.reactions[reaction] = Math.max(0, (post.reactions[reaction] || 0) - 1);
        } else {
          state.userReactions[postId][reaction] = true;
          post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
        }
      }
    },
    toggleBookmark: (state, action) => {
      const postId = action.payload;
      if (state.savedPostIds.includes(postId)) {
        state.savedPostIds = state.savedPostIds.filter((id) => id !== postId);
      } else {
        state.savedPostIds.push(postId);
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      if (!state.comments[postId]) {
        state.comments[postId] = [];
      }
      const newComment = {
        id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        postId,
        name: comment.name || "Anonymous",
        email: comment.email || "user@reactsocial.app",
        body: comment.body,
        date: new Date().toISOString(),
        likes: 0,
        userLiked: false,
        avatar: comment.avatar,
        userId: comment.userId,
      };
      state.comments[postId].unshift(newComment);

      // Update post comment count
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.commentsCount = (post.commentsCount || 0) + 1;
      }
    },
    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload;
      if (state.comments[postId]) {
        state.comments[postId] = state.comments[postId].filter(
          (c) => c.id !== commentId
        );
        const post = state.posts.find((p) => p.id === postId);
        if (post && post.commentsCount > 0) {
          post.commentsCount -= 1;
        }
      }
    },
    toggleLikeComment: (state, action) => {
      const { postId, commentId } = action.payload;
      if (state.comments[postId]) {
        const comment = state.comments[postId].find((c) => c.id === commentId);
        if (comment) {
          if (comment.userLiked) {
            comment.userLiked = false;
            comment.likes = Math.max(0, (comment.likes || 0) - 1);
          } else {
            comment.userLiked = true;
            comment.likes = (comment.likes || 0) + 1;
          }
        }
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setFeedTab: (state, action) => {
      state.feedTab = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        let min = 1;
        const fakePosts = action.payload;
        const posts = fakePosts.map((post, index) => {
          const cat = sampleCategories[index % sampleCategories.length];
          const img = sampleImages[index % sampleImages.length];
          const thumbsUp = ((post.id * 7) % 28) + 2;
          const heart = ((post.id * 11) % 19) + 1;
          const rocket = ((post.id * 5) % 12);
          const wow = ((post.id * 3) % 8);
          const coffee = ((post.id * 2) % 6);
          const fire = ((post.id * 9) % 15);

          return {
            id: post.id,
            userId: post.userId || ((post.id % 10) + 1),
            title: post.title,
            body: post.body,
            category: cat,
            image: img,
            date: sub(new Date(), {
              minutes: min * 25 + (post.id * 3),
            }).toISOString(),
            reactions: {
              thumbsUp,
              heart,
              rocket,
              wow,
              coffee,
              fire,
            },
            commentsCount: (post.id % 5) + 1,
            viewsCount: (post.id * 43) + 120,
          };
        });
        state.posts = posts;
        state.status = "success";
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message;
      })
      .addCase(fetchCommentsForPost.pending, (state, action) => {
        state.commentsLoading[action.meta.arg] = true;
      })
      .addCase(fetchCommentsForPost.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.commentsLoading[postId] = false;
        if (!state.comments[postId]) {
          state.comments[postId] = comments.map((c, idx) => ({
            id: c.id,
            postId: c.postId,
            name: c.name,
            email: c.email,
            body: c.body,
            date: sub(new Date(), { minutes: (idx + 1) * 35 }).toISOString(),
            likes: (c.id % 7),
            userLiked: false,
          }));
        }
      })
      .addCase(fetchCommentsForPost.rejected, (state, action) => {
        state.commentsLoading[action.meta.arg] = false;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        const maxId = state.posts.reduce(
          (max, p) => (typeof p.id === "number" && p.id > max ? p.id : max),
          100
        );
        const newPost = {
          ...action.payload,
          id: maxId + 1,
          userId: Number(action.payload.userId) || 1,
          date: new Date().toISOString(),
          category: action.payload.category || "Technology",
          image: action.payload.image || null,
          reactions: {
            thumbsUp: 0,
            heart: 0,
            rocket: 0,
            wow: 0,
            coffee: 0,
            fire: 0,
          },
          commentsCount: 0,
          viewsCount: 1,
        };
        state.posts.unshift(newPost);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) return;
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = {
            ...state.posts[index],
            ...action.payload,
            date: new Date().toISOString(),
          };
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;
        state.posts = state.posts.filter((p) => p.id !== postId);
        state.savedPostIds = state.savedPostIds.filter((id) => id !== postId);
        delete state.comments[postId];
      });
  },
});

export const fetchAllPosts = (state) => state.posts.posts;
export const getPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === Number(postId));
export const getPostStatus = (state) => state.posts.status;
export const getPostError = (state) => state.posts.error;
export const getSavedPostIds = (state) => state.posts.savedPostIds;
export const getUserReactions = (state) => state.posts.userReactions;
export const getPostComments = (state, postId) =>
  state.posts.comments[postId] || [];
export const getCommentsLoading = (state, postId) =>
  state.posts.commentsLoading[postId] || false;
export const getSearchQuery = (state) => state.posts.searchQuery;
export const getSelectedCategory = (state) => state.posts.selectedCategory;
export const getFeedTab = (state) => state.posts.feedTab;
export const getSortBy = (state) => state.posts.sortBy;

export const {
  toggleReaction,
  addReaction,
  toggleBookmark,
  addComment,
  deleteComment,
  toggleLikeComment,
  setSearchQuery,
  setSelectedCategory,
  setFeedTab,
  setSortBy,
} = postSlice.actions;

export default postSlice.reducer;
