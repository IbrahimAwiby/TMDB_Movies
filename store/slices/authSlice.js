import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signUpWithEmail,
  signInWithEmail,
  signOutCurrentUser,
} from "../../services/firebase";

// Helper functions for localStorage
const getSavedMoviesFromStorage = (uid) => {
  try {
    const saved = localStorage.getItem(`savedMovies_${uid}`);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

const saveMoviesToStorage = (uid, movies) => {
  try {
    localStorage.setItem(`savedMovies_${uid}`, JSON.stringify(movies));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const user = await signUpWithEmail({ email, password, displayName });
      const savedMovies = getSavedMoviesFromStorage(user.uid);

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        savedMovies,
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
      const savedMovies = getSavedMoviesFromStorage(user.uid);

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        savedMovies,
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

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

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

      // Save to localStorage
      saveMoviesToStorage(currentUser.uid, updatedSavedMovies);

      return updatedSavedMovies;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Load saved movies from storage
export const loadSavedMovies = createAsyncThunk(
  "auth/loadSavedMovies",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const currentUser = auth.user;

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const savedMovies = getSavedMoviesFromStorage(currentUser.uid);
      return savedMovies;
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
      // FIXED: Check if payload is null before accessing its properties
      if (action.payload === null) {
        state.user = null;
        state.status = "idle";
        state.error = null;
        return;
      }

      const savedMovies = action.payload.uid
        ? getSavedMoviesFromStorage(action.payload.uid)
        : [];

      state.user = {
        ...action.payload,
        savedMovies,
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
        saveMoviesToStorage(state.user.uid, action.payload);
      }
    },
    // Clear saved movies from localStorage when needed
    clearSavedMoviesStorage(state) {
      if (state.user) {
        localStorage.removeItem(`savedMovies_${state.user.uid}`);
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
      })

      .addCase(loadSavedMovies.fulfilled, (s, a) => {
        if (s.user) {
          s.user.savedMovies = a.payload;
        }
      });
  },
});

export const {
  setUser,
  clearError,
  updateSavedMovies,
  clearSavedMoviesStorage,
} = authSlice.actions;
export default authSlice.reducer;
