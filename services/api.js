// services/api.js
import axios from "axios";

const API_KEY = "b3693935f4a3d27d1b9b6f6f629e0190";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const movieAPI = {
  getPopularMovies: (page = 1) =>
    api.get("/movie/popular", { params: { page } }),

  getMovieDetails: (movieId) =>
    api.get(`/movie/${movieId}`, {
      params: { append_to_response: "credits,videos,similar" },
    }),

  searchMovies: (query, page = 1) =>
    api.get("/search/movie", { params: { query, page } }),

  getTrendingMovies: (timeWindow = "week") =>
    api.get(`/trending/movie/${timeWindow}`),

  getUpcomingMovies: (page = 1) =>
    api.get("/movie/upcoming", { params: { page } }),

  getGenres: () => api.get("/genre/movie/list"),
};

export const getImageUrl = (path, size = "w500") => {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
};

export default api;
