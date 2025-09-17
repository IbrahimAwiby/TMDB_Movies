import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./slices/moviesSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    auth: authReducer,
  },
});
