import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const GET_URL = "https://jsonplaceholder.typicode.com/users";

// Pre-defined high-quality avatar and cover images for users
const userAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
];

const userCovers = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
];

const userBios = [
  "Senior Full-Stack Engineer & Open Source enthusiast. Building modern web experiences.",
  "Product Designer & Design Systems advocate. Passionate about minimalism and UX.",
  "Tech lead, AI researcher, and coffee addict. Writing about architecture and cloud.",
  "Frontend craftsman & React specialist. Exploring 3D web, UI animations, and shaders.",
  "DevOps Engineer & Kubernetes lover. Passionate about automated pipelines and security.",
  "Mobile dev & flutter ninja. Crafting beautiful apps with great attention to detail.",
  "Data Scientist & Machine Learning Engineer. Finding patterns in complex datasets.",
  "Founder & Startup Builder. Passionate about community, SaaS, and developer tools.",
  "Cloud Architect & Cybersecurity enthusiast. Writing guides for developers.",
  "Digital Creator & Developer Advocate. Helping tech communities thrive worldwide.",
];

export const getAllUsers = createAsyncThunk("users/getAllUsers", async () => {
  const response = await axios.get(GET_URL);
  return response.data;
});

const initialState = {
  users: [],
  status: "idle",
  error: null,
  currentUserId: 1, // Logged-in user is Leanne Graham by default
  followingUserIds: [2, 4], // Currently following Ervin and Patricia
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUserId = action.payload;
    },
    toggleFollowUser: (state, action) => {
      const targetUserId = action.payload;
      if (state.followingUserIds.includes(targetUserId)) {
        state.followingUserIds = state.followingUserIds.filter(
          (id) => id !== targetUserId
        );
      } else {
        state.followingUserIds.push(targetUserId);
      }
    },
    updateUserProfile: (state, action) => {
      const { id, name, bio, website, phone, company } = action.payload;
      const existingUser = state.users.find((u) => u.id === id);
      if (existingUser) {
        if (name) existingUser.name = name;
        if (bio) existingUser.bio = bio;
        if (website) existingUser.website = website;
        if (phone) existingUser.phone = phone;
        if (company) existingUser.company = { ...existingUser.company, ...company };
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.map((user, index) => {
          const avatar = userAvatars[index % userAvatars.length];
          const cover = userCovers[index % userCovers.length];
          const bio = userBios[index % userBios.length];
          const followers = 120 + (user.id * 37) % 450;
          const following = 45 + (user.id * 19) % 210;

          return {
            ...user,
            avatar,
            cover,
            bio,
            followers,
            following,
            handle: `@${user.username.toLowerCase()}`,
          };
        });
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
  state.users.users.find((user) => user.id === Number(userId));
export const getCurrentUserId = (state) => state.users.currentUserId;
export const getCurrentUser = (state) =>
  state.users.users.find((user) => user.id === state.users.currentUserId) ||
  state.users.users[0] ||
  null;
export const getFollowingUserIds = (state) => state.users.followingUserIds;
export const getUserStatus = (state) => state.users.status;
export const getUserError = (state) => state.users.error;

export const { setCurrentUser, toggleFollowUser, updateUserProfile } =
  userSlice.actions;

export default userSlice.reducer;
