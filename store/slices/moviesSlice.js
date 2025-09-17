import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { movieAPI } from "../../services/api";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ page = 1 } = {}) => {
    const response = await movieAPI.getPopularMovies(page);
    return { ...response.data };
  }
);

export const fetchMovieDetails = createAsyncThunk(
  "movies/fetchMovieDetails",
  async ({ movieId } = {}) => {
    const response = await movieAPI.getMovieDetails(movieId);
    return { ...response.data };
  }
);

export const searchMovies = createAsyncThunk(
  "movies/searchMovies",
  async (payload, thunkAPI) => {
    let query, page;
    if (typeof payload === "string") {
      query = payload;
      page = 1;
    } else if (payload && typeof payload === "object") {
      query = payload.query;
      page = payload.page ?? 1;
    } else {
      return thunkAPI.rejectWithValue("Invalid search payload");
    }

    const response = await movieAPI.searchMovies(query, page);
    return { ...response.data, query };
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  "movies/fetchTrendingMovies",
  async ({ timeWindow = "week" } = {}) => {
    const response = await movieAPI.getTrendingMovies(timeWindow);
    return { ...response.data };
  }
);

export const fetchUpcomingMovies = createAsyncThunk(
  "movies/fetchUpcomingMovies",
  async ({ page = 1 } = {}) => {
    const response = await movieAPI.getUpcomingMovies(page);
    return { ...response.data };
  }
);

export const fetchTopRatedMovies = createAsyncThunk(
  "movies/fetchTopRatedMovies",
  async ({ page = 1 } = {}) => {
    const response = await movieAPI.getTopRatedMovies(page);
    return { ...response.data };
  }
);

export const fetchNowPlayingMovies = createAsyncThunk(
  "movies/fetchNowPlayingMovies",
  async ({ page = 1 } = {}) => {
    const response = await movieAPI.getNowPlayingMovies(page);
    return { ...response.data };
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    popular: {
      list: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
    },
    trending: {
      list: [],
      loading: false,
      error: null,
    },
    upcoming: {
      list: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
    },
    topRated: {
      list: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
    },
    nowPlaying: {
      list: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
    },
    search: {
      results: [],
      query: "",
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
    },
    details: {
      data: null,
      loading: false,
      error: null,
    },
  },
  reducers: {
    clearSearchResults: (state) => {
      state.search.results = [];
      state.search.query = "";
      state.search.currentPage = 1;
      state.search.totalPages = 0;
      state.search.totalResults = 0;
      state.search.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Popular Movies
      .addCase(fetchMovies.pending, (state) => {
        state.popular.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.popular.loading = false;
        state.popular.list = action.payload.results;
        state.popular.currentPage = action.payload.page;
        state.popular.totalPages = action.payload.total_pages;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.popular.loading = false;
        state.popular.error = action.error.message;
      })
      // Fetch Movie Details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.details.loading = true;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.details.loading = false;
        state.details.data = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.details.loading = false;
        state.details.error = action.error.message;
      })
      // Search Movies
      .addCase(searchMovies.pending, (state, action) => {
        state.search.loading = true;
        const arg = action.meta.arg;
        if (typeof arg === "string") state.search.query = arg;
        else if (arg && typeof arg === "object")
          state.search.query = arg.query ?? state.search.query;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.search.loading = false;
        state.search.results = action.payload.results || [];
        state.search.currentPage = action.payload.page || 1;
        state.search.totalPages = action.payload.total_pages || 0;
        state.search.totalResults = action.payload.total_results || 0;
        state.search.query = action.payload.query ?? state.search.query;
        state.search.error = null;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.error.message;
      })
      // Fetch Trending Movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.trending.loading = true;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trending.loading = false;
        state.trending.list = action.payload.results;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.trending.loading = false;
        state.trending.error = action.error.message;
      })
      // Fetch Upcoming Movies
      .addCase(fetchUpcomingMovies.pending, (state) => {
        state.upcoming.loading = true;
      })
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.upcoming.loading = false;
        state.upcoming.list = action.payload.results;
        state.upcoming.currentPage = action.payload.page;
        state.upcoming.totalPages = action.payload.total_pages;
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.upcoming.loading = false;
        state.upcoming.error = action.error.message;
      })
      // Fetch Top Rated Movies
      .addCase(fetchTopRatedMovies.pending, (state) => {
        state.topRated.loading = true;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.topRated.loading = false;
        state.topRated.list = action.payload.results;
        state.topRated.currentPage = action.payload.page;
        state.topRated.totalPages = action.payload.total_pages;
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.topRated.loading = false;
        state.topRated.error = action.error.message;
      })
      // Fetch Now Playing Movies
      .addCase(fetchNowPlayingMovies.pending, (state) => {
        state.nowPlaying.loading = true;
      })
      .addCase(fetchNowPlayingMovies.fulfilled, (state, action) => {
        state.nowPlaying.loading = false;
        state.nowPlaying.list = action.payload.results;
        state.nowPlaying.currentPage = action.payload.page;
        state.nowPlaying.totalPages = action.payload.total_pages;
      })
      .addCase(fetchNowPlayingMovies.rejected, (state, action) => {
        state.nowPlaying.loading = false;
        state.nowPlaying.error = action.error.message;
      });
  },
});

export const { clearSearchResults } = moviesSlice.actions;
export default moviesSlice.reducer;
