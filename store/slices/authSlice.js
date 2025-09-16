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
        savedMovies: [], // Add savedMovies array to user object
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
        savedMovies: user.savedMovies || [], // Add savedMovies array
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

// Save movie action
export const saveMovie = createAsyncThunk(
  "auth/saveMovie",
  async (movieData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const currentUser = auth.user;

      // Check if movie is already saved
      const isMovieSaved = currentUser.savedMovies?.some(
        (movie) => movie.id === movieData.id
      );

      let updatedSavedMovies;

      if (isMovieSaved) {
        // Remove movie if already saved
        updatedSavedMovies = currentUser.savedMovies.filter(
          (movie) => movie.id !== movieData.id
        );
      } else {
        // Add movie if not saved
        updatedSavedMovies = [...(currentUser.savedMovies || []), movieData];
      }

      // Here you would typically update the user's saved movies in your database
      // For now, we'll just update the local state

      return updatedSavedMovies;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = {
        ...action.payload,
        savedMovies: action.payload.savedMovies || [],
      };
      state.status = "succeeded";
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    updateSavedMovies(state, action) {
      if (state.user) {
        state.user.savedMovies = action.payload;
      }
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
        s.user = {
          ...a.payload,
          savedMovies: a.payload.savedMovies || [],
        };
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
        s.user = {
          ...a.payload,
          savedMovies: a.payload.savedMovies || [],
        };
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
      })

      .addCase(saveMovie.fulfilled, (s, a) => {
        if (s.user) {
          s.user.savedMovies = a.payload;
        }
      });
  },
});

export const { setUser, clearError, updateSavedMovies } = authSlice.actions;
export default authSlice.reducer;
