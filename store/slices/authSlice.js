// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signUpWithEmail,
  signInWithEmail,
  signOutCurrentUser,
} from "../../services/firebase";

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const user = await signUpWithEmail({ email, password, displayName });
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await signInWithEmail({ email, password });
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await signOutCurrentUser();
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })

      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })

      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.status = "idle";
        s.error = null;
      })
      .addCase(logoutUser.rejected, (s, a) => {
        s.error = a.payload || a.error.message;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
